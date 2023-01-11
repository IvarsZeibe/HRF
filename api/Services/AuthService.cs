using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using API.Models;
using API.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;
public class AuthService
{
    private PasswordHasher<string> passwordHasher = new();
    string jwtSecret;
    string issuer;
    string audience;
    int jwtLifespan;
    public AuthService(string jwtSecret, string issuer, string audience, int jwtLifespan)
    {
        this.jwtSecret = jwtSecret;
        this.issuer = issuer;
        this.audience = audience;
        this.jwtLifespan = jwtLifespan;
    }
    public AuthData GetAuthData(int id)
    {
        var expirationTime = DateTime.UtcNow.AddSeconds(jwtLifespan);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, id.ToString())
            }),
            Expires = expirationTime,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)), 
                SecurityAlgorithms.HmacSha256Signature
            )
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
                    
        return new AuthData{
            Token = token,
            TokenExpirationTime = ((DateTimeOffset)expirationTime).ToUnixTimeSeconds(),
            Id = id
        };
    }
    public string HashPassword(int userId, string password)
    {
        return passwordHasher.HashPassword(userId.ToString(), password);
    }

    public bool VerifyPassword(int userId, string actualPassword, string hashedPassword)
    {
        return passwordHasher.VerifyHashedPassword(userId.ToString(), hashedPassword, actualPassword) == PasswordVerificationResult.Success;
    }
    public static bool IsValidNewAccount(Context context, RegisterData data, out RegisterData errorMessages)
    {
        errorMessages = new();
        if (context.Users.Any())
        {
            if (context.Users.Any(u => u.Email == data.Email))
            {
                errorMessages.Email = "User with this email already exists";
            }
            if (context.Users.Any(u => u.Username == data.Username))
            {
                errorMessages.Username = "User with this username already exists";
            }
        }
        if (!Regex.IsMatch(data.Email, @"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"))
        {
            errorMessages.Email = "Invalid email";
        }
        if (!Regex.IsMatch(data.Username, @"^[a-zA-Z0-9_]+$")) {
            errorMessages.Username = "Invalid username";
        }
        if (data.Password.Length < 8) {
            errorMessages.Password = "Password must be at least 8 characters";
        }
        return errorMessages.Email is null && errorMessages.Username is null && errorMessages.Password is null;
    }
    public static bool IsValidUserDataChange(Context context, UserUpdate data, out RegisterData errorMessages)
    {
        errorMessages = new();
        if (context.Users.Any())
        {
            if (context.Users.Any(u => u.Email == data.Email && u.Id != data.Id))
            {
                errorMessages.Email = "User with this email already exists";
            }
            if (context.Users.Any(u => u.Username == data.Username && u.Id != data.Id))
            {
                errorMessages.Username = "User with this username already exists";
            }
        }
        if (!IsEmailValid(data.Email, out string emailMessage))
        {
            errorMessages.Email = emailMessage;
        }
        if (!IsUsernameValid(data.Username, out string usernameMessage))
        {
            errorMessages.Username = usernameMessage;
        }
        if (!IsPasswordValid(data.Password, out string passwordMessage))
        {
            errorMessages.Password = passwordMessage;
        }
        return errorMessages.Email is null && errorMessages.Username is null && errorMessages.Password is null;
    }
    public static bool IsPasswordValid(string password, out string message) {
        message = "";
        if (password.Length != 0 && password.Length < 8) {
            message = "Password must be at least 8 characters";
            return false;
        }
        return true;
    }
    public static bool IsEmailValid(string email, out string message) {
        message = "";
        if (!Regex.IsMatch(email, @"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"))
        {
            message = "Invalid email";
            return false;
        }
        return true;
    }
    public static bool IsUsernameValid(string username, out string message) {
        message = "";
        if (!Regex.IsMatch(username, @"^[a-zA-Z0-9_]+$"))
        {
            message = "Invalid username";
            return false;
        }
        return true;
    }
}