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
  updateBrandDescription,
  updateBrandBackground,
  socialMediaUpdate,
  customeBtnUpdate,
  updateFavIcon,
  deleteSocialMedia,
  getBrandByName,
  getStats,
  changeStatus,
} from '@controllers/users.controller';
import { checkAdminAuth, checkUserAuth } from '@middleware/auth.middleware';
import { upload, backgroundUpload } from '@middleware/multer.middleware';
import { validateAdmin, validateBrand, isValidated } from '@middleware/validations.middleware';
const router = Router();

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post admin signup
 * @method post add a brand
 * @method get get all users
 * @method get get brand by brand name
 * @method get get user by id
 * @method put update admin
 * @method put update brand
 * @method delete an admin
 */

// Create - User Signup
router.post('/admin', validateAdmin, isValidated, createAdmin); // Register an admin
router.post('/brand', upload.single('logo'), validateBrand, isValidated, createBrand); // Add a brand

// Read
router.get('/', checkAdminAuth, getAll); // Get all users at once
router.get('/stats', checkUserAuth, getStats);
router.get('/brand/:url', getBrandByName); // Get brand by name
router.get('/:userId', checkUserAuth, getById); // Get one user by id

// Update
router.put('/admin', checkAdminAuth, updateAdmin); // Update an admin
router.put('/brand/:userId', checkUserAuth, upload.single('logo'), updateBrand); // Update a specific brand by id
router.put('/brand/description/:userId', checkUserAuth, updateBrandDescription); // Update a specific brand by id
router.put(
  '/brand/bgImg/:userId',
  checkUserAuth,
  backgroundUpload.single('img'),
  updateBrandBackground,
); // Update a specific brand by id

router.put('/brand/favIcon/:userId', checkUserAuth, upload.single('favIcon'), updateFavIcon); // Update a specific brand by id

router.put('/brand/socialLinks/:userId', checkUserAuth, socialMediaUpdate); // Update a specific brand by id
router.put('/brand/customButton/:userId', checkUserAuth, customeBtnUpdate); // Update a specific brand by id
router.delete('/brand/socialLinks/:userId/:platformId', checkUserAuth, deleteSocialMedia); // Update a specific brand by id

router.patch('/change-status/:id', checkAdminAuth, changeStatus); // Deactivate a user

// Delete
router.delete('/admin/:userId', checkAdminAuth, deleteAdmin); // delete a specific admin by id

// Export
export default router;
