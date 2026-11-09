using System.ComponentModel.DataAnnotations;

namespace SchoolAdmission.Api.Contracts.Classes;

public class CreateClassRequest
{
    [Required]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 10000)]
    public int TotalSeats { get; set; }
}