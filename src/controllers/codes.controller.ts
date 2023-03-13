/**
 * Code controllers
 * @author Yousuf Kalim
 */
import { Response } from 'express';
import Codes from '@models/codes.model';
import IRequest from '@interfaces/request.interface';

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

      return res.json({ success: true, page, totalPages, codes });
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
