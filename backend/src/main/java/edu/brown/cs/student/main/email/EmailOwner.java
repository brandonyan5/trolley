package edu.brown.cs.student.main.email;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

/**
 * class that handles emailing the owner of a listing.
 */
public class EmailOwner {

    /**
     * emails the owner of the listing.
     * @param ownerEmail - the owner's email address
     * @param otherEmail - the user's email address
     * @return - whether or not email was sent successfully
     * @throws MessagingException - if email sending errored somewhere
     */
    //Sources for the code in this method:
    //https://www.baeldung.com/java-email
    //https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api
    public static boolean sendEmailToOwner(String ownerEmail, String otherEmail) throws MessagingException {
        //setting up host properties to send emails: using gmail and port 587
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");

        //accessing the account that will send the actual email
        Session session = Session.getDefaultInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("trolley.storage32@gmail.com", "CS32Temp");
            }
        });

        try {
            Message message = new MimeMessage(session);

            //specifies which account is sending the email
            message.setFrom(new InternetAddress("trolley.storage32@gmail.com"));

            //specifies which account is receiving the email
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(ownerEmail));

            //sets the subject line of the email
            message.setSubject("Your Listing was Booked! Confirm Now.");

            //sets the message body of the email
            String msg = "Now you can both communicate from here, and confirm the booking and price." +
                    "\n Email of the booker is: " + otherEmail;

            MimeBodyPart mimeBodyPart = new MimeBodyPart();

            //sets the content and type of the message text
            mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);

            //sends the email
            Transport.send(message);
            return true;

        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

    }
}


