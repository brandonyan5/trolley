package edu.brown.cs.student.main.email;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

/**
 * class that handles emailing the user who books a listing.
 */
public class EmailUser {

    /**
     * emails the user who books the listing.
     * @param userEmail - the user's email address
     * @param otherEmail - the email address of the owner of the listing
     * @return - whether or not email was sent successfully
     * @throws MessagingException - if email sending errored somewhere
     */
    //Sources for the code in this method:
    //https://www.baeldung.com/java-email
    //https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api
    public static boolean sendEmailToUserAccepted(String userEmail, String otherEmail) throws MessagingException {
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
                    Message.RecipientType.TO, InternetAddress.parse(userEmail));

            //sets the subject line of the email
            message.setSubject("Your Booking was Accepted!");

            //sets the message body of the email
            String msg = "Your booking was accepted by the host, and you can now communicate with the host" +
                    "though email!\n Email of the host is: " + otherEmail;

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

    /**
     * emails the user who books the listing.
     * @param userEmail - the user's email address
     * @param otherEmail - the email address of the owner of the listing
     * @return - whether or not email was sent successfully
     * @throws MessagingException - if email sending errored somewhere
     */
    //Sources for the code in this method:
    //https://www.baeldung.com/java-email
    //https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api
    public static boolean sendEmailToUserRejected(String userEmail, String otherEmail) throws MessagingException {
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
                    Message.RecipientType.TO, InternetAddress.parse(userEmail));

            //sets the subject line of the email
            message.setSubject("Your Booking Was Rejected.");

            //sets the message body of the email
            String msg = "Your Booking was rejected by the host. Book somewhere else!" +
                    "\nEmail of host is: " + otherEmail;

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

