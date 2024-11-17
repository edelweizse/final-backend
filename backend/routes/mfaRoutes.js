import express from 'express';
import MFAController from '../controllers/mfaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const mFAController = new MFAController();

/**
 * @openapi
 * /mfa/verify:
 *   post:
 *     summary: Verify OTP for MFA
 *     tags: [MFA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: TOTP verification successful
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "TOTP verification successful"
 *               }
 *       401:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Invalid OTP"
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
router.post('/verify', mFAController.verifyOTP);

/**
 * @openapi
 * /mfa/enable:
 *   post:
 *     summary: Enable MFA for a user
 *     tags: [MFA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA enabled
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "MFA enabled successfully"
 *               }
 *       404:
 *         description: Invalid request or user not found
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User not found"
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
router.post('/enable', protect, mFAController.enableMFA);

/**
 * @openapi
 * /mfa/disable:
 *   post:
 *     summary: Disable MFA for a user
 *     tags: [MFA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA disabled
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "MFA disabled successfully"
 *               }
 *       404:
 *         description: Invalid request or user not found
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "User not found"
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
router.post('/disable', protect, mFAController.disableMFA);

export default router;
