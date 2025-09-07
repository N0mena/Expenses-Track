import express from 'express';
import { signup,login,getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/signup',signup)

router.post('/login',login)

router.get('/me',getMe,authenticateToken)

export default router;