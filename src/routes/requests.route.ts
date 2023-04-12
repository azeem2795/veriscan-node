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
  invalidateRequest,
  validateRequest,
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
router.post('/', checkUserAuth, validateCodeRequest, isValidated, create); // Create a request

router.get('/', checkUserAuth, getAllRequests); // Get all requests
router.get('/:id', checkUserAuth, getRequestById); // Get request by id

router.patch('/approve/:id', checkAdminAuth, approveRequest); // Approve a request and create codes
router.patch('/reject/:id', checkAdminAuth, rejectRequest); // Reject a request

router.patch('/invalidate/:id', checkAdminAuth, invalidateRequest); // Invalidate/Validate a request
router.patch('/validate/:id', checkAdminAuth, validateRequest); // Invalidate/Validate a request

router.delete('/:id', checkUserAuth, deleteRequest); // Delete a request

// Export
export default router;
