
using System.Net;
using System.Net.Mail;

namespace DictionaryAPI.Helper.EmailSender {
    public class EmailSender : IEmailSender {
        public Task SendEmailAsync(string email, string subject, string message) {
            var mail = "minhdhche171438@fpt.edu.vn";
            var pass = "dcxa ywqs birk fqwj";

            var client = new SmtpClient("smtp.gmail.com", 587) {
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, pass)
            };

            return client.SendMailAsync(new MailMessage(from: mail, to: email, subject, message));
        }
    }
}
