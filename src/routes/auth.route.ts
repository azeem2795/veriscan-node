/**
 * User auth routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import {
  login,
  confirmAuth,
  changePassword,
  resetPassword,
  forgot,
  verifyToken,
} from '@controllers/auth.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
import {
  validateLogin,
  isValidated,
  changePasswordValidate,
} from '@middleware/validations.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post('/login', validateLogin, isValidated, login); // Get all users at once
router.get('/', checkUserAuth, confirmAuth); // Check user auth
router.get('/verify-token/:token', verifyToken);
router.put('/reset-password/:token', resetPassword);
router.put('/password/', checkUserAuth, changePasswordValidate, isValidated, changePassword); // Change password route
router.put('/forgot/:email', forgot); // Forgot password

// Export
export default router;
