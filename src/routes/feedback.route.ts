import { Router } from 'express';

import { checkUserAuth } from '@middleware/auth.middleware';

import {
  createFeedbackForm,
  getFeedbackForm,
  updateFeedbackForm,
  deleteFeedbackForm,
} from '@controllers/feedback.controller';

const router = Router();

router.post('/', checkUserAuth, createFeedbackForm);
router.get('/', checkUserAuth, getFeedbackForm);
router.put('/:userId', checkUserAuth, updateFeedbackForm);
router.delete('/:userId/:feedbackformId', checkUserAuth, deleteFeedbackForm);

export default router;
