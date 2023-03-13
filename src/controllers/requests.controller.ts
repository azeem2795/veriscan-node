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
