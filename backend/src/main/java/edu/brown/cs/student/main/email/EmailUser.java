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
   * @param address - the address of the listing
   * @return - whether or not email was sent successfully
   * @throws MessagingException - if email sending errored somewhere
   */
  public static boolean sendEmailToUserAccepted(String userEmail, String otherEmail,
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
              Message.RecipientType.TO, InternetAddress.parse(userEmail));
      message.setSubject("Your Booking was Accepted!");

      String msg = "Your booking for " + address + ", was accepted by the host,"
              + " and you can now communicate with the host"
              + "though email! Their email is: " + otherEmail;

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

  /**
   * emails the user who books the listing.
   * @param userEmail - the user's email address
   * @param address - the address of the listing
   * @return - whether or not email was sent successfully
   * @throws MessagingException - if email sending errored somewhere
   */
  public static boolean sendEmailToUserRejected(String userEmail,
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
              Message.RecipientType.TO, InternetAddress.parse(userEmail));
      message.setSubject("Your Booking Was Rejected.");

      String msg = "Your Booking for " + address + ", was rejected by the host."
              + " Book somewhere else!";

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