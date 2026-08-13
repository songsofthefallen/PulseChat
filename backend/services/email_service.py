import smtplib
from email.message import EmailMessage
from config import settings

print(settings.SMTP_USERNAME)
print(settings.SMTP_APP_PASSWORD)

class EmailService:

    @staticmethod
    def send_password_reset_code(recipient: str, code: str,):

        message = EmailMessage()

        message["Subject"] = "PulseChat Password Reset"
        message["From"] = settings.SMTP_USERNAME
        message["To"] = recipient

        message.set_content(
            f"Your PulseChat password reset code is: {code}\n\n"
            "This code expires in 10 minutes."
        )

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_APP_PASSWORD)
            smtp.send_message(message)