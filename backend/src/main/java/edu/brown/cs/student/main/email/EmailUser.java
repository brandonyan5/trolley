package edu.brown.cs.student.main.email;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;


public class EmailUser {

    public static boolean sendEmailToUserAccepted(String userEmail, String otherEmail) throws MessagingException {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");

        Session session = Session.getDefaultInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("trolley.storage32@gmail.com", "CS32Temp");
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("trolley.storage32@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(userEmail));
            message.setSubject("Your Booking was Accepted!");

            String msg = "Your booking was accepted by the host, and you can now communicate with the host" +
                    "though email!\n Email of the host is: " + otherEmail;

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);
            Transport.send(message);
            return true;

        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

    }

    public static boolean sendEmailToUserRejected(String userEmail, String otherEmail) throws MessagingException {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");

        Session session = Session.getDefaultInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("trolley.storage32@gmail.com", "CS32Temp");
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("trolley.storage32@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(userEmail));
            message.setSubject("Your Booking Was Rejected.");

            String msg = "Your Booking was rejected by the host. Book somewhere else!" +
                    "\nEmail of host is: " + otherEmail;

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setContent(multipart);
            Transport.send(message);
            return true;

        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }

    }
}

//Source:
//https://www.baeldung.com/java-email
//https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api