/**
 * Code request routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import { create, deleteRequest } from '@controllers/requests.controller';
import { validateCodeRequest, isValidated } from '@middleware/validations.middleware';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create a request
 * @method delete delete a request
 */
router.post('/', checkUserAuth, validateCodeRequest, isValidated, create);
router.delete('/:id', checkUserAuth, deleteRequest);

// Export
export default router;
