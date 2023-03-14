/**
 * Code routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { checkUserAuth } from '@middleware/auth.middleware';
import {
  exportCodes,
  getCodes,
  invalidateCodes,
  validateCode,
} from '@controllers/codes.controller';
import { isValidated, validateCodesInvalidate } from '@middleware/validations.middleware';

const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post validate a code
 * @method get get codes
 * @method get get all codes for export
 * @method put invalidate the codes
 */
router.post('/validate', validateCode); // Validate a code

router.get('/', checkUserAuth, getCodes); // get paginated codes
router.get('/export', checkUserAuth, exportCodes); // get all codes to export in csv

router.put('/invalidate', validateCodesInvalidate, isValidated, invalidateCodes); // Invalidate the codes

// Export
export default router;
