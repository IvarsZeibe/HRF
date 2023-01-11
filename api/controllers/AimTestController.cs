using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AimTestController : ControllerBase
{
    private AuthService authService;
    private readonly Context context;

    private User? GetCurrentUser() {
        var userIdentity = User.Identity;
        if (userIdentity == null || context.Users == null)
        {
            return null;
        }
        if (context.Users.FirstOrDefault(u => u.Id.ToString() == userIdentity.Name) is not User user)
        {
            return null;
        }
        return user;
    }

    public AimTestController(AuthService authService, Context context)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<AimTestUpdate>>> GetMyTestResults()
    {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.AimTests is null) 
        {
            return NotFound();
        }

        return await context.AimTests.Where(test => test.UserId == user.Id).Select(test => new AimTestUpdate() {
            Id = test.Id,
            Accuracy = test.Accuracy,
            AverageTimePerTarget = test.AverageTimePerTarget
        }).ToListAsync();
    }
    [HttpGet("all")]
    public ActionResult<IEnumerable<AimTestWithOwner>> GetAllTestResults()
    {
        if (context.AimTests is null) 
        {
            return NotFound();
        }

        return context.AimTests.ToList().Select(t => new AimTestWithOwner {
            Id = t.Id,
            User = context.Users.Find(t.UserId).Username,
            Accuracy = t.Accuracy,
            AverageTimePerTarget = t.AverageTimePerTarget
            })
            .ToList();
    }
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddTestResult(AimTestSubmit data)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.AimTests is null) 
        {
            return NotFound();
        }

        AimTest aimTest = new AimTest(user.Id, data.AverageTimePerTarget, data.Accuracy);
        context.AimTests.Add(aimTest);
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> RemoveTestResult(int id)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.AimTests is null) 
        {
            return NotFound();
        }
        AimTest? aimTest = context.AimTests.FirstOrDefault(test => test.Id == id);
        if (aimTest is null) {
            return NotFound();
        }

        if (context.AimTests.Where(el => el.UserId == user.Id).Contains(aimTest) || user.IsAdmin) {
            context.AimTests.Remove(aimTest);
            await context.SaveChangesAsync();
        }

        return NoContent();
    }
    
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTestResult(AimTestUpdate data)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (!user.IsAdmin)
        {
            return Unauthorized();
        }
        if (context.AimTests is null) 
        {
            return NotFound();
        }
        AimTest? aimTest = context.AimTests.FirstOrDefault(test => test.Id == data.Id);
        if (aimTest is null) {
            return NotFound();
        }
        var errors = new
        {
            Accuracy = data.Accuracy < 0 || data.Accuracy > 1 ? "Must be betweeen 0 and 1" : null,
            AverageTimePerTarget = data.AverageTimePerTarget < 0 ? "Must be above zero" : null
        };
        if (errors.GetType().GetProperties().Any(p => p.GetValue(errors) is not null))
        {
            return BadRequest(errors);
        }

        aimTest.Accuracy = data.Accuracy;
        aimTest.AverageTimePerTarget = data.AverageTimePerTarget;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("summary")]
    [Authorize]
    public ActionResult<AimTestSummary> GetSummary() {
        if (context.AimTests is null || context.AimTests.Count() == 0) 
        {
            return NotFound();
        }
        return new AimTestSummary() {
            TotalTestsCompleted = context.AimTests.Count(),
            AverageTimePerTarget = context.AimTests.Average(el => el.AverageTimePerTarget),
            AverageAccuracy = context.AimTests.Average(el => el.Accuracy),
        };
    }
    [HttpGet("my/summary")]
    [Authorize]
    public ActionResult<AimTestDetailedSummary> GetMySummary() {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.AimTests is null || context.AimTests.Count() == 0) 
        {
            return NotFound();
        }
        var myTestResults = context.AimTests.Where(test => test.UserId == user.Id);
        if (myTestResults.Count() == 0) {
            return NotFound();
        }
        float bestAccuracy = myTestResults.Max(el => el.Accuracy);
        int bestAverageTimePerTarget = myTestResults.Min(el => el.AverageTimePerTarget);
        return new AimTestDetailedSummary() {
            TotalTestsCompleted = myTestResults.Count(),
            AverageAccuracy = myTestResults.Average(el => el.Accuracy),
            AverageTimePerTarget = myTestResults.Average(el => el.AverageTimePerTarget),
            BestAccuracy = bestAccuracy,
            BestAverageTimePerTarget = bestAverageTimePerTarget,
            BestAccuracyRank = context.AimTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Max(x => x.Accuracy))
                .OrderByDescending(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == bestAccuracy)?.rank ?? 0,
            BestAverageTimePerTargetRank = context.AimTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Min(x => x.AverageTimePerTarget))
                .OrderBy(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == bestAverageTimePerTarget)?.rank ?? 0,
        };
    }
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteMyTestResults()
    {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.AimTests is null) 
        {
            return NotFound();
        }

        context.AimTests.RemoveRange(context.AimTests.Where(test => test.UserId == user.Id));
        await context.SaveChangesAsync();
        return NoContent();
    }
}
