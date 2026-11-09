using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using SchoolAdmission.Api.Contracts.Holds;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Models;
using SchoolAdmission.Api.Helpers;
namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("classes/{classId:guid}/holds")]
public class HoldsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public HoldsController(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST /classes/{classId}/holds
    [HttpPost]
    public async Task<IActionResult> CreateHold(
        Guid classId,
        [FromHeader(Name = "X-Student-Id")] string? studentId)
    {
        // 1. Validate the 17-digit student registration number.
        if (!StudentIdValidator.IsValid(studentId))
        {
            return BadRequest(new
            {
                message = "X-Student-Id must contain exactly 17 numeric digits."
            });
        }

        // 2. Read hold duration from configuration.
        // Default: 600 seconds = 10 minutes.
        var holdDuration = _configuration
            .GetValue<int?>("HOLD_DURATION_SECONDS") ?? 600;

        if (holdDuration <= 0)
        {
            return StatusCode(500, new
            {
                message = "Invalid hold duration configuration."
            });
        }

        var now = DateTimeOffset.UtcNow;

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // 3. Lock the class row.
            // Concurrent requests for this class must wait.
            var schoolClass = await _context.Classes
                .FromSqlInterpolated($"""
                    SELECT *
                    FROM "Classes"
                    WHERE "Id" = {classId}
                    FOR UPDATE
                    """)
                .FirstOrDefaultAsync();

            if (schoolClass == null)
            {
                await transaction.RollbackAsync();

                return NotFound(new
                {
                    message = "Class not found."
                });
            }

            // 4. Expire outdated holds for this class
            // and this student (including holds in other classes).
            await _context.Database.ExecuteSqlInterpolatedAsync($"""
                UPDATE "AdmissionHolds"
                SET "Status" = 'EXPIRED'
                WHERE "Status" = 'HELD'
                  AND "ExpiresAt" <= {now}
                  AND (
                      "ClassId" = {classId}
                      OR "StudentId" = {studentId}
                  )
                """);

            // 5. Check whether this student already
            // has an active or confirmed application.
            var existingApplication = await _context.AdmissionHolds
                .AnyAsync(h =>
                    h.StudentId == studentId &&
                    (h.Status == AdmissionHoldStatus.HELD ||
                     h.Status == AdmissionHoldStatus.CONFIRMED));

            if (existingApplication)
            {
                await transaction.RollbackAsync();

                return Conflict(new
                {
                    message = "You already have an active or confirmed application."
                });
            }

            // 6. Count currently held seats.
            var heldSeats = await _context.AdmissionHolds
                .CountAsync(h =>
                    h.ClassId == classId &&
                    h.Status == AdmissionHoldStatus.HELD &&
                    h.ExpiresAt > now);

            // 7. Count confirmed seats.
            var confirmedSeats = await _context.AdmissionHolds
                .CountAsync(h =>
                    h.ClassId == classId &&
                    h.Status == AdmissionHoldStatus.CONFIRMED);

            // 8. Check availability.
            var availableSeats =
                schoolClass.TotalSeats - heldSeats - confirmedSeats;

            if (availableSeats <= 0)
            {
                await transaction.RollbackAsync();

                return Conflict(new
                {
                    message = "Sorry, no seats are available."
                });
            }

            // 9. Create the new hold.
            var hold = new AdmissionHold
            {
                Id = Guid.NewGuid(),
                ClassId = classId,
                StudentId = studentId,
                Status = AdmissionHoldStatus.HELD,
                CreatedAt = now,
                ExpiresAt = now.AddSeconds(holdDuration)
            };

            _context.AdmissionHolds.Add(hold);

            await _context.SaveChangesAsync();

            // 10. Commit transaction.
            await transaction.CommitAsync();

            // 11. Return 201 Created.
            var response = new CreateHoldResponse
            {
                HoldId = hold.Id,
                ClassId = hold.ClassId,
                StudentId = hold.StudentId,
                Status = "HELD",
                ExpiresAt = hold.ExpiresAt
            };

            return StatusCode(
                StatusCodes.Status201Created,
                response
            );
        }
        catch (DbUpdateException ex)
            when (IsUniqueViolation(ex))
        {
            await transaction.RollbackAsync();

            return Conflict(new
            {
                message = "You already have an active or confirmed application."
            });
        }
    }

    private static bool IsUniqueViolation(DbUpdateException exception)
    {
        return exception.InnerException is PostgresException postgresException
            && postgresException.SqlState == PostgresErrorCodes.UniqueViolation;
    }
}