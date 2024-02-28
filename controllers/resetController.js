const jwt = require('jsonwebtoken'); 
const User = require('../models/user');
const nodemailer = require("nodemailer");
const config = require('../config/config');


const transporter = nodemailer.createTransport({
  service: "your-email-service-provider",
  auth: {
    user: "your-email@example.com",
    pass: "your-email-password",
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${config.clientURL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: "your-email@example.com",
    to: email,
    subject: "Password Reset",
    html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

exports.renderResetPasswordPage = async (req, res) => {
  const resetToken = req.params.resetToken;

  let decodedToken;
  try {
    decodedToken = jwt.verify(resetToken, config.jwtSecret);
    if (!decodedToken || !decodedToken.userId || decodedToken.exp < Date.now() / 1000) {
      return res.status(400).json({ error: "Expired reset token" });
    }

    const user = await User.findOne({ _id: decodedToken.userId, resetToken });
    if (!user) {   
      return res.status(404).json({ error: "Invalid reset token" });
    }
    return res.status(200).render('reset-password');

  } catch (tokenError) {
    return res.status(400).json({ error: "Invalid reset token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    let decodedToken;
    try {
      decodedToken = jwt.verify(resetToken, config.jwtSecret);
    } catch (tokenError) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    if (!decodedToken || !decodedToken.userId || decodedToken.exp < Date.now() / 1000) {
      return res.status(400).json({ error: "Expired reset token" });
    }
    const user = await User.findOne({ _id: decodedToken.userId, resetToken });
    if (!user) {
      return res.status(404).json({ error: "User not found or invalid reset token" });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};