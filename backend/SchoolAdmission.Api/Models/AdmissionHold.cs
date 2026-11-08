
namespace SchoolAdmission.Api.Models;

public class AdmissionHold
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Foreign key referencing SchoolClass
    public Guid ClassId { get; set; }

    // Student's birth registration number
    public string StudentId { get; set; } = string.Empty;

    public AdmissionHoldStatus Status { get; set; }
        = AdmissionHoldStatus.HELD;

    public DateTimeOffset ExpiresAt { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
        = DateTimeOffset.UtcNow;

    // Navigation property
    public SchoolClass? SchoolClass { get; set; }
}
