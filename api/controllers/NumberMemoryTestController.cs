using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NumberMemoryTestController : ControllerBase
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

    public NumberMemoryTestController(AuthService authService, Context context)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<NumberMemoryTestUpdate>>> GetMyTestResults()
    {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }

        return await context.NumberMemoryTests.Where(test => test.UserId == user.Id).Select(test => new NumberMemoryTestUpdate() {
            Id = test.Id,
            DigitCount = test.DigitCount
        }).ToListAsync();
    }
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<NumberMemoryTest>>> GetAllTestResults()
    {
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }

        return await context.NumberMemoryTests.ToListAsync();
    }
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddTestResult(NumberMemoryTestSubmit data)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }

        NumberMemoryTest numberMemoryTest = new NumberMemoryTest(user.Id, data.DigitCount);
        context.NumberMemoryTests.Add(numberMemoryTest);
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
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }
        NumberMemoryTest? numberMemoryTest = context.NumberMemoryTests.FirstOrDefault(test => test.Id == id);
        if (numberMemoryTest is null) {
            return NotFound();
        }

        if (context.NumberMemoryTests.Where(el => el.UserId == user.Id).Contains(numberMemoryTest) || user.IsAdmin) {
            context.NumberMemoryTests.Remove(numberMemoryTest);
            await context.SaveChangesAsync();
        }

        return NoContent();
    }
    
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateTestResult(NumberMemoryTestUpdate data)
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
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }
        NumberMemoryTest? numberMemoryTest = context.NumberMemoryTests.FirstOrDefault(test => test.Id == data.Id);
        if (numberMemoryTest is null) {
            return NotFound();
        }

        numberMemoryTest.DigitCount = data.DigitCount;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("summary")]
    [Authorize]
    public ActionResult<NumberMemoryTestSummary> GetSummary() {
        if (context.NumberMemoryTests is null || context.NumberMemoryTests.Count() == 0) 
        {
            return NotFound();
        }
        return new NumberMemoryTestSummary() {
            TotalTestsCompleted = context.NumberMemoryTests.Count(),
            AverageDigitCount = context.NumberMemoryTests.Average(el => el.DigitCount),
        };
    }
    [HttpGet("my/summary")]
    [Authorize]
    public ActionResult<NumberMemoryTestDetailedSummary> GetMySummary() {
        User? user = GetCurrentUser();
        if (user is null) 
        {
            return NotFound();
        }
        if (context.NumberMemoryTests is null || context.NumberMemoryTests.Count() == 0) 
        {
            return NotFound();
        }
        var myTestResults = context.NumberMemoryTests.Where(test => test.UserId == user.Id);
        if (myTestResults.Count() == 0) {
            return NotFound();
        }
        int bestDigitCount = myTestResults.Max(el => el.DigitCount);
        return new NumberMemoryTestDetailedSummary() {
            TotalTestsCompleted = myTestResults.Count(),
            AverageDigitCount = myTestResults.Average(el => el.DigitCount),
            BestDigitCount = bestDigitCount,
            BestDigitCountRank = context.NumberMemoryTests
                .ToList()
                .GroupBy(el => el.UserId)
                .Select(el => el.Max(x => x.DigitCount))
                .OrderByDescending(el => el)
                .Select((el, i) => new {element = el, rank = i + 1})
                .FirstOrDefault(el => el.element == bestDigitCount)?.rank ?? 0,
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
        if (context.NumberMemoryTests is null) 
        {
            return NotFound();
        }

        context.NumberMemoryTests.RemoveRange(context.NumberMemoryTests.Where(test => test.UserId == user.Id));
        await context.SaveChangesAsync();
        return NoContent();
    }
}
