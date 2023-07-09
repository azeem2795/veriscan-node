/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
import nodemailer from 'nodemailer';
import { MAILER_HOST, MAILER_PORT, MAILER_DOMAIN, MAILER_EMAIL, MAILER_PASSWORD } from 'config';

// Sender mail server config
const transporter = nodemailer.createTransport({
  // @ts-expect-error
  host: MAILER_HOST,
  port: MAILER_PORT,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: true,
  },
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASSWORD,
  },
});

/**
 * sendEmail
 * @param {string} email
 * @param {string} token
 * @param userName
 * @return {void}
 */
export const sendForgotEmail = async (
  email: string,
  token: string,
  userName: string,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Password reset request',
      text: `Welcome ${userName}, \n \n You have recently requested to reset your account password. Follow the link below to reset your password \n \n ${token} \n \n Thanks.`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

/**
 * send invitation email
 * @param {string} email
 * @param {string} token
 * @param userName
 * @return {void}
 */
export const sendInvitationEmail = async (
  email: string,
  token: string,
  userName: string,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Set password to activate your account',
      text: `Welcome ${userName}, \n \n You have successfully registered to VeriScan. Follow the link below to set your password \n \n ${token} \n \n Should you require any assistance or have any queries, our dedicated support team is ready to assist you. Please feel free to reach out to us via email at support@getveriscan.com. \n \n Thank you for choosing VeriScan.`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};

/**
 * send invitation email
 * @param {string} email
 * @param {string} token
 * @return {void}
 */
export const sendOtpCodeEmail = async (
  email: string,
  code: number,
): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: `VeriScan - Your Verification Code: ${code}`,
      text: `Hello, \n \n Following a sign-in attempt on your VeriScan account, our two-factor authentication process has been initiated. A unique verification code has been generated for your use. \n \n Verification Code: ${code} \n \n Please enter this code into the appropriate field on the VeriScan platform to continue with your sign-in. \n \n NOTE: This code is solely for your personal use and should not be shared. VeriScan representatives will never ask for this code outside of this automated process. \n \n If this sign-in attempt was not made by you, or if you have any issues or queries, please contact our support team immediately at support@getveriscan.com. \n \n Thank you for helping us to maintain your account's security. \n \n Best regards, \n The VeriScan Team`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
