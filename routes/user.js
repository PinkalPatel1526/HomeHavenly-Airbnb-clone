const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controller/user.js');

// Signup routes
router.get("/signup", userController.renderSignUpForm);

router.post("/signup", userController.signUp);

// Login routes
router.get("/login", userController.renderLoginForm); 

router.post("/login", saveRedirectUrl, 
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), 
    userController.login
);

// Logout route
router.get("/logout", userController.logout);

module.exports = router;
