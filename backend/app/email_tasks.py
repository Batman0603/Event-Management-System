from app.extensions import celery, mail
from flask_mail import Message
from flask import current_app

@celery.task(bind=True, max_retries=3, default_retry_delay=60)
def send_registration_email(self, recipient, event_title):
    """Sends a registration confirmation email."""
    try:
        msg = Message(
            subject="Event Registration Confirmation",
            sender=current_app.config["MAIL_DEFAULT_SENDER"],
            recipients=[recipient]
        )
        msg.body = f"You have successfully registered for the event: {event_title}"
        mail.send(msg)
    except Exception as e:
        # Retry the task if sending fails
        self.retry(exc=e)