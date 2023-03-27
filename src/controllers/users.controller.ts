/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
import { Request, Response } from 'express';
import Users from '@models/users.model';
import Requests from '@models/requests.model';
import Codes from '@models/codes.model';
import User from '@interfaces/users.interface';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT, JWT_SECRET, ADMIN } from '@config';
import IRequest from '@interfaces/request.interface';
import { sendInvitationEmail } from '@utils/sendEmail';
import jwt from 'jsonwebtoken';

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
 * Create Brand - Signup
 * @param {object} req
 * @param {object} res
 */
export const createBrand = async (req: Request, res: Response): Promise<Response> => {
  const body: User = req.body;

  if (body.preferences) {
    body.preferences = JSON.parse(body.preferences as string);
  }

  try {
    const { name, email } = body; // Getting required fields from body
    const brandName = `^${name}$`;
    const existingUser = await Users.findOne({
      $or: [{ email }, { name: { $regex: brandName, $options: 'i' } }],
    }); // Finding already existing user

    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: 'User already exists with same email or name' });
    }

    if (req.file?.path) {
      if (body.preferences) {
        body.preferences.logo = req.file.path;
      } else {
        body.preferences = {
          logo: req.file.path,
        };
      }
    }

    const user = await Users.create(body); // Adding user in db

    // Generating token
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '15m' });

    await sendInvitationEmail(email, `${ADMIN}/verify/${token}`);

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
 * @param {object} req
 * @param {object} res
 */
export const getAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const role = req.query.role ?? 'brand';

    const users = await Users.find({ role }); // Finding all the users from db
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
export const getById = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }

    const user = await Users.findById(userId); // Finding user by id
    return res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get stats
 * @param {object} req
 * @param {object} res
 */
export const getStats = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { _id, role } = req.user as User;

    if (role === 'admin') {
      const [
        brandCount,
        requestCount,
        codesCount,
        validatedCodesCount,
        brands,
        pendingCodeRequests,
      ] = await Promise.all([
        Users.find({ role: 'brand' }).countDocuments(),
        Requests.find().countDocuments(),
        Codes.find().countDocuments(),
        Codes.find({ status: 'validated' }).countDocuments(),
        Users.find({ role: 'brand' }).select({ createdAt: 1 }),
        Requests.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(7),
      ]);

      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const filteredData = brands.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return createdAt > sixMonthsAgo && createdAt <= now;
      });

      const stats: Record<string, number> = filteredData.reduce((result, item) => {
        const createdAt = new Date(item.createdAt);
        const month = createdAt.toLocaleString('default', { month: 'short' });
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        result[month] = (result[month] || 0) + 1;
        return result;
      }, {});

      return res.json({
        success: true,
        stats: {
          brandCount,
          requestCount,
          codesCount,
          validatedCodesCount,
          stats,
          pendingCodeRequests,
        },
      });
    } else if (role === 'brand') {
      const [
        requestCount,
        validatedCodesCount,
        invalidatedCodesCount,
        allCodesCount,
        pendingCodeRequests,
        validatedCodes,
      ] = await Promise.all([
        Requests.find({ brand: _id }).countDocuments(),
        Codes.find({
          brand: _id,
          status: 'validated',
        }).countDocuments(),
        Codes.find({
          brand: _id,
          status: 'invalidated',
        }).countDocuments(),
        Codes.find({
          brand: _id,
        }).countDocuments(),
        Requests.find({ brand: _id, status: 'pending' }).sort({ createdAt: -1 }).limit(7),
        Codes.find({ brand: _id, status: 'validated' }),
      ]);

      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const filteredData = validatedCodes.filter((item) => {
        const createdAt = new Date(item.validation_time as string);
        return createdAt > sixMonthsAgo && createdAt <= now;
      });

      const stats: Record<string, number> = filteredData.reduce((result, item) => {
        const createdAt = new Date(item.validation_time as string);
        const month = createdAt.toLocaleString('default', { month: 'short' });
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        result[month] = (result[month] || 0) + 1;
        return result;
      }, {});

      return res.json({
        success: true,
        stats: {
          requestCount,
          validatedCodesCount,
          invalidatedCodesCount,
          allCodesCount,
          stats,
          pendingCodeRequests,
        },
      });
    } else {
      return res.status(403).json({ success: false, message: 'You are not authorized' });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get brand by name
 * @param {object} req
 * @param {object} res
 */
export const getBrandByName = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { name } = req.params; // Getting user id from URL parameter

    const brandName = `^${name}$`;

    const brand = await Users.findOne({ name: { $regex: brandName, $options: 'i' } });

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    return res.json({
      success: true,
      brand: {
        name: brand.name,
        id: brand._id,
        preferences: brand.preferences,
      },
    }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update admin
 * @param {object} req
 * @param {object} res
 */
export const updateAdmin = async (req: IRequest, res: Response): Promise<Response> => {
  const body: User = req.body;

  try {
    const userId = req.user?._id; // Getting user id from URL parameter

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
 * Update brand
 * @param {object} req
 * @param {object} res
 */
export const updateBrand = async (req: IRequest, res: Response): Promise<Response> => {
  const body: User = req.body;

  if (body.preferences) {
    body.preferences = JSON.parse(body.preferences as string);
  }

  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }

    // If user want to update it's password
    if (body.password) {
      body.password = bcrypt.hashSync(body.password, BCRYPT_SALT);
    }

    if (req.file?.path) {
      if (body.preferences) {
        body.preferences.logo = req.file.path;
      } else {
        body.preferences = {
          logo: req.file.path,
        };
      }
    }

    const brandName = `^${body.name}$`;

    const isUserExists = await Users.findOne({
      $or: [
        {
          name: { $regex: brandName, $options: 'i' },
          _id: { $ne: userId },
        },
        { email: body.email },
      ],
    });
    console.log('USer exists ', isUserExists);

    if (isUserExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists with same name or email' });
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
 * Change status of a user
 * @param {object} req
 * @param {object} res
 */
export const changeStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // Getting brand id from params

    let user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set active property to false
    user = await Users.findByIdAndUpdate(id, { active: !user.active }, { new: true });

    // Done
    return res.json({ success: true, message: 'Brand deactivated successfully', user });
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
  const { userId } = req.params; // Getting userId from params
  try {
    let user = await Users.findById(userId); // Find user to check if exists

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role base delete
    if (user.role === 'admin') {
      // If role is admin then we don't need no delete any other data
      user = await Users.findByIdAndDelete({ _id: userId, role: 'admin' });

      // Done
      return res.json({ success: true, user });
    } else {
      // If role is brand then we need to delete requests and codes linked with that brand
      user = await Users.findByIdAndDelete({ _id: userId, role: 'brand' });
      await Requests.deleteMany({ brand: userId });
      await Codes.deleteMany({ brand: userId });

      //  Done
      return res.json({ success: true, user });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
