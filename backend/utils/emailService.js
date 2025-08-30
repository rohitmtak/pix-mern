import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping email send.');
      console.log('Reset URL for testing:', resetUrl);
      return true; // Return true for testing
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - PIX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PIX</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested a password reset for your PIX account. Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you didn't request this password reset, please ignore this email. The reset link will expire in 1 hour.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #333; word-break: break-all; background-color: #fff; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
          </div>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0;">© 2024 PIX. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send password reset success email
export const sendPasswordResetSuccessEmail = async (email, name) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured. Skipping success email send.');
      return true; // Return true for testing
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful - PIX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PIX</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Successful</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hi ${name},
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your password has been successfully reset. You can now log in to your PIX account with your new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                 style="background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Login to PIX
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you didn't perform this password reset, please contact our support team immediately.
            </p>
          </div>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0;">© 2024 PIX. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    return false;
  }
};
