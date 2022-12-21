using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
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
    public UsersController(AuthService authService, Context context)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ExtendedUserData>>> GetUsers()
    {
        if (!GetCurrentUser()?.IsAdmin ?? false) {
            return Unauthorized();
        }
        if (context.Users is null)
        {
            return NotFound();
        }
        return await context.Users.Select(user => new ExtendedUserData(user.Id, user.Username, user.Email, user.IsAdmin)).ToListAsync();
    }
    [HttpGet("current")]
    [Authorize]
    public ActionResult<ExtendedUserData> GetUser()
    {
        User? user = GetCurrentUser();
        if (user is null) {
            return NotFound();
        }
        return new ExtendedUserData(user.Id, user.Username, user.Email, user.IsAdmin);
    }
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser(int id)
    {
        if (!GetCurrentUser()?.IsAdmin ?? false) {
            return Unauthorized();
        }
        if (context.Users == null)
        {
            return NotFound();
        }
        var user = await context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        context.Users.Remove(user);
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteUser()
    {
        User? user = GetCurrentUser();
        if (user is null)
        {
            return NotFound();
        }
        context.Users.Remove(user);
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateUser([FromBody]UserUpdate userData)
    {
        if (!GetCurrentUser()?.IsAdmin ?? false) {
            return Unauthorized();
        }
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (context.Users == null)
        {
            return NotFound();
        }

        var user = context.Users.FirstOrDefault(u => u.Id == userData.Id);

        if (user == null)
        {
            return BadRequest();
        }

        if (context.Users.Any(u => (u.Email == userData.Email || u.Username == userData.Username) && u.Id != userData.Id)) {
            return BadRequest();
        }
        user.Email = userData.Email;
        user.Username = userData.Username;
        if (userData.Password != "") {
            user.Password = authService.HashPassword(userData.Id, userData.Password);
        }
        user.IsAdmin = userData.IsAdmin;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpPost("password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody]PasswordChange passwordChange)
    {
        User? user = GetCurrentUser();

        if (user == null || !authService.VerifyPassword(user.Id, passwordChange.OldPassword, user.Password))
        {
            return BadRequest();
        }

        user.Password = authService.HashPassword(user.Id, passwordChange.NewPassword);
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpPost("email")]
    [Authorize]
    public async Task<IActionResult> ChangeEmail([FromBody]SimpleString email)
    {
        User? user = GetCurrentUser();

        if (user == null || context.Users.Any(u => u.Email == email.Value))
        {
            return BadRequest();
        }

        user.Email = email.Value;
        await context.SaveChangesAsync();

        return NoContent();
    }
    [HttpPost("username")]
    [Authorize]
    public async Task<IActionResult> ChangeUsername([FromBody]SimpleString username)
    {
        User? user = GetCurrentUser();

        if (user == null || context.Users.Any(u => u.Username == username.Value))
        {
            return BadRequest();
        }

        user.Username = username.Value;
        await context.SaveChangesAsync();

        return NoContent();
    }
}
