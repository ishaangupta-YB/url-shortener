const express = require('express')
const { nanoid } = require('nanoid');
const urlModel = require('../models/urlModel')
require('dotenv').config();


function validateUrl(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url.trim());
}


exports.shorten = async (req, res) => {
    const { originalURL, expiryDate, shortcode } = req.body;
    const urlId = shortcode || nanoid(8);
    const base = process.env.CLIENT_URL

    if (validateUrl(originalURL)) {
        try {
            const currentUser = req.user
            if (urlId && urlId.length === 8) {
                const checkurlId = await urlModel.findOne({ urlId: urlId })
                if (checkurlId) return res.status(501).json({ msg: 'Try another shortcode' });
            } else return res.status(501).json({ msg: 'Try another shortcode' });
            let url = await urlModel.findOne({ origUrl: originalURL, email: currentUser })

            if (url) {
                return res.status(200).json(url)
            } else {
                const shortUrl = `${base}/${urlId}`
                const expiresAt = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 24 * 60 * 60 * 1000);

                url = new urlModel({
                    urlId: urlId,
                    origUrl: originalURL,
                    shortUrl: shortUrl,
                    clicks: 0,
                    date: new Date(),
                    email: currentUser,
                    expiresAt: expiresAt,
                });
                await url.save();
                res.status(201).json(url)
            }
        } catch (err) {
            console.log(err)
            res.status(201).json({ error: err })
        }
    } else {
        res.status(400).json(undefined);
    }
};

exports.urlId = async (req, res) => {
    try {
        const urlId = req.params.urlId
        if (!urlId || urlId.length !== 8) return res.redirect(url.origUrl)
        const url = await urlModel.findOneAndUpdate(
            { urlId: urlId },
            { $inc: { clicks: 1 } },
            { new: true }
        );
        if (url) {
            return res.redirect(url.origUrl)
        } else {
            res.status(404).redirect('/')
        }
    } catch (err) {
        res.status(404).json('Server error')
    }
}

exports.getData = async (req, res) => {
    try {
        const currentUser = req.user
        const data = await urlModel.find({ email: currentUser });
        if (data) {
            return res.status(200).json({ data: data })
        } else {
            return res.status(404).json({ error: 'empty' })
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
};


exports.deleteLink = async (req, res) => {
    try {
        const { shortUrl } = req.body;
        const currentUser = req.user
        const deletedUrl = await urlModel.findOneAndDelete({ email: currentUser, shortUrl: shortUrl });
        if (deletedUrl) {
            return res.status(200).json({ msg: 'deleted successfully' })
        } else {
            return res.status(404).json({ error: 'URL not found!' })
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
};

exports.edit = async (req, res) => {
    try {
        const currentUser = req.user
        const { originalshortCode, shortCode, expiryDate } = req.body;

        if (!shortCode && !expiryDate) return res.status(200).json({ msg: 'nothing to update' })
        
        const data = await urlModel.findOne({ urlId: originalshortCode, email: currentUser });
        if(!data) return res.status(404).json({ error: 'URL not found!' })
        
        if (shortCode && shortCode.length !== 8) return res.status(401).json({ error: 'invaid shortcode' })

        const updatedData = await urlModel.findOneAndUpdate(
            { urlId: originalshortCode, email: currentUser },
            {
                $set: {
                    urlId: shortCode || data.urlId,
                    expiresAt: expiryDate || data.expiresAt
                }
            },
            { new: true }
        );

        if (updatedData) {
            return res.status(200).json({ msg: 'Updated Successfully' })
        } else {
            return res.status(404).json({ error: 'URL not found!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' })
    }
};
exports.dashboard = async (req, res) => {
    res.render('dashboard');
};
