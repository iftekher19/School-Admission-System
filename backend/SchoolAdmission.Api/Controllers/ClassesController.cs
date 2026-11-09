using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Contracts.Classes;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Models;

namespace SchoolAdmission.Api.Controllers;

[ApiController]
[Route("classes")]
public class ClassesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClassesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST /classes
    [HttpPost]
    public async Task<IActionResult> CreateClass(
        CreateClassRequest request)
    {
        var schoolClass = new SchoolClass
        {
            Name = request.Name.Trim(),
            TotalSeats = request.TotalSeats
        };

        _context.Classes.Add(schoolClass);

        await _context.SaveChangesAsync();

        var response = new
        {
            id = schoolClass.Id,
            name = schoolClass.Name,
            totalSeats = schoolClass.TotalSeats
        };

        return CreatedAtAction(
            nameof(GetClass),
            new { classId = schoolClass.Id },
            response
        );
    }

    // GET /classes
    [HttpGet]
    public async Task<IActionResult> GetClasses()
    {
        var classes = await _context.Classes
            .AsNoTracking()
            .ToListAsync();

        var now = DateTimeOffset.UtcNow;

        var responses = new List<ClassResponse>();

        foreach (var schoolClass in classes)
        {
            var holds = await _context.AdmissionHolds
                .AsNoTracking()
                .Where(h => h.ClassId == schoolClass.Id)
                .ToListAsync();

            var heldSeats = holds.Count(h =>
                h.Status == AdmissionHoldStatus.HELD &&
                h.ExpiresAt > now);

            var confirmedSeats = holds.Count(h =>
                h.Status == AdmissionHoldStatus.CONFIRMED);

            responses.Add(new ClassResponse
            {
                Id = schoolClass.Id,
                Name = schoolClass.Name,
                TotalSeats = schoolClass.TotalSeats,
                HeldSeats = heldSeats,
                ConfirmedSeats = confirmedSeats,
                AvailableSeats = schoolClass.TotalSeats
                    - heldSeats
                    - confirmedSeats
            });
        }

        return Ok(responses);
    }

    // GET /classes/{classId}
    [HttpGet("{classId:guid}")]
    public async Task<IActionResult> GetClass(Guid classId)
    {
        var schoolClass = await _context.Classes
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == classId);

        if (schoolClass == null)
        {
            return NotFound(new
            {
                message = "Class not found."
            });
        }

        var now = DateTimeOffset.UtcNow;

        var holds = await _context.AdmissionHolds
            .AsNoTracking()
            .Where(h => h.ClassId == classId)
            .ToListAsync();

        var heldSeats = holds.Count(h =>
            h.Status == AdmissionHoldStatus.HELD &&
            h.ExpiresAt > now);

        var confirmedSeats = holds.Count(h =>
            h.Status == AdmissionHoldStatus.CONFIRMED);

        var response = new ClassResponse
        {
            Id = schoolClass.Id,
            Name = schoolClass.Name,
            TotalSeats = schoolClass.TotalSeats,
            HeldSeats = heldSeats,
            ConfirmedSeats = confirmedSeats,
            AvailableSeats = schoolClass.TotalSeats
                - heldSeats
                - confirmedSeats
        };

        return Ok(response);
    }
}