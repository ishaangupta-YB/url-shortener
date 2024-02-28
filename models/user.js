const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email id already present'],
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiration: Date,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;