/**
 * User auth controllers
 * @author Yousuf Kalim
 */
import { Request, Response } from 'express';
import IRequest from '@interfaces/request.interface';
import Auth, { ChangePassword } from '@interfaces/auth.interface';
import Users from '@models/users.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendForgotEmail } from '@utils/sendEmail';
import { BCRYPT_SALT, JWT_SECRET, ORIGIN } from '@config';

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const body: Auth = req.body;

  try {
    // Getting email and password
    const { email, password } = body;

    // Getting user from db
    const user = await Users.findOne({ email });

    if (!user) {
      // If user not found
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.password || !user.active) {
      // If user is not activated
      return res.status(404).json({ success: false, message: 'Your account is not activated' });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }

    // Creating payload with user object
    delete user.password; // Removing password from user object
    const payload = { user };

    // Generating token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    return res.json({ success: true, user, token });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
export const changePassword = async (req: IRequest, res: Response): Promise<Response> => {
  const userId = req.user?._id;
  const body: ChangePassword = req.body;

  try {
    const { oldPassword, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password are not same',
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password as string);

    if (!isMatched) {
      return res.status(400).json({ success: false, message: 'Invalid old Password' });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, BCRYPT_SALT);

    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
export const forgot = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.params;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generating token
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '15m' });

    await sendForgotEmail(email, `${ORIGIN}/verify/${token}`, user.name);

    // Done
    return res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Verify token
 * @param {object} req
 * @param {object} res
 */
export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await Users.findById(decoded.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Token verified successfully',
      userId: user._id,
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Reset password
 * @param {object} req
 * @param {object} res
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await Users.findById(decoded.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = bcrypt.hashSync(req.body.password, 10);
    user.active = true;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
export const confirmAuth = (req: IRequest, res: Response): Response => {
  // If user authenticated
  return res.json({ success: true, user: req.user });
};
