/**
 * Code request routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkAdminAuth, checkUserAuth } from '@middleware/auth.middleware';
import {
  create,
  deleteRequest,
  rejectRequest,
  getAllRequests,
  getRequestById,
  approveRequest,
} from '@controllers/requests.controller';
import { validateCodeRequest, isValidated } from '@middleware/validations.middleware';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create a request
 * @method get get all request
 * @method get get request by id
 * @method patch approve a request
 * @method patch reject the request
 * @method delete delete a request
 */
router.post('/', checkUserAuth, validateCodeRequest, isValidated, create);

router.get('/', checkUserAuth, getAllRequests);
router.get('/:id', checkUserAuth, getRequestById);

router.patch('/approve/:id', checkAdminAuth, approveRequest);
router.patch('/reject/:id', checkAdminAuth, rejectRequest);

router.delete('/:id', checkUserAuth, deleteRequest);

// Export
export default router;
