/**
 * Code request controllers
 * @author Yousuf Kalim
 */
import { Response } from 'express';
import CodeRequest from '@interfaces/requests.interface';
import Requests from '@models/requests.model';
import IRequest from '@interfaces/request.interface';
import uid from '@utils/generateCode';
import Codes from '@models/codes.model';
import Users from '@models/users.model';

/**
 * create request
 * @param {object} req
 * @param {object} res
 */
export const create = async (req: IRequest, res: Response): Promise<Response> => {
  const requestBody: CodeRequest = req.body;
  try {
    const request = await Requests.create({ ...requestBody, brand: req.user?._id });

    return res.json({ success: true, message: 'Request has been created', request });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * get all requests
 * @param {object} req
 * @param {object} res
 */
export const getAllRequests = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    if (req.user?.role === 'admin') {
      const requests = await Requests.find().populate('brand').sort({ createdAt: -1 });

      return res.json({ success: true, requests });
    } else {
      const requests = await Requests.find({ brand: req.user?._id }).sort({ createdAt: -1 });

      return res.json({ success: true, requests });
    }
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get request by id
 * @param {object} req
 * @param {object} res
 */
export const getRequestById = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id).populate('brand');

    if (
      req.user?.role === 'brand' &&
      typeof request?.brand === 'object' &&
      req.user?._id !== String(request?.brand?._id)
    ) {
      return res
        .status(401)
        .json({ success: false, message: 'You are not authorized to access this resource' });
    }

    return res.json({ success: true, request });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Approve request
 * @param {object} req
 * @param {object} res
 */
export const approveRequest = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot approve a processed request' });
    }

    const brand = await Users.findById(request.brand);

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const codes: Array<{
      code: string;
      brand: string;
      brand_name: string;
      request: string;
      request_name: string;
    }> = [];

    for (let i = 0; i < request.number_of_codes; i++) {
      codes.push({
        code: uid(),
        brand: brand.id,
        brand_name: brand.name,
        request: request._id,
        request_name: request.name,
      });
    }

    Codes.insertMany(codes)
      .then(() => console.log(`${codes.length} codes has been created`))
      .catch(console.log);

    request.status = 'approved';
    await request.save();

    return res.json({ success: true, message: 'Request approved successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * delete request
 * @param {object} req
 * @param {object} res
 */
export const deleteRequest = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot delete processed request' });
    }

    await Requests.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Request has been deleted' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Reject request
 * @param {object} req
 * @param {object} res
 */
export const rejectRequest = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status === 'approved') {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot decline processed request' });
    }

    request.status = 'rejected';
    await request.save();

    return res.json({ success: true, message: 'Request has been rejected', request });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Reject request
 * @param {object} req
 * @param {object} res
 */
export const invalidateRequest = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'approved') {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot take action on pending/rejected request' });
    }
    await Requests.findByIdAndUpdate(request._id, { status: 'invalidated' });
    await Codes.updateMany({ request: request._id, status: 'pending' }, { status: 'invalidated' });
    return res.json({
      success: true,
      message: 'Codes has been invalidated for this request',
      request,
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Reject request
 * @param {object} req
 * @param {object} res
 */
export const validateRequest = async (req: IRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    const request = await Requests.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'invalidated') {
      return res.status(400).json({ success: false, message: 'You cannot process this request' });
    }
    await Requests.findByIdAndUpdate(request._id, { status: 'approved' });
    await Codes.updateMany({ request: request._id, status: 'invalidated' }, { status: 'pending' });
    return res.json({
      success: true,
      message: 'Codes has been activated for this request',
      request,
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
