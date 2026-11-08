
namespace SchoolAdmission.Api.Models;

public class SchoolClass
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public int TotalSeats { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
        = DateTimeOffset.UtcNow;

    // Navigation property:
    // One class can have multiple admission applications.
    public ICollection<AdmissionHold> AdmissionHolds { get; set; }
        = new List<AdmissionHold>();
}
