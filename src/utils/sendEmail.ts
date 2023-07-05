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
      text: `Welcome ${userName}, \n \n You have successfully registered to VeriScan. Follow the link below to set your password \n \n ${token} \n \n Thanks.`,
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
export const sendOtpCodeEmail = async (email: string, code: number): Promise<object> => {
  return await new Promise((resolve, reject) => {
    // Send email options
    const mailOptions = {
      from: `${MAILER_DOMAIN} <${MAILER_EMAIL}>`,
      to: email,
      subject: 'Set password to activate your account',
      text: `Your verification code is  \n \n ${code} \n \n Please enter it to login.`,
    };

    // Sending email
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        // Error
        reject(error);
      } else {
        console.log('Email sent=======> ');
        // Success
        resolve({ success: true, message: 'Email sent successfully' });
      }
    });
  });
};
