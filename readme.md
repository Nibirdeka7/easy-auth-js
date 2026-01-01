# 📖 AuthFlow Backend – Complete Documentation

**@nibir_dev/authflow**

A **production-ready, zero-configuration authentication system** for **Express.js + MongoDB**.  
Handle user authentication, email verification, password resets, and protected routes with minimal code.

---

## 🚀 Quick Start

### 📦 Installation
`
npm install @nibir_dev/authflow
`
### Configuration

```
---
import express from 'express';
import authflow from '@nibir_dev/authflow';

const app = express();
app.use(express.json());

// Initialize AuthFlow with your config
authflow.init({
  mongoURI: 'mongodb://localhost:27017/your-database',
  jwtSecret: 'your-super-secret-jwt-key',
  mail: {
    host: 'smtp.gmail.com',
    port: 587,
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Mount authentication routes
app.use('/api/auth', authflow.router);

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
`
## Features
✅ User registration with email verification
✅ Secure login & logout using JWT
✅ Password reset flow
✅ Email notifications (welcome, verification, reset password)
✅ Protected route middleware
✅ HTTP-only secure cookies
✅ MongoDB integration
✅ CORS ready
✅ Production security best practices
✅ Zero boilerplate code


## Philosophy
AuthFlow is designed to be:

Plug & Play

Secure by default

Developer-first

Production ready

No repeated auth logic. No reinventing the wheel.
Just install, configure, and ship. 🚢

## Author
Nibir Deka
📦 npm: @nibir_dev/authflow