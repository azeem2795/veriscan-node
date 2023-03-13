/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
import { Request, Response } from 'express';
import Users from '@models/users.model';
import User from '@interfaces/users.interface';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT } from '@config';

/**
 * Create Admin - Signup
 * @param {object} req
 * @param {object} res
 */
export const createAdmin = async (req: Request, res: Response): Promise<Response> => {
  const body: User = req.body;

  try {
    const { email, password } = body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    // Creating User
    body.password = bcrypt.hashSync(password as string, BCRYPT_SALT); // Hashing the password with salt 8
    const user = await Users.create({ ...body, role: 'admin' }); // Adding user in db

    // Done
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @param {object} _req
 * @param {object} res
 */
export const getAllAdmins = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await Users.find({ role: 'admin' }); // Finding all the users from db
    return res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
export const getAdminById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    const user = await Users.findOne({ _id: userId, role: 'admin' }); // Finding user by id
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
export const updateAdmin = async (req: Request, res: Response): Promise<Response> => {
  const body: User = req.body;

  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    // If user want to update it's password
    if (body.password) {
      body.password = bcrypt.hashSync(body.password, BCRYPT_SALT);
    }

    const user = await Users.findByIdAndUpdate(userId, body, { new: true }); // Updating the user
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
export const deleteAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findOneAndDelete({ _id: userId, role: 'admin' }); // Deleting the user
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
