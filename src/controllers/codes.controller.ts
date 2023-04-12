/**
 * Code controllers
 * @author Yousuf Kalim
 */
import { Response } from 'express';
import Codes from '@models/codes.model';
import IRequest from '@interfaces/request.interface';
const moment = require('moment');

/**
 * Get codes
 * @param {object} req
 * @param {object} res
 */
export const getCodes = async (req: IRequest, res: Response): Promise<Response> => {
  const { brand, status } = req.query;
  const page = parseInt((req.query.page as string) ?? '1');
  const limit = parseInt((req.query.limit as string) ?? '100');
  const skip = (page - 1) * limit;
  try {
    if (req.user?.role === 'admin') {
      const codes = await Codes.find({ brand, status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const codesLength = await Codes.countDocuments({ status, brand });
      const totalPages = Math.ceil(codesLength / limit);

      return res.json({ success: true, page, totalPages, codes });
    } else {
      const codes = await Codes.find({ brand: req.user?._id, status })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const codesLength = await Codes.countDocuments({ brand: req.user?._id, status });
      const totalPages = Math.ceil(codesLength / limit);

      return res.json({ success: true, page, totalPages, codes, total: codesLength });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Export codes
 * @param {object} req
 * @param {object} res
 */
export const exportCodes = async (req: IRequest, res: Response): Promise<Response> => {
  const { brand, status } = req.query;
  try {
    if (req.user?.role === 'admin') {
      const codes = await Codes.find({ brand, status });

      return res.json({ success: true, codes });
    } else {
      const codes = await Codes.find({ brand: req.user?._id, status });

      return res.json({ success: true, codes });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Invalidate codes
 * @param {object} req
 * @param {object} res
 */
export const invalidateCodes = async (req: IRequest, res: Response): Promise<Response> => {
  const { codes = [] } = req.body;
  try {
    if (req.user?.role === 'admin') {
      await Codes.updateMany({ _id: { $in: codes } }, { status: 'invalidated' });

      return res.json({ success: true, message: 'Codes invalidated successfully' });
    } else {
      await Codes.updateMany(
        { _id: { $in: codes }, brand: req.user?._id },
        { status: 'invalidated' },
      );

      return res.json({ success: true, message: 'Codes invalidated successfully' });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Validate a codes
 * @param {object} req
 * @param {object} res
 */
export const validateCode = async (req: IRequest, res: Response): Promise<Response> => {
  const { codeId, brandId } = req.body;
  try {
    const code = await Codes.findOne({ code: codeId, brand: brandId });

    if (!code || code.status === 'invalidated') {
      return res
        .status(404)
        .json({ success: false, status: 'invalid', message: 'This code is invalid.' });
    }

    if (code.status === 'validated') {
      code.scan_attempts = code.scan_attempts + 1;
      await code.save();

      // console.log('Code scanned ', new Date(code?.validation_time));


      const date = moment(code?.validation_time);
      const formattedDate = date.format('M/D/YYYY h:mmA');


      const message = `This code was already scanned on ${
        code?.validation_time ? formattedDate : ''
      }`;

      return res.status(400).json({
        success: false,
        status: 'used',
        message: `${message}`,
      });
    }

    code.status = 'validated';
    code.ip_address = req.ip;
    code.user_agent = req.get('User-Agent');
    code.validation_time = new Date();
    code.scan_attempts = code.scan_attempts + 1;
    await code.save();

    return res.json({ success: true, status: 'valid', message: 'This product is valid.' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Activate codes
 * @param {object} req
 * @param {object} res
 */
export const activateCodes = async (req: IRequest, res: Response): Promise<Response> => {
  const { codes = [] } = req.body;
  try {
    await Codes.updateMany({ _id: { $in: codes } }, { status: 'pending' });
    return res.json({ success: true, message: 'Codes activated successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
