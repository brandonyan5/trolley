//package edu.brown.cs.student.main.email;
//
//import java.io.UnsupportedEncodingException;
//import java.util.Properties;
//
//import javax.mail.*;
//import javax.mail.internet.*;
//
//
//public class EmailOwner {
//
//    public static boolean sendEmailToOwner(String ownerEmail) throws MessagingException {
//        Properties prop = new Properties();
//        prop.put("mail.smtp.auth", true);
//        prop.put("mail.smtp.starttls.enable", "true");
//        prop.put("mail.smtp.host", "localhost");
//        prop.put("mail.smtp.port", "4567");
//        prop.put("mail.smtp.ssl.trust", "smtp.mailtrap.io");
//
//        Session session = Session.getInstance(prop, new Authenticator() {
//            @Override
//            protected PasswordAuthentication getPasswordAuthentication() {
//                return new PasswordAuthentication("brandon78777@gmail.com", "dudujupiter");
//            }
//        });
//
//        Message message = new MimeMessage(session);
//        message.setFrom(new InternetAddress("brandon78777@gmail.com"));
//        message.setRecipients(
//                Message.RecipientType.TO, InternetAddress.parse(ownerEmail));
//        message.setSubject("Mail Subject");
//
//        String msg = "This is my first email using JavaMailer";
//
//        MimeBodyPart mimeBodyPart = new MimeBodyPart();
//        mimeBodyPart.setContent(msg, "text/html; charset=utf-8");
//
//        Multipart multipart = new MimeMultipart();
//        multipart.addBodyPart(mimeBodyPart);
//
//        message.setContent(multipart);
//
//        Transport.send(message);
//        return true;
//    }
//}
