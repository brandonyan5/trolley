package edu.brown.cs.student.main.email;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;


public class EmailOwner {

    public static boolean sendEmailToOwner(String ownerEmail) throws MessagingException {
        Properties prop = new Properties();
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");

        Session session = Session.getDefaultInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("brandon78777@gmail.com", "CS32Temp");
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("brandon78777@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO, InternetAddress.parse(ownerEmail));
            message.setSubject("Your Listing was Booked! Confirm Now.");

            String msg = "Now you can both communicate from here, and confirm the booking and price.";

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

//https://www.baeldung.com/java-email
//https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api
