using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TypingTestController : ControllerBase
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

    public TypingTestController(AuthService authService, Context context)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<TypingTestUpdate>>> GetMyTestResults()
    {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.TypingTests is null) 
        {
            return NotFound();
        }

        return await context.TypingTests.Where(test => test.UserId == user.Id).Select(test => new TypingTestUpdate() {
            Id = test.Id,
            WordsPerMinute = test.WordsPerMinute,
            Accuracy = test.Accuracy
        }).ToListAsync();
    }
    [HttpGet("all")]
    public ActionResult<IEnumerable<TypingTestWithOwner>> GetAllTestResults()
    {
        if (context.TypingTests is null) 
        {
            return NotFound();
        }

        return context.TypingTests.ToList().Select(t => new TypingTestWithOwner {
            Id = t.Id,
            User = context.Users.Find(t.UserId).Username,
            Accuracy = t.Accuracy,
            WordsPerMinute = t.WordsPerMinute
            }).ToList();
    }
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddTestResult(TypingTestSubmit data)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.TypingTests is null) 
        {
            return NotFound();
        }

        var errors = new
        {
            Accuracy = data.Accuracy < 0 || data.Accuracy > 1 ? "Must be betweeen 0 and 1" : null,
            WordsPerMintute = data.WordsPerMinute < 0 ? "Must be above zero" : null
        };
        if (errors.GetType().GetProperties().Any(p => p.GetValue(errors) is not null))
        {
            return BadRequest(errors);
        }
        
        TypingTest typingTest = new TypingTest(user.Id, data.WordsPerMinute, data.Accuracy);
        context.TypingTests.Add(typingTest);
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
        if (context.TypingTests is null) 
        {
            return NotFound();
        }
        TypingTest? typingTest = context.TypingTests.FirstOrDefault(test => test.Id == id);
        if (typingTest is null) {
            return NotFound();
        }

        if (context.TypingTests.Where(el => el.UserId == user.Id).Contains(typingTest) || user.IsAdmin) {
            context.TypingTests.Remove(typingTest);
            await context.SaveChangesAsync();
        }

        return NoContent();
    }
    
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTestResult(TypingTestUpdate data)
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
        if (context.TypingTests is null) 
        {
            return NotFound();
        }
        TypingTest? typingTest = context.TypingTests.FirstOrDefault(test => test.Id == data.Id);
        if (typingTest is null) {
            return NotFound();
        }
        var errors = new
        {
            Accuracy = data.Accuracy < 0 || data.Accuracy > 1 ? "Must be betweeen 0 and 1" : null,
            WordsPerMintute = data.WordsPerMinute < 0 ? "Must be above zero" : null
        };
        if (errors.GetType().GetProperties().Any(p => p.GetValue(errors) is not null))
        {
            return BadRequest(errors);
        }

        typingTest.Accuracy = data.Accuracy;
        typingTest.WordsPerMinute = data.WordsPerMinute;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("summary")]
    [Authorize]
    public ActionResult<TypingTestSummary> GetSummary() {
        if (context.TypingTests is null || context.TypingTests.Count() == 0) 
        {
            return NotFound();
        }
        return new TypingTestSummary() {
            TotalTestsCompleted = context.TypingTests.Count(),
            AverageWordsPerMinute = context.TypingTests.Average(el => el.WordsPerMinute),
            AverageAccuracy = context.TypingTests.Average(el => el.Accuracy),
        };
    }
    [HttpGet("my/summary")]
    [Authorize]
    public ActionResult<TypingTestDetailedSummary> GetMySummary() {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.TypingTests is null || context.TypingTests.Count() == 0) 
        {
            return NotFound();
        }
        var myTestResults = context.TypingTests.Where(test => test.UserId == user.Id);
        if (myTestResults.Count() == 0) {
            return NotFound();
        }
        float bestAccuracy = myTestResults.Max(el => el.Accuracy);
        int bestWordsPerMinute = myTestResults.Max(el => el.WordsPerMinute);
        return new TypingTestDetailedSummary() {
            TotalTestsCompleted = myTestResults.Count(),
            AverageAccuracy = myTestResults.Average(el => el.Accuracy),
            AverageWordsPerMinute = myTestResults.Average(el => el.WordsPerMinute),
            BestAccuracy = bestAccuracy,
            BestWordsPerMinute = bestWordsPerMinute,
            BestAccuracyRank = context.TypingTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Max(x => x.Accuracy))
                .OrderByDescending(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == bestAccuracy)?.rank ?? 0,
            BestWordsPerMinuteRank = context.TypingTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Max(x => x.WordsPerMinute))
                .OrderByDescending(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == bestWordsPerMinute)?.rank ?? 0,
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
        if (context.TypingTests is null) 
        {
            return NotFound();
        }

        context.TypingTests.RemoveRange(context.TypingTests.Where(test => test.UserId == user.Id));
        await context.SaveChangesAsync();
        return NoContent();
    }
}
