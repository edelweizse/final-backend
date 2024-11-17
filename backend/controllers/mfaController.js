import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.js';

export class MFAController {
  constructor() {
    this.verifyOTP = this.verifyOTP.bind(this);
    this.enableMFA = this.enableMFA.bind(this);
    this.disableMFA = this.disableMFA.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.setTokenCookie = this.setTokenCookie.bind(this);
  }
  generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  setTokenCookie = (res, token) => {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    })
  }

  async verifyOTP (req, res) {
    try {
      const { userId, otp } = req.body;

      const user = await User.findById(userId);
      if (!user || !user.isMFAEnabled) {
        return res.status(404).json({ message: 'Invalid request' });
      }

      const isValid = speakeasy.totp.verify({
        secret: user.MFASecret,
        encoding: 'base32',
        token: otp
      });

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }

      const token = this.generateToken(user._id, user.role);
      this.setTokenCookie(res, token);  

      res.status(200).json({ message: 'TOTP  verification successful', user: { ...user._doc, password: null } });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async enableMFA (req, res) {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user || user.isMFAEnabled) {
        return res.status(404).json({ message: 'Invalid request' });
      }

      const secret = speakeasy.generateSecret({ length: 20 });
      user.MFASecret = secret.base32;
      user.OTPUrl = secret.otpauth_url;
      user.isMFAEnabled = true;

      await user.save();

      res.status(200).json({ 
        message: 'MFA enabled',
        user: { ...user._doc, password: null }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async disableMFA (req, res) {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user || !user.isMFAEnabled) {
        return res.status(404).json({ message: 'Invalid request' });
      }

      user.MFASecret = null;
      user.OTPUrl = null;
      user.isMFAEnabled = false;

      await user.save();

      res.status(200).json({ message: 'MFA disabled', user: { ...user._doc, password: null } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
}

export default MFAController;