import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email Chat App",
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #4CAF50;
              }
              p {
                  font-size: 16px;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Welcome to ChatApp!</h1>
              <p>Hi there,</p>
              <p>Thank you for registering with ChatApp. To complete your registration, please use the following OTP to verify your email address:</p>
              <p class="otp">${otp}</p>
              <p>This OTP is valid for the next 10 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>We're excited to have you join our community!</p>
              <p>Best regards,<br>ChatApp Team</p>
              <div class="footer">
                  <p>If you have any questions or need help, feel free to <a href="mailto:chat.app.mail.otp+support@gmail.com">contact us</a>.</p>
              </div>
          </div>
      </body>
      </html>
    `
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
