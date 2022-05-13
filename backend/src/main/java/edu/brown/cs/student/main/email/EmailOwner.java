package edu.brown.cs.student.main.email;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

//put javadocs and comments for email stuff tomorrow
public class EmailOwner {

  public static boolean sendEmailToOwnerOnDecision(String ownerEmail, String otherEmail,
                                                   String address) throws MessagingException {
    Properties prop = new Properties();
    prop.put("mail.smtp.auth", "true");
    prop.put("mail.smtp.starttls.enable", "true");
    prop.put("mail.smtp.host", "smtp.gmail.com");
    prop.put("mail.smtp.port", "587");
    prop.setProperty("mail.smtp.starttls.enable", "true");
    prop.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

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
              Message.RecipientType.TO, InternetAddress.parse(ownerEmail));
      message.setSubject("Your Listing was Booked! Confirm Now.");

      String msg = "Now you can both communicate from here, and confirm the booking and price for "
              + address + ". "
              + "The booker's email is: "
              + otherEmail;

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

  public static boolean sendEmailToOwnerOnUnclaim(String ownerEmail, String otherEmail,
                                                  String address) throws MessagingException {
    Properties prop = new Properties();
    prop.put("mail.smtp.auth", "true");
    prop.put("mail.smtp.starttls.enable", "true");
    prop.put("mail.smtp.host", "smtp.gmail.com");
    prop.put("mail.smtp.port", "587");
    prop.setProperty("mail.smtp.starttls.enable", "true");
    prop.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

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
              Message.RecipientType.TO, InternetAddress.parse(ownerEmail));
      message.setSubject("Your Listing was Cancelled!");

      String msg = "Your listing for " + address + ", was cancelled"
              + " and placed back on the marketplace.";

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
//Sources referenced:
//https://www.baeldung.com/java-email
//https://stackoverflow.com/questions/31535863/error-when-sending-email-via-java-mail-api












