/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import {
  createAdmin,
  createBrand,
  updateAdmin,
  getAll,
  getById,
  deleteAdmin,
  updateBrand,
  getBrandByName,
} from '@controllers/users.controller';
import { checkAdminAuth, checkUserAuth } from '@middleware/auth.middleware';
import { upload } from '@middleware/multer.middleware';
import { validateAdmin, validateBrand, isValidated } from '@middleware/validations.middleware';
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
router.post('/brand', upload.single('logo'), validateBrand, isValidated, createBrand);

// Read
router.get('/', checkAdminAuth, getAll); // Get all users at once
router.get('/brand/:name', getBrandByName);
router.get('/:userId', checkUserAuth, getById); // Get one user by it's id

// Update
router.put('/admin', checkAdminAuth, updateAdmin); // Update a specific admin by it's id
router.put('/brand/:userId', checkUserAuth, upload.single('logo'), updateBrand); // Update a specific brand by it's id

// Delete
router.delete('/admin/:userId', checkAdminAuth, deleteAdmin); // delete a specific user by it's id

// Export
export default router;
