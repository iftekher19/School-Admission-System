using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Contracts.Holds;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Models;
using SchoolAdmission.Api.Helpers;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("me")]
public class MeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MeController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET /me/holds
    [HttpGet("holds")]
    public async Task<IActionResult> GetMyHolds(
        [FromHeader(Name = "X-Student-Id")] string? studentId)
    {
        if (!StudentIdValidator.IsValid(studentId))
        {
            return BadRequest(new
            {
                message = "X-Student-Id must contain exactly 17 numeric digits."
            });
        }

        // Mark this student's expired holds before retrieving history.
        var now = DateTimeOffset.UtcNow;

        await _context.AdmissionHolds
            .Where(h =>
                h.StudentId == studentId &&
                h.Status == AdmissionHoldStatus.HELD &&
                h.ExpiresAt <= now)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(
                    h => h.Status,
                    AdmissionHoldStatus.EXPIRED
                )
            );

        // Retrieve the student's complete application history.
        var holds = await _context.AdmissionHolds
            .AsNoTracking()
            .Where(h => h.StudentId == studentId)
            .OrderByDescending(h => h.CreatedAt)
            .Select(h => new StudentHoldResponse
            {
                HoldId = h.Id,
                ClassId = h.ClassId,
                ClassName = h.SchoolClass!.Name,
                Status = h.Status.ToString(),
                ExpiresAt = h.ExpiresAt
            })
            .ToListAsync();

        return Ok(holds);
    }
}