/**
 * Code controllers
 * @author Yousuf Kalim
 */
import { Response } from 'express';
import Codes from '@models/codes.model';
import InvalidAttempts from '@models/invalidAttempts.model';
import IRequest from '@interfaces/request.interface';

import BrandFeedback from '@models/brandFeedback';

import ICode from '@interfaces/codes.interface';
import { getLocationByIP } from '@/utils/common';

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
 * Get codes
 * @param {object} req
 * @param {object} res
 */
export const getUserLocations = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { brandId } = req.params;
    const codes: ICode[] = await Codes.find({ brand: brandId, scan_attempts: { $gt: 0 } });
    const invalidAttempts = codes?.map((item) =>
      item?.repeated_attempts?.map((a) => {
        const { timestamp, ip_address: ipAddress, lat, long, city, country, zip, region } = a;
        return {
          code: item.code,
          batch: item.request_name,
          timestamp,
          ipAddress,
          lat,
          long,
          city,
          country,
          zip,
          region,
        };
      }),
    );
    console.log('invalidAttempts', invalidAttempts);
    const locations = invalidAttempts.flat();
    console.log('locations', locations);

    // Get valid locations
    const validData = [];
    for (const code of codes) {
      if (code?.valid_attempt_location?.lat) {
        validData.push({
          ...code.valid_attempt_location,
          timestamp: code.validation_time,
          batch: code.request_name,
          code: code.code,
        });
      }
    }
    const invalidLocations = locations?.map((item) => ({
      ...item,
      name: item?.city,
      latLng: [item?.lat, item?.long],
      color: '#ff0000',
      status: 'invalid',
    }));

    const validLocations = validData?.map((item) => ({
      ...item,
      latLng: [item?.lat, item?.long],
      name: item?.city,
      color: '#00ff00',
      status: 'valid',
    }));
    return res.json({
      success: true,
      data: { locations: [...validLocations, ...invalidLocations] },
    });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get codes
 * @param {object} req
 * @param {object} res
 */
export const getAllLocations = async (_req: IRequest, res: Response): Promise<Response> => {
  try {
    console.log('0');
    // await Codes.collection.createIndex({ scan_attempts: 1 }, { background: true });
    // const query = Codes.find({ scan_attempts: { $gt: 0 } });
    // const executionDetails = await query.explain('executionStats').exec();

    const codes: ICode[] = await Codes.find({ scan_attempts: { $gt: 0 } });
    console.log('1', codes);
    const repeatedAttempts = codes?.map((item) =>
      item?.repeated_attempts?.map((a) => {
        const { timestamp, ip_address: ipAddress, lat, long, city, country, zip, region } = a;
        return {
          code: item.code,
          batch: item.request_name,
          timestamp,
          ipAddress,
          lat,
          long,
          city,
          country,
          zip,
          region,
        };
      }),
    );
    const locations = repeatedAttempts.flat();

    // Get valid locations
    const validData = [];
    for (const code of codes) {
      if (code?.valid_attempt_location?.lat) {
        validData.push({
          ...code.valid_attempt_location,
          timestamp: code.validation_time,
          batch: code.request_name,
          code: code.code,
          ipAddress: code.ip_address,
        });
      }
    }
    const invalidAttempt = await InvalidAttempts.find();

    const invalidLocations = invalidAttempt?.map((item: any) => ({
      code: item?.code,
      timestamp: item?.updatedAt,
      ipAddress: item?.location?.ip_address,
      lat: item?.location?.lat,
      long: item?.location?.long,
      city: item?.location?.city,
      country: item?.location?.country,
      zip: item?.location?.zip,
      region: item?.location?.region,
      name: item?.location.city,
      latLng: [item?.location?.lat, item?.location?.long],
      color: '#FF0000',
      status: 'invalid_attempt',
    }));

    const repeatedLocations = locations?.map((item) => ({
      ...item,
      name: item?.city,
      latLng: [item?.lat, item?.long],
      color: '#FFA500',
      status: 'repeated',
    }));
    const validLocations = validData?.map((item) => ({
      ...item,
      latLng: [item?.lat, item?.long],
      name: item?.city,
      color: '#00ff00',
      status: 'valid',
    }));
    return res.json({
      success: true,
      data: { locations: [...validLocations, ...repeatedLocations, ...invalidLocations] },
    });
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
  const { brand, status, request } = req.query;
  try {
    if (req.user?.role === 'admin') {
      const codes = await Codes.find({ brand, status, request });

      return res.json({ success: true, codes });
    } else {
      const codes = await Codes.find({ brand: req.user?._id, status, request });

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
  const { codeId, brandId, feedbacks, code_type: codeType } = req.body;
  try {
    const code = await Codes.findOne({ code: codeId, brand: brandId });
    const ipAddress = req.ip;

    if (!code) {
      const location = await getLocationByIP(ipAddress);
      const isExist: any = await InvalidAttempts.findOne({
        $or: [
          {
            code: codeId,
          },
          {
            location: {
              ipAddress,
            },
          },
        ],
      });

      if (isExist) {
        const currentDate = new Date();
        const currentTime = currentDate.getTime() / 60000;
        const createdTime = new Date(isExist.createdAt).getTime() / 60000;

        const expiryTime = 60;
        const anHourSpend = currentTime - createdTime > expiryTime;

        if (anHourSpend) {
          await InvalidAttempts.create({
            location,
            code: codeId,
            user_agent: req.get('User-Agent'),
          });
        } else {
          console.log('Not Spend hour *******');
        }
        // console.log('Current Date 88888888 ', currentDate);
        // const difference = currentDate.diff(createdAt, 'minutes', true);
        // const difference = moment.duration(currentDate.diff(createdAt));
        // console.log('Difference ', difference);
      } else {
        await InvalidAttempts.create({
          location,
          code: codeId,
          user_agent: req.get('User-Agent'),
        });
      }
    }

    if (!code || code.status === 'invalidated') {
      return res
        .status(404)
        .json({ success: false, status: 'invalid', message: 'This code is invalid.' });
    }
    if (code?.code_type !== codeType) {
      return res.status(400).json({
        success: false,
        message: 'Code type is invalid',
      });
    }

    const result = new BrandFeedback({
      fileds: feedbacks,
      brand: brandId,
    });
    await result.save();

    if (code.status === 'validated') {
      const location = await getLocationByIP(ipAddress);
      if (location) {
        const ifExist = code?.repeated_attempts?.find(
          (item) => item.lat === location?.lat && item.long === location.long,
        );
        if (!ifExist) {
          code.repeated_attempts?.push(location);
        }
      }

      code.scan_attempts = code.scan_attempts + 1;
      await code.save();

      return res.status(400).json({
        success: false,
        status: 'used',
        message: 'This code has already been scanned',
        validationTime: code.validation_time,
      });
    }

    code.status = 'validated';
    code.ip_address = ipAddress;
    code.user_agent = req.get('User-Agent');
    code.validation_time = new Date();
    code.scan_attempts = code.scan_attempts + 1;
    const location = await getLocationByIP(ipAddress);
    if (location) {
      code.valid_attempt_location = location;
    }
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
