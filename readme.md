# 📖 AuthFlow Backend – Complete Documentation

**@nibir_dev/authflow**

A **production-ready, zero-configuration authentication system** for **Express.js + MongoDB**.  
Handle user authentication, email verification, password resets, and protected routes with minimal code.

---

## 🚀 Quick Start

### 📦 Installation
```bash
  npm i @nibir_dev/authflow
```
---
### Configuration

```javascript
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

```
---
## How to integrate in frontend
```javascript
await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

```
## Routes
```javascript
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post('/logout', protect, logout);
router.get('/check-auth', protect, checkAuth);
``` 
## Author
Nibir Deka
📦 npm: @nibir_dev/authflow
 [npm](https://www.npmjs.com/package/@nibir_dev/authflow)