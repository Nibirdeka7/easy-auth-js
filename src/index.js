import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js"; 

let isInitialized = false;
let isConnected = false;

const init = async (config) => {    
    if(isInitialized){
        console.warn('AuthFlow is already initialized');
        return;    }
    if(!config.mongoURI){
        throw new Error('MongoDB URI is required');
    }
    if(!config.jwtSecret){
        throw new Error('JWT secret is required');
    }
    process.env.MONGO_URI = config.mongoURI;
    process.env.JWT_SECRET = config.jwtSecret;
    if (config.mail) {
      process.env.SMTP_HOST = config.mail.host;
      process.env.SMTP_USER = config.mail.user;
      process.env.SMTP_PASS = config.mail.pass;
      process.env.SMTP_PORT = config.mail.port || 587;
      
    } 

    if (config.jwtExpiry) {
        process.env.JWT_EXPIRY = config.jwtExpiry;
    }
    
    if (config.cookieOptions) {
        process.env.COOKIE_HTTPONLY = config.cookieOptions.httpOnly !== false;
        process.env.COOKIE_SECURE = config.cookieOptions.secure || false;
        process.env.COOKIE_SAME_SITE = config.cookieOptions.sameSite || 'strict';
        process.env.COOKIE_MAX_AGE = config.cookieOptions.maxAge || 24 * 60 * 60 * 1000;
    }

    try {
        await mongoose.connect(config.mongoURI);
        console.log(' MongoDB connected successfully');
        isConnected = true;
    } catch (err) {
        console.error(' MongoDB connection error:', err.message);
        throw err;
    }
    
    if (config.mail) {
        const { initMailService } = await import('./utils/mailService.js');
        initMailService();
    }
    
    isInitialized = true;
    console.log('AuthFlow initialized successfully');
};

const createAuthRouter = () => {
    const authRouter = express.Router();
    authRouter.use(express.json());
    authRouter.use(cookieParser());
    authRouter.use('/', authRoutes);
    return authRouter;
};

const healthCheck = () => {
  return {
    initialized: isInitialized,
    connected: isConnected,
    timestamp: new Date().toISOString()
  };
};

export default {
    init,
    router: createAuthRouter(),
    createAuthRouter,
    healthCheck
};