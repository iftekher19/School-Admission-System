using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Models;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("holds")]
public class HoldsManagementController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HoldsManagementController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET /holds/{holdId}
[HttpGet("{holdId:guid}")]
public async Task<IActionResult> GetHold(Guid holdId)
{
    var now = DateTimeOffset.UtcNow;

    await _context.AdmissionHolds
        .Where(h =>
            h.Id == holdId &&
            h.Status == AdmissionHoldStatus.HELD &&
            h.ExpiresAt <= now)
        .ExecuteUpdateAsync(setters =>
            setters.SetProperty(
                h => h.Status,
                AdmissionHoldStatus.EXPIRED
            )
        );

    var hold = await _context.AdmissionHolds
        .AsNoTracking()
        .FirstOrDefaultAsync(h => h.Id == holdId);

    if (hold == null)
    {
        return NotFound(new
        {
            message = "Admission hold not found."
        });
    }

    return Ok(new
    {
        holdId = hold.Id,
        classId = hold.ClassId,
        status = hold.Status.ToString(),
        expiresAt = hold.ExpiresAt
    });
}

    // POST /holds/{holdId}/confirm
    [HttpPost("{holdId:guid}/confirm")]
    public async Task<IActionResult> ConfirmHold(
        Guid holdId,
        [FromHeader(Name = "X-Student-Id")] string? studentId)
    {
        if (string.IsNullOrWhiteSpace(studentId))
        {
            return BadRequest(new
            {
                message = "X-Student-Id header is required."
            });
        }

        studentId = studentId.Trim();

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        // Lock this hold so simultaneous confirmation requests
        // cannot change its status at the same time.
        var hold = await _context.AdmissionHolds
            .FromSqlInterpolated($"""
                SELECT *
                FROM "AdmissionHolds"
                WHERE "Id" = {holdId}
                FOR UPDATE
                """)
            .FirstOrDefaultAsync();

        if (hold == null)
        {
            await transaction.RollbackAsync();

            return NotFound(new
            {
                message = "Admission hold not found."
            });
        }

        if (hold.StudentId != studentId)
        {
            await transaction.RollbackAsync();

            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "You are not authorized to confirm this hold."
            });
        }

        // Repeated confirmation is safe.
        // Do not increment or create another confirmed seat.
        if (hold.Status == AdmissionHoldStatus.CONFIRMED)
        {
            await transaction.CommitAsync();

            return Ok(new
            {
                holdId = hold.Id,
                status = "CONFIRMED"
            });
        }

        if (hold.Status != AdmissionHoldStatus.HELD)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = $"This hold cannot be confirmed because its status is {hold.Status}."
            });
        }

        // Expired holds cannot be confirmed.
        if (hold.ExpiresAt <= DateTimeOffset.UtcNow)
        {
            hold.Status = AdmissionHoldStatus.EXPIRED;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Conflict(new
            {
                message = "This admission hold has expired. You cannot confirm it."
            });
        }

        // Change HELD to CONFIRMED.
        // The seat remains occupied; only its status changes.
        hold.Status = AdmissionHoldStatus.CONFIRMED;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            holdId = hold.Id,
            status = "CONFIRMED"
        });
    }

    // DELETE /holds/{holdId}
    [HttpDelete("{holdId:guid}")]
    public async Task<IActionResult> CancelHold(
        Guid holdId,
        [FromHeader(Name = "X-Student-Id")] string? studentId)
    {
        if (string.IsNullOrWhiteSpace(studentId))
        {
            return BadRequest(new
            {
                message = "X-Student-Id header is required."
            });
        }

        studentId = studentId.Trim();

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        // Lock the hold during cancellation.
        var hold = await _context.AdmissionHolds
            .FromSqlInterpolated($"""
                SELECT *
                FROM "AdmissionHolds"
                WHERE "Id" = {holdId}
                FOR UPDATE
                """)
            .FirstOrDefaultAsync();

        if (hold == null)
        {
            await transaction.RollbackAsync();

            return NotFound(new
            {
                message = "Admission hold not found."
            });
        }

        if (hold.StudentId != studentId)
        {
            await transaction.RollbackAsync();

            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                message = "You are not authorized to cancel this hold."
            });
        }

        // Cancellation is idempotent.
        if (hold.Status == AdmissionHoldStatus.CANCELLED)
        {
            await transaction.CommitAsync();
            return NoContent();
        }

        // A confirmed admission cannot be cancelled through
        // this hold-cancellation endpoint.
        if (hold.Status == AdmissionHoldStatus.CONFIRMED)
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "A confirmed admission cannot be cancelled using this endpoint."
            });
        }

        if (hold.Status == AdmissionHoldStatus.EXPIRED ||
            hold.ExpiresAt <= DateTimeOffset.UtcNow)
        {
            if (hold.Status == AdmissionHoldStatus.HELD)
            {
                hold.Status = AdmissionHoldStatus.EXPIRED;
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return Conflict(new
            {
                message = "This hold has already expired."
            });
        }

        // Release the seat by changing HELD to CANCELLED.
        hold.Status = AdmissionHoldStatus.CANCELLED;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return NoContent();
    }
}