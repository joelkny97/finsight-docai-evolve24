from django.core import mail
import threading

class EmailThread(threading.Thread):
    def __init__(self, email: mail.EmailMessage):
        self.email = email
        threading.Thread.__init__(self)

    def run(self) -> None:
        return self.email.send()
    

class EmailUtil:
    @staticmethod
    def send_email(data):
        email = mail.EmailMessage(data['email_subject'], data['email_body'], to=[data['to_email']])
        EmailThread(email).start()