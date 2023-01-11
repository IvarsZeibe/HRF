using System.Text.RegularExpressions;
using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController: ControllerBase
{
    AuthService authService;
    //IUserRepository userRepository;
    private readonly Context context;
    public AuthController(AuthService authService, Context context)
    {
        this.authService = authService;
        this.context = context;
    }

    [HttpPost("login")]
    public ActionResult<AuthData> Post([FromBody]LoginData model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (context.Users == null)
        {
            return NotFound();
        }

        var user = context.Users.FirstOrDefault(u => u.Email == model.Email);

        if (user == null)
        {
            return BadRequest(new { Error = "Incorrect email or password" });
        }

        var passwordValid = authService.VerifyPassword(user.Id, model.Password, user.Password);
        if (!passwordValid)
        {
            return BadRequest(new { Error = "Incorrect email or password" });
        }

        return authService.GetAuthData(user.Id);
    }

    [HttpPost("register")]
    public ActionResult<AuthData> Post([FromBody]RegisterData model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!AuthService.IsValidNewAccount(context, model, out RegisterData errorMessages))
        {
            return BadRequest(errorMessages);
        }

        var user = new User(model.Username, model.Email, "");
        user.Password = authService.HashPassword(user.Id, model.Password);
        if (context.Users.Where(u => u.IsAdmin).Count() == 0)
        {
            user.IsAdmin = true;
        }
        context.Users.Add(user);
        context.SaveChanges();

        return authService.GetAuthData(user.Id);
    }
    private bool IsEmailUniq(string email) {
        return !context.Users.Any(u => u.Email == email);
    }
    private bool IsUsernameUniq(string username) {
        return !context.Users.Any(u => u.Username == username);
    }
}