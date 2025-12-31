import express from 'express';
import {
  signup,
  verifyEmail,
  login,
  logout,
  checkAuth
} from '../controllers/auth.controller.js';
import {
  forgotPassword,
  resetPassword
} from '../controllers/password.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post('/logout', protect, logout);
router.get('/check-auth', protect, checkAuth);

export default router;