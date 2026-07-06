const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const templates = {
  welcome: (name) => ({
    subject: 'Welcome to QuickServe!',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center"><h1 style="color:white;margin:0">Welcome to QuickServe!</h1></div><div style="padding:40px;background:white"><h2>Hi ${name}!</h2><p>Thank you for joining QuickServe. Browse and book local services near you.</p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background:#6366f1;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px">Get Started</a></div></div>`,
  }),
  providerApproved: (name) => ({
    subject: 'Provider Application Approved!',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#10b981,#059669);padding:40px;text-align:center"><h1 style="color:white;margin:0">Approved!</h1></div><div style="padding:40px;background:white"><h2>Congratulations, ${name}!</h2><p>Your provider application has been approved. Start receiving bookings now.</p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/provider/dashboard" style="background:#10b981;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px">Go to Dashboard</a></div></div>`,
  }),
  providerRejected: (name, reason) => ({
    subject: 'Provider Application Update',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:40px;text-align:center"><h1 style="color:white;margin:0">Application Update</h1></div><div style="padding:40px;background:white"><h2>Hi ${name},</h2><p>Your provider application was not approved.</p>${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}</div></div>`,
  }),
  bookingConfirmation: (userName, providerName, serviceDate) => ({
    subject: 'Booking Confirmed',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center"><h1 style="color:white;margin:0">Booking Confirmed!</h1></div><div style="padding:40px;background:white"><h2>Hi ${userName}!</h2><p>Booking with <strong>${providerName}</strong> confirmed for ${new Date(serviceDate).toLocaleDateString()}.</p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/bookings" style="background:#6366f1;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px">View Booking</a></div></div>`,
  }),
  bookingCancelled: (userName, reason) => ({
    subject: 'Booking Cancelled',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:40px;text-align:center"><h1 style="color:white;margin:0">Booking Cancelled</h1></div><div style="padding:40px;background:white"><h2>Hi ${userName},</h2><p>Your booking has been cancelled.</p>${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}</div></div>`,
  }),
  bookingCompleted: (userName, providerName) => ({
    subject: 'Service Completed - Leave a Review!',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#10b981,#059669);padding:40px;text-align:center"><h1 style="color:white;margin:0">Service Completed!</h1></div><div style="padding:40px;background:white"><h2>Hi ${userName}!</h2><p>Service with <strong>${providerName}</strong> completed. Share your feedback!</p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/bookings" style="background:#10b981;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px">Leave a Review</a></div></div>`,
  }),
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px;text-align:center"><h1 style="color:white;margin:0">Reset Password</h1></div><div style="padding:40px;background:white"><h2>Hi ${name},</h2><p>You requested a password reset. This link expires in 10 minutes.</p><a href="${resetUrl}" style="background:#6366f1;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:20px">Reset Password</a><p style="color:#999;font-size:12px;margin-top:20px">If you did not request this, ignore this email.</p></div></div>`,
  }),
};

const sendEmail = async ({ to, template, data }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('[Email] Not configured - skipping');
      return;
    }
    const transporter = createTransporter();
    const { subject, html } = templates[template](...data);
    await transporter.sendMail({
      from: `"QuickServe" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}`);
  } catch (error) {
    console.error('[Email] Error:', error.message);
  }
};

module.exports = { sendEmail };
