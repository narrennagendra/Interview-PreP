const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const MONGODB_URI = require('./util/mondodb-uri');
const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
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

//all the routes will be here

mongoose.connect(MONGODB_URI)
	.then(result => {
		console.log('Connected');
		app.listen(3000);
	})
	.catch(err => console.log(err));
