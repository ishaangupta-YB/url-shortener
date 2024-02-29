const mongoose = require('mongoose');
const validator = require('validator')
require('dotenv').config();

const urlSchema = new mongoose.Schema({
    urlId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                return value.length === 8;
            },
            message: 'urlId must be exactly 8 characters long',
        },
    },
    origUrl: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl: {
        type: String,
        required: true,
        trim: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: String,
        default: Date.now,
    },
    email: {
        type: String,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
});

urlSchema.pre('save', function (next) {
    if (!this.urlId || this.urlId.length !== 8) {
        return next(new Error('urlId must be exactly 8 characters long'));
    }
    next();
});
urlSchema.pre('findOneAndUpdate', function (next) {
    const updatedFields = this._update.$set;
    if (updatedFields && updatedFields.urlId) {
        updatedFields.shortUrl = `${process.env.CLIENT_URL}/${updatedFields.urlId}`;
    }
    next();
});
const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
