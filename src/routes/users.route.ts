/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import {
  createAdmin,
  updateAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
} from '@controllers/users.controller';
import { checkAdminAuth } from '@middleware/auth.middleware';
import {
  validateAdmin,
  validateAdminUpdate,
  isValidated,
} from '@middleware/validations.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post('/admin', validateAdmin, isValidated, createAdmin);

// Read
router.get('/admin', checkAdminAuth, getAllAdmins); // Get all users at once
router.get('/admin/:userId', checkAdminAuth, getAdminById); // Get one user by it's id

// Update
router.put('/admin', checkAdminAuth, validateAdminUpdate, isValidated, updateAdmin); // Update a specific user by it's id

// Delete
router.delete('/admin/:userId', checkAdminAuth, deleteAdmin); // delete a specific user by it's id

// Export
export default router;
