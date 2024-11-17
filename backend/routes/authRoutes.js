import express from 'express';
import AuthController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User registered successfully",
 *                 "user": {
 *                   "username": "john_doe",
 *                   "email": "john.doe@example.com",
 *                   "role": "user",
 *                   "isMFAEnabled": false
 *                 }
 *               }
 *       400:
 *         description: Bad request, missing fields or user exists
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Missing required fields or user already exists"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Internal server error"
 *               }
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User logged in successfully",
 *                 "token": "jwt_token_string_here"
 *               }
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Invalid credentials"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Internal server error"
 *               }
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User logged out successfully"
 *               }
 *       400:
 *         description: User not logged in
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User not logged in"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Internal server error"
 *               }
 */
router.post('/logout', protect, authController.logout);

/**
 * @openapi
 * /auth/checkAuth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User is authenticated"
 *               }
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User is not authenticated"
 *               }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Internal server error"
 *               }
 */
router.get('/checkAuth', authController.checkAuth);

export default router;
