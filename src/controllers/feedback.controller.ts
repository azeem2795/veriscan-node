import IFeedbackForm from '@/interfaces/feedbackForm.interface';
import IRequest from '@/interfaces/request.interface';
import FeedbackForm from '@models/feedBackForm';
import { Response } from 'express';

export const createFeedbackForm = async (req: IRequest, res: Response): Promise<Response> => {
  const feedbackForm: IFeedbackForm = req.body;

  try {
    console.log('feedbackForm', feedbackForm);
    console.log('req.user', req.user?._id);
    const newForm = await FeedbackForm.create({ ...feedbackForm, brand: req.user?._id });

    return res.json({ success: true, newForm });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updateFeedbackForm = async (req: IRequest, res: Response): Promise<Response> => {
  const feedbackForm: IFeedbackForm[] = req.body;
  const { userId } = req.params;

  try {
    for (const form of feedbackForm) {
      await FeedbackForm.updateMany(
        { brand: userId, _id: form._id }, // Add any additional conditions if needed
        { $set: form },
      );
    }

    return res.json({ success: true, message: 'Feedback Update successfully' });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteFeedbackForm = async (req: IRequest, res: Response): Promise<Response> => {
  const { userId, feedbackformId } = req.params;

  try {
    console.log('userId', userId);
    console.log('feedbackformId', feedbackformId);

    const deletedForm = await FeedbackForm.findOneAndDelete({ _id: feedbackformId, brand: userId });

    return res.json({ success: true, deletedForm });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getFeedbackForm = async (req: IRequest, res: Response): Promise<Response> => {
  const feedbackForm: IFeedbackForm = req.body;

  try {
    console.log('feedbackForm', feedbackForm);
    console.log('req.user', req.user);
    //  await Feedback.create({ ...feedbackForm, brand: req.user?._id });
    const feedbackForms = await FeedbackForm.find({ brand: req.user?._id });
    console.log('feedbackForm', feedbackForms);

    return res.json({ success: true, feedbackForms });
  } catch (err) {
    // Error handling
    // eslint-disable-next-line no-console
    console.log('Error ----> ', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
