/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
import { Request, Response } from 'express';
import Users from '@models/users.model';
import Requests from '@models/requests.model';
import Codes from '@models/codes.model';
import FeedbackForm from '@models/feedbackForm';
import User from '@interfaces/users.interface';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT, JWT_SECRET, CLIENT } from '@config';
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
    const { name, email, url } = body; // Getting required fields from body
    const brandName = `^${name}$`;
    const brandURL = `^${url}$`;
    const existingUser = await Users.findOne({
      $or: [
        { email },
        { name: { $regex: brandName, $options: 'i' } },
        { url: { $regex: brandURL, $options: 'i' } },
      ],
    }); // Finding already existing user

    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: 'User already exists with same email or name or url' });
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

    await sendInvitationEmail(email, `${CLIENT}/verify/${token}`, user.name);

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
        allRequests,
      ] = await Promise.all([
        Users.find({ role: 'brand' }).countDocuments(),
        Requests.find().countDocuments(),
        Codes.find().countDocuments(),
        Codes.find({ status: 'validated' }).countDocuments(),
        Users.find({ role: 'brand' }).select({ createdAt: 1 }),
        Requests.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(7),
        Requests.find().populate('brand').sort({ createdAt: -1 }),
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
          allRequests,
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
        allRequests,
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
        Requests.find({ brand: _id }).populate('brand').sort({ createdAt: -1 }),
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
          allRequests,
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
    const { url } = req.params; // Getting user id from URL parameter

    const brandurl = `/${url}`;

    // const brand = await Users.findOne({ url: { $regex: brandurl, $options: 'i' } });
    // eslint-disable-next-line
    const brand: any = await Users.findOne({ url: brandurl });

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const feedbackForm = await FeedbackForm.find({ brand: brand._id });
    const layout = brand?.layout ? brand?.layout : '1';
    console.log('brand', feedbackForm);
    const brandData = {
      name: brand.name,
      id: brand._id,
      logoWidth: brand.logoWidth ? brand.logoWidth : '',
      websiteLink: brand.websiteLink ? brand.websiteLink : '',
      preferences: brand.preferences,
      logo: brand.logo ? brand.logo : '',
      textTypography: brand.textTypography ? brand.textTypography : '',
      background: brand.background ? brand.background : '',
      socialMedia: brand.socialMedia ? brand.socialMedia : '',
      customizeButton: brand.customizeButton ? brand.customizeButton : '',
      description: brand.description ? brand.description : '',
      favIcon: brand.favIcon ? brand.favIcon : '',
      pageAnimation: brand.pageAnimation,
    };
    console.log('brandData', brandData);
    return res.json({
      success: true,
      brand: brandData,
      feedbackForm,
      layout,
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
  console.log('body', body);

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
      body.logo = req.file.path;
    }

    const brandName = `^${body.name}$`;
    const brandUrl = `^${body.url}$`;
    console.log('brandName', brandName);

    const isUserExists = await Users.findOne({
      $or: [
        {
          url: { $regex: brandUrl, $options: 'i' },
          _id: { $ne: userId },
        },
        {
          name: { $regex: brandName, $options: 'i' },
          _id: { $ne: userId },
        },
        { email: body.email, _id: { $ne: userId } },
      ],
    });
    // if (req?.user?.role === 'admin') {
    //   const isUrlExist = await Users.findOne({ url: { $regex: body.url, $options: 'i' } });

    //   if (isUrlExist) {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: 'User already exists with same url' });
    //   }
    // }

    if (isUserExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists with same name or email or url' });
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
export const updateBrandDescription = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line
  const body: any = req.body;

  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }
    console.log('body', body);
    // eslint-disable-next-line
    // const existingUser: any = await Users.findById(userId); // Fetching the existing user

    // if (existingUser?.textTypography) {
    //   if (body.textTypography.Body) {
    //     existingUser.textTypography.Body = body.textTypography.Body;
    //   } else if (body?.textTypography.Paragraph) {
    //     existingUser.textTypography.Paragraph = body.textTypography.Paragraph;
    //   } else {
    //     existingUser.textTypography.Heading = body.textTypography.Heading;
    //   }
    //   await Users.findByIdAndUpdate(userId, existingUser, { new: true }); // Updating the user
    // } else {
    //   await Users.findByIdAndUpdate(userId, body, { new: true }); // Updating the user
    // }
    await Users.findByIdAndUpdate(userId, body, { new: true }); // Updating the user

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updateBrandAnimations = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line
  // const body: any = req.body;

  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }
    // eslint-disable-next-line
    // const existingUser: any = await Users.findById(userId); // Fetching the existing user

    const { animation } = req.body;
    console.log('Anu ', animation);
    const anim = await Users.findByIdAndUpdate(
      req.user?._id,
      { pageAnimation: animation },
      { new: true },
    );

    console.log('Animatiokn ', anim);

    return res.json({
      success: true,
      message: 'Page animations has been updated successfully',
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateBrandLayouts = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line

  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }
    // eslint-disable-next-line

    const { layout } = req.body;
    console.log('layout', layout);
    await Users.findByIdAndUpdate(req.user?._id, { layout }, { new: true });
    // console.log('layoutDesign ', layoutDesign);

    return res.json({
      success: true,
      message: 'Layout updated successfully',
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updateBrandBackground = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line
  const body: any = req.body;
  const data = {
    img: '',
    type: '',
    selectedImg: '',
    color: '',
  };
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }

    if (body.type === 'img') {
      if (req.file?.path) {
        data.img = req.file.path;
        data.type = body.type;
        data.selectedImg = '';
        data.color = '';

        // upload in array db push
        await Users.findByIdAndUpdate(
          userId,
          { $push: { backgroundimages: req.file.path } },
          { new: true },
        );
      }
    } else if (body.type === 'color') {
      data.img = '';
      data.type = body.type;
      data.selectedImg = '';
      data.color = body.color;
    } else if (body.type === 'NoBG') {
      data.img = '';
      data.type = body.type;
      data.selectedImg = '';
      data.color = '';
    } else if (body.type === 'default') {
      data.type = body.type;
    } else {
      data.img = '';
      data.type = 'Selected';
      data.selectedImg = body.selectedImg;
      data.color = '';
    }
    console.log('data', data);

    await Users.findByIdAndUpdate(userId, { background: data }, { new: true }); // Updating the user
    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updateFavIcon = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }

    if (req.file?.path) {
      await Users.findByIdAndUpdate(
        userId,
        {
          $set: { favIcon: req.file.path },
          $push: { favIcons: req.file.path },
        },
        { new: true },
      );
    } else {
      await Users.findByIdAndUpdate(
        userId,
        {
          $set: { favIcon: req.body?.favIcon },
        },
        { new: true },
      );
    }

    // await Users.findByIdAndUpdate(userId, { background: data }, { new: true }); // Updating the user
    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const socialMediaUpdate = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line
  const body: any = req.body;
  try {
    const userId = req.params.userId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }

    const existingUser = await Users.findOne({
      _id: userId,
      'socialMedia.platform': body.platform,
    });

    if (existingUser) {
      // Update the link if the platform already exists
      await Users.findOneAndUpdate(
        { _id: userId, 'socialMedia.platform': body.platform },
        { $set: { 'socialMedia.$.link': body.link } },
        { new: true },
      );
    } else {
      // Add a new social media entry if the platform doesn't exist
      await Users.findByIdAndUpdate(
        userId,
        { $push: { socialMedia: { platform: body.platform, link: body.link } } },
        { new: true },
      );
    }

    // await Users.findByIdAndUpdate(userId, { background: data }, { new: true }); // Updating the user
    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const customeBtnUpdate = async (req: IRequest, res: Response): Promise<Response> => {
  // eslint-disable-next-line
  // const body: any = req.body;
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }
    // await Users.findByIdAndUpdate(userId, { customizeButton:body }, { new: true });

    return res.json({ success: true }); // Success
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteSocialMedia = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const platformId = req.params.platformId; // Getting user id from URL parameter

    if (req.user?.role === 'brand' && userId !== req.user._id) {
      return res
        .status(401)
        .json({ success: true, message: 'You are not authorized to get this resource' });
    }
    await Users.findOneAndUpdate(
      { _id: userId },
      { $pull: { socialMedia: { _id: platformId } } },
      { new: true },
    );

    // await Users.findByIdAndUpdate(userId, { background: data }, { new: true }); // Updating the user
    return res.json({ success: true }); // Success
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
