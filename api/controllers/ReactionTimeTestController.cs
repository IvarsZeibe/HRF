using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReactionTimeTestController : ControllerBase
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

    public ReactionTimeTestController(AuthService authService, Context context)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ReactionTimeTestUpdate>>> GetMyTestResults()
    {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }

        return await context.ReactionTimeTests.Where(test => test.UserId == user.Id).Select(test => new ReactionTimeTestUpdate() {
            Id = test.Id,
            ReactionTime = test.ReactionTime
        }).ToListAsync();
    }
    [HttpGet("all")]
    public ActionResult<IEnumerable<ReactionTimeTestWithOwner>> GetAllTestResults()
    {
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }

        return context.ReactionTimeTests.ToList().Select(t => new ReactionTimeTestWithOwner {
            Id = t.Id,
            User = context.Users.Find(t.UserId).Username,
            ReactionTime = t.ReactionTime
            }).ToList();
    }
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddTestResult(ReactionTimeTestSubmit data)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }

        ReactionTimeTest reactionTimeTest = new ReactionTimeTest(user.Id, data.ReactionTime);
        context.ReactionTimeTests.Add(reactionTimeTest);
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
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }
        ReactionTimeTest? reactionTimeTest = context.ReactionTimeTests.FirstOrDefault(test => test.Id == id);
        if (reactionTimeTest is null) {
            return NotFound();
        }

        if (context.ReactionTimeTests.Where(el => el.UserId == user.Id).Contains(reactionTimeTest) || user.IsAdmin) {
            context.ReactionTimeTests.Remove(reactionTimeTest);
            await context.SaveChangesAsync();
        }

        return NoContent();
    }
    
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTestResult(ReactionTimeTestUpdate data)
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
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }
        ReactionTimeTest? reactionTimeTest = context.ReactionTimeTests.FirstOrDefault(test => test.Id == data.Id);
        if (reactionTimeTest is null) {
            return NotFound();
        }
        var errors = new
        {
            ReactionTime = data.ReactionTime < 0 ? "Must be above zero" : null
        };
        if (errors.GetType().GetProperties().Any(p => p.GetValue(errors) is not null))
        {
            return BadRequest(errors);
        }

        reactionTimeTest.ReactionTime = data.ReactionTime;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("summary")]
    [Authorize]
    public ActionResult<ReactionTimeTestSummary> GetSummary() {
        if (context.ReactionTimeTests is null || context.ReactionTimeTests.Count() == 0) 
        {
            return NotFound();
        }
        return new ReactionTimeTestSummary() {
            TotalTestsCompleted = context.ReactionTimeTests.Count(),
            AverageReactionTime = context.ReactionTimeTests.Average(el => el.ReactionTime),
        };
    }
    [HttpGet("my/summary")]
    [Authorize]
    public ActionResult<ReactionTimeTestDetailedSummary> GetMySummary() {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.ReactionTimeTests is null || context.ReactionTimeTests.Count() == 0) 
        {
            return NotFound();
        }
        var myTestResults = context.ReactionTimeTests.Where(test => test.UserId == user.Id);
        if (myTestResults.Count() == 0) {
            return NotFound();
        }
        int BestReactionTime = myTestResults.Min(el => el.ReactionTime);
        return new ReactionTimeTestDetailedSummary() {
            TotalTestsCompleted = myTestResults.Count(),
            AverageReactionTime = myTestResults.Average(el => el.ReactionTime),
            BestReactionTime = BestReactionTime,
            BestReactionTimeRank = context.ReactionTimeTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Min(x => x.ReactionTime))
                .OrderBy(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == BestReactionTime)?.rank ?? 0,
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
        if (context.ReactionTimeTests is null) 
        {
            return NotFound();
        }

        context.ReactionTimeTests.RemoveRange(context.ReactionTimeTests.Where(test => test.UserId == user.Id));
        await context.SaveChangesAsync();
        return NoContent();
    }
}
