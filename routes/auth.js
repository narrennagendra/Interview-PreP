const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');
const User = require('../models/user');

const router = express.Router();

router.get('/authenticate', authController.getAuthentication);

router.post('/login',
	[
		body('email', 'please enter a valid email')
			.trim()
			.isEmail()
			.withMessage('Please enter valid email')
			.normalizeEmail()
			.escape(),
		body('password', 'Enter a valid password')
			.trim()
			.isLength({ min: 4 })

	],
	authController.postLogin);

router.post('/signup',
	[
		body('email')
			.trim()
			.isEmail()
			.withMessage('Enter valid email')
			.custom((value, { req }) => {
				return User.findOne({ email: value })
					.then(user => {
						if (user) {
							return Promise.reject('Email already exist');
						}
					});
			})
			.escape()
			.normalizeEmail(),
		body('password', 'password must be of at least 4 characters')
			.trim()
			.isLength({ min: 4 })
			.escape()
	],
	authController.postSignup);

router.get('/logout', isAuth, authController.getLogout);

module.exports = router;