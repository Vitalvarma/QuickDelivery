import { login, register, logout,refreshToken,checkAuth } from '../controllers/auth.controller.js';
import express from 'express';
const router = express.Router();

router.post('/login',login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/checkauth', checkAuth);
router.get('/refreshtoken', refreshToken);


export default router;