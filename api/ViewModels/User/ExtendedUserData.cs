namespace API.ViewModels
{
    public class ExtendedUserData
    {
        public ExtendedUserData(int id, string username, string email, bool isAdmin = false) {
            this.Id = id;
            this.Username = username;
            this.Email = email;
            this.IsAdmin = isAdmin;
        }
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public bool IsAdmin { get; set; }
    }
}