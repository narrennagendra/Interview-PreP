const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

const User = require('../models/user');

let log_msg,sign_msg;
exports.getAuthentication = (req, res, next) => {
	res.render('authentication/authentication',{
		log_msg: decodeURIComponent(log_msg),
		sign_msg: decodeURIComponent(sign_msg)
	});
};

exports.postLogin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).redirect('/authenticate');
	}
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await User.findOne({ email: email })
		if (!user) {
			const error_msg = encodeURIComponent('user does not exist');
			log_msg = error_msg;
			return res.redirect(`/authenticate?error=${error_msg}`)
		}
		const domatch = await bcrypt.compare(password, user.password)
		if (domatch) {
			req.session.user = user;
			req.session.save((err) => {
				console.log(err);
				res.redirect('/');
			})
		} else {
			const error_msg = encodeURIComponent('incorrect password');
			log_msg = error_msg
			res.redirect(`/authenticate?msg=${error_msg}`)
		}
	} catch (err) {
		console.log(err);
	}
};

exports.postSignup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).redirect('/authenticate');
	}
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User ({
			name: name,
			email: email,
			password: hashedPassword,
		});
		await user.save();
		const msg = encodeURIComponent('Please enter your credentials');
		sign_msg = msg;
		res.redirect(`/authenticate?msg=${msg}`);
	} catch (err) {
		console.log(err);
	}
};

exports.getLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/authenticate');
	});
};