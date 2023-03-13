/**
 * Code request controllers
 * @author Yousuf Kalim
 */
import { Response } from 'express';
import CodeRequest from '@interfaces/requests.interface';
import Requests from '@models/requests.model';
import IRequest from '@interfaces/request.interface';

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
