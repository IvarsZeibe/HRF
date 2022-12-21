using System.ComponentModel.DataAnnotations;

namespace API.ViewModels
{
    public class UserUpdate
    {
        public UserUpdate(string username, string email, string password, bool isAdmin = false) {
            this.Username = username;
            this.Email = email;
            this.Password = password;
            this.IsAdmin = isAdmin;
        }
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
    }
}