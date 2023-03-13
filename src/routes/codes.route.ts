/**
 * Code routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import { exportCodes, getCodes, invalidateCodes } from '@controllers/codes.controller';
import { isValidated, validateCodesInvalidate } from '@middleware/validations.middleware';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method get get codes
 */
router.get('/', checkUserAuth, getCodes);
router.get('/export', checkUserAuth, exportCodes);

router.put('/invalidate', validateCodesInvalidate, isValidated, invalidateCodes);

// Export
export default router;
