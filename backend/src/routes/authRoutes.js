import express from 'express';
import { login, logout, me, register } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.get('/me', verifyToken, me);

export default AuthRouter;