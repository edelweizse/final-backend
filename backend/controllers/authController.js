import { User } from '../db/models/user.js';
import jwt from 'jsonwebtoken';

export class AuthController {

  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.setTokenCookie = this.setTokenCookie.bind(this);
  }

  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  setTokenCookie(res, token) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    })

    return token;
  }
  async register(req, res) {
    const { username, password, email } = req.body;
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }
  
      const ifUserExists = await User.findOne({ email });
      if (ifUserExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = this.generateToken(user._id, user.role);
      this.setTokenCookie(res, token);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          ...user._doc,
          password: null
        }
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      if(user.isMFAEnabled) {
        return res.status(200).json({ message: 'MFA required', isMFAEnabled: true, userId: user._id });
      }

      const token = this.generateToken(user._id, user.role);
      this.setTokenCookie(res, token);

      res.status(200).json({
        message: 'User logged in successfully',
        user: {
          ...user._doc,
          password: null
        },
        isMFAEnabled: false
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async logout (req, res) {
    try {
      if (!req.cookies.token) {
        return res.status(400).json({ message: 'User not logged in' });
      }
      res.clearCookie('token');
      res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }

  async checkAuth (req, res) {
    try {
      if (!req.cookies.token) {
        return res.status(400).json({ message: 'User not logged in' });
      }

      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user: { ...user._doc, password: null } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
}

export default AuthController;