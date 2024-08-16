import nodemailer from "nodemailer";

const mailSender = async (email, subject, text) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "No Reply <chat.app.mail.otp@gmail.com>",
      to: email,
      subject: subject,
      html: text,
    });
    console.log("Email info: ", info);
    return info;
  } catch (err) {
    console.log(err);
  }
};

export default mailSender;
