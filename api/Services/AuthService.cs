using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
}