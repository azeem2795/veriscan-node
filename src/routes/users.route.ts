/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import { createAdmin, update, getAll, getById, deleteUser } from '@controllers/users.controller';
import { checkUserAuth } from '@middleware/auth.middleware';
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
router.get('/', checkUserAuth, getAll); // Get all users at once
router.get('/:userId', checkUserAuth, getById); // Get one user by it's id

// Update
router.put('/admin', checkUserAuth, validateAdminUpdate, isValidated, update); // Update a specific user by it's id

// Delete
router.delete('/:userId', checkUserAuth, deleteUser); // delete a specific user by it's id

// Export
export default router;
