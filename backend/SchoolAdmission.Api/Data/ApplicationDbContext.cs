
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Models;

namespace SchoolAdmission.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Database tables
    public DbSet<SchoolClass> Classes => Set<SchoolClass>();

    public DbSet<AdmissionHold> AdmissionHolds =>
        Set<AdmissionHold>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // SCHOOL CLASS CONFIGURATION
        modelBuilder.Entity<SchoolClass>(entity =>
        {
            entity.ToTable("Classes");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(c => c.TotalSeats)
                .IsRequired();

            entity.ToTable(table =>
                table.HasCheckConstraint(
                    "CK_Classes_TotalSeats",
                    "\"TotalSeats\" > 0"
                )
            );

            entity.HasIndex(c => c.Name);
        });

        // ADMISSION HOLD CONFIGURATION
        modelBuilder.Entity<AdmissionHold>(entity =>
        {
            entity.ToTable("AdmissionHolds", table =>
                table.HasCheckConstraint(
                    "CK_AdmissionHolds_Status",
                    "\"Status\" IN ('HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED')"
                )
            );

            entity.HasKey(h => h.Id);

            entity.Property(h => h.StudentId)
                .IsRequired()
                .HasMaxLength(30);

            // Store enum values as strings
            entity.Property(h => h.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(h => h.ExpiresAt)
                .IsRequired();

            // Relationship: one class has many holds
            entity.HasOne(h => h.SchoolClass)
                .WithMany(c => c.AdmissionHolds)
                .HasForeignKey(h => h.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            // Index for class seat calculations
            entity.HasIndex(h => new
            {
                h.ClassId,
                h.Status,
                h.ExpiresAt
            });

            // A student can have only one HELD or CONFIRMED
            // application across all classes.
            entity.HasIndex(h => h.StudentId)
                .IsUnique()
                .HasFilter(
                    "\"Status\" IN ('HELD', 'CONFIRMED')"
                );
        });
    }
}
