using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Api.Data;
using SchoolAdmission.Api.Models;

namespace SchoolAdmission.Api.Services;

public class HoldExpirationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<HoldExpirationService> _logger;

    public HoldExpirationService(
        IServiceScopeFactory scopeFactory,
        ILogger<HoldExpirationService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Hold expiration service started."
        );

        // Run the expiration check every 5 seconds.
        using var timer = new PeriodicTimer(
            TimeSpan.FromSeconds(5)
        );

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireHoldsAsync(stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An error occurred while expiring admission holds."
                );
            }

            try
            {
                if (!await timer.WaitForNextTickAsync(stoppingToken))
                {
                    break;
                }
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }

    private async Task ExpireHoldsAsync(
        CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var now = DateTimeOffset.UtcNow;

        var expiredCount = await context.AdmissionHolds
            .Where(h =>
                h.Status == AdmissionHoldStatus.HELD &&
                h.ExpiresAt <= now)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(
                    h => h.Status,
                    AdmissionHoldStatus.EXPIRED
                ),
                stoppingToken
            );

        if (expiredCount > 0)
        {
            _logger.LogInformation(
                "Expired {Count} admission holds.",
                expiredCount
            );
        }
    }
}