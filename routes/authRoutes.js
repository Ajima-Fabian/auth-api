import express from 'express';

import {
  register,
  login,
  refreshToken,
  logout,
  profile,
  adminRoute,
} from '../controllers/authController.js';

import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, profile);
router.get('/admin', authenticate, authorize('admin'), adminRoute);

export default router;