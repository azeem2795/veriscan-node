/**
 * Send email service for forgot password
 * @author Yousuf Kalim
 */
import nodemailer from 'nodemailer';
import { MAILER_DOMAIN, MAILER_EMAIL, MAILER_PASSWORD } from 'config';

// Sender mail server config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAILER_EMAIL,
    pass: MAILER_PASSWORD,
  },
});

/**
 * sendEmail
 * @param {string} email
 * @param {string} token
 * @return {void}
 */
export const sendForgotEmail = async (email: string, token: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Password reset request',
      text: `You have initiated the request to reset your password, please click on the link below to set your new password \n ${token}`,
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
export const sendInvitationEmail = async (email: string, token: string): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Set password to activate your account',
      text: `You have been registered on vape verification, please click on the link to set your password and activate the account: \n ${token}`,
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
