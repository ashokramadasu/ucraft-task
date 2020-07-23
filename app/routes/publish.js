'use strict'
const Messages = require('../models/messages'),
    User = require('../models/user');

async function getMessages(req, res) {
    try {
        let perPage = 9
        let page = req.params.page || 1;
        let users = await User.find({ isActive: true });
        let messages = await Messages.find({ user_id: users })
            .skip((perPage * page) - perPage)
            .limit(perPage).sort({ createdAt: -1 });

        let count = await Messages.countDocuments({
            user_id: users
        });

        return res.render('publish', {
            messages,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } catch (err) { console.error(err); return res.status(500).json(err); }
};

async function postMessages(req, res) {
    try {
        console.log('req', req.user, 'body', req.body);
        let result = await Messages.create(
            {
                message: req.body.message,
                user_id: req.user._id,
                username: req.user.username,
                createdAt: new Date()
            });
        // return res.status(200).json(result);
        return res.redirect('/publish/1')
    } catch (err) { console.error(err); return res.status(500).json(err); }
};

module.exports = {
    getMessages,
    postMessages
}