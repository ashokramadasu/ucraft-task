'use strict'

const publish = require('./publish'),
    User = require('../models/user');

module.exports = function (app, passport) {

    // Publish Messages routes ================================================================
    // list messages api
    app.get('/publish/:page', publish.getMessages);

    // publish messages api
    app.post('/publish', publish.postMessages);

    // User Registration routes ===============================================================

    // show the home page (will also have our login link)
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', async function (req, res) {
        await User.update({ _id : req.user._id }, { isActive: false});
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
};

// route middleware to ensure user is logged in
async function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        await User.update({ _id : req.user._id }, { isActive: true});
        return next();
    }
    res.redirect('/');
}
