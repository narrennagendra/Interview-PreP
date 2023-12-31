const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const User = require('./models/user');

const MONGODB_URI = require('./util/mondodb-uri');

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'kajblBSkjsdbhackasvdjkccjhdcbhjebwjhbcjhbsacajksbdkcjbksajd',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(flash());

app.use(async (req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	try {
		const user = await User.findById(req.session.user._id)
		if (!user) {
			return next();
		}
		req.user = user;
		next();
	} catch (err) {
		console.log(err);
	}
});

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

app.use(indexRoutes)
app.use(authRoutes);

mongoose.connect(MONGODB_URI)
	.then(result => {
		console.log('Connected');
		app.listen(3000);
	})
	.catch(err => console.log(err));
