import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

async def send_mail(email, title, body):
    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = title
        msg['From'] = "Confetti"
        msg['To'] = email
        
        # Attach HTML body
        html_part = MIMEText(body, 'html')
        msg.attach(html_part)
        
        # Create SMTP server connection
        server = smtplib.SMTP(
            host=os.environ.get('MAIL_HOST'),
            port=int(os.environ.get('MAIL_PORT'))
        )
        
        # Start TLS encryption
        server.starttls()
        
        # Login to the server
        server.login(
            os.environ.get('MAIL_USER'),
            os.environ.get('MAIL_PASS')
        )
        
        # Send the email
        info = server.sendmail(
            from_addr="Confetti",
            to_addrs=[email],
            msg=msg.as_string()
        )
        
        # Close the connection
        server.quit()
        
        print(info)
        return info
    
    except Exception as err:
        print(str(err))
        raise err
