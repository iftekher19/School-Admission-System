namespace SchoolAdmission.Api.Contracts.Holds;

public class CreateHoldResponse
{
    public Guid HoldId { get; set; }

    public Guid ClassId { get; set; }

    public string StudentId { get; set; } = string.Empty;

    public string Status { get; set; } = "HELD";

    public DateTimeOffset ExpiresAt { get; set; }
}