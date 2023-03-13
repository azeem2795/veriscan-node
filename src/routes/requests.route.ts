/**
 * Code request routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import { create } from '@controllers/requests.controller';
import { validateCodeRequest, isValidated } from '@middleware/validations.middleware';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post create a request
 */
router.post('/', checkUserAuth, validateCodeRequest, isValidated, create);

// Export
export default router;
