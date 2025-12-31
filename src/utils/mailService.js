import nodemailer from 'nodemailer';

let mailServiceInstance = null;

class MailService {
  constructor() {
    const port = Number(process.env.SMTP_PORT) || 587;
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    
    if (!host || !user || !pass) {
      console.warn(' SMTP configuration incomplete. Email features will be disabled.');
      console.warn('   Provided config:', { host, user, port });
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: {
          user: user,
          pass: pass
        }
      });
      
      console.log(' SMTP transporter created');
    } catch (error) {
      console.error(' Failed to create SMTP transporter:', error.message);
      this.transporter = null;
    }
  }

  async sendVerificationEmail(email, otp) {
    if (!this.transporter) {
      console.log(` [MOCK] Verification OTP for ${email}: ${otp}`);
      return Promise.resolve();
    }

    try {
      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">
              ${otp}
            </h1>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(` Verification email sent to ${email}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(` Failed to send verification email to ${email}:`, error.message);
      console.log(` OTP for ${email}: ${otp}`);
      return Promise.resolve(); // Don't crash the app
    }
  }

  async sendWelcomeEmail(email, name) {
    if (!this.transporter) {
      console.log(` [MOCK] Welcome email for ${name} <${email}>`);
      return Promise.resolve();
    }

    try {
      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to Our Platform!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome, ${name}!</h2>
            <p>Your email has been successfully verified.</p>
            <p>Thank you for joining our platform. We're excited to have you on board!</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(` Welcome email sent to ${email}`);
      return info;
    } catch (error) {
      console.error(` Failed to send welcome email to ${email}:`, error.message);
      return Promise.resolve();
    }
  }

  async sendPasswordResetEmail(email, resetLink) {
    if (!this.transporter) {
      console.log(` [MOCK] Reset link for ${email}: ${resetLink}`);
      return Promise.resolve();
    }

    try {
      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <p>
              <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(` Password reset email sent to ${email}`);
      return info;
    } catch (error) {
      console.error(` Failed to send password reset email to ${email}:`, error.message);
      return Promise.resolve();
    }
  }

  async sendPasswordResetSuccessEmail(email) {
    if (!this.transporter) {
      console.log(` [MOCK] Password reset success for ${email}`);
      return Promise.resolve();
    }

    try {
      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>If you did not perform this action, please contact our support team immediately.</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(` Password reset success email sent to ${email}`);
      return info;
    } catch (error) {
      console.error(` Failed to send password reset success email to ${email}:`, error.message);
      return Promise.resolve();
    }
  }
}

export const initMailService = () => {
  console.log(' Initializing mail service...');
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    port: process.env.SMTP_PORT,
    hasPass: !!process.env.SMTP_PASS
  });
  
  if (!mailServiceInstance) {
    mailServiceInstance = new MailService();
  }
  return mailServiceInstance;
};

export const getMailService = () => {
  if (!mailServiceInstance) {
    console.warn(' MailService not initialized, using mock mode');
    return {
      sendVerificationEmail: async (email, otp) => {
        console.log(` [MOCK] OTP for ${email}: ${otp}`);
        return Promise.resolve();
      },
      sendWelcomeEmail: async (email, name) => {
        console.log(` [MOCK] Welcome ${name}`);
        return Promise.resolve();
      },
      sendPasswordResetEmail: async (email, link) => {
        console.log(` [MOCK] Reset link: ${link}`);
        return Promise.resolve();
      },
      sendPasswordResetSuccessEmail: async (email) => {
        console.log(` [MOCK] Reset success for ${email}`);
        return Promise.resolve();
      }
    };
  }
  return mailServiceInstance;
};