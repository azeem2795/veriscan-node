/**
 * Code routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import { getCodes } from '@controllers/codes.controller';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get get codes
 */
router.get('/', checkUserAuth, getCodes);

// Export
export default router;
