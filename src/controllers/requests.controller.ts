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
