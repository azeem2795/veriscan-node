/**
 * Code routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import { exportCodes, getCodes } from '@controllers/codes.controller';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get get codes
 */
router.get('/', checkUserAuth, getCodes);
router.get('/export', checkUserAuth, exportCodes);

// Export
export default router;
