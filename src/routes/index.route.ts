/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
import { Router } from 'express';
import userRoutes from './users.route';
import authRoutes from './auth.route';
const router = Router();

// Parent Routes
router.use('/users', userRoutes); // All the user routes
router.use('/auth', authRoutes); // All the auth routes

// Export
export default router;
