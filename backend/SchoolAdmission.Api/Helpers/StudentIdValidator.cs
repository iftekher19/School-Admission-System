using System.Text.RegularExpressions;

namespace SchoolAdmission.Api.Helpers;

public static class StudentIdValidator
{
    private static readonly Regex StudentIdPattern =
        new(@"^[0-9]{17}$", RegexOptions.Compiled);

    public static bool IsValid(string? studentId)
    {
        return studentId != null &&
               StudentIdPattern.IsMatch(studentId);
    }
}