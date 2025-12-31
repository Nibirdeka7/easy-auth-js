import { generateOTP } from "../utils/otpGenerator.js"
import { User } from "../models/user.model.js"
import { getMailService } from "../utils/mailService.js";


import { generateTokenAndSetCookie } from '../utils/generateTokenandSetCookie.js'

export const signup = async (req, res) => {
  const mailService = getMailService();
    try {
      console.log("Tyring to signup")
      console.log(req.body)
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        const existingUser = await User.findOne({ email });
            if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 24*60*60*1000);
        const user = new User({
            name, email, password, 
            verificationOTP: otp,
            verificationOTPExpires: otpExpires
        });
        await user.save();
        console.log("User saved")
         await mailService.sendVerificationEmail(email, otp);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Verification OTP sent to email.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });


    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });

    }
}

export const verifyEmail = async (req, res) => {
    const mailService = getMailService();

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and OTP are required'
        });
        }

        const user = await User.findOne({
            email,
            verificationOTP: otp,
            verificationOTPExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        await mailService.sendWelcomeEmail(user.email, user.name);
        res.json({
        success: true,
        message: 'Email verified successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }
        });
    } catch (error) {
         console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

export const login = async (req, res) => {
    const mailService = getMailService();

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie('auth_token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
