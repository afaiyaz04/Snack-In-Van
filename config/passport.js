const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
require("dotenv").config();
const Customer = mongoose.model("Customer");
const Van = mongoose.model("Van");

// validate customer info against database
var opts = {
	usernameField: "email",
	passwordField: "password",
};
passport.use(
	"localCustomer",
	new LocalStrategy(opts, (email, password, done) => {
		Customer.findOne({ email: email })
			.then((customer) => {
				if (!customer) {
					return done(null, false, {
						customer: null,
						errors: { "email or password": "is invalid" },
					});
				} else if (!customer.validatePassword(password)) {
					return done(null, false, {
						customer: customer,
						errors: { "email or password": "is invalid" },
					});
				}

				return done(null, customer);
			})
			.catch(done);
	})
);

// validate vendor info against database
var opts = {
	usernameField: "name",
	passwordField: "password",
};
passport.use(
	"localVendor",
	new LocalStrategy(opts, (name, password, done) => {
		Van.findOne({ name: name })
			.then((van) => {
				if (!van) {
					return done(null, false, {
						van: null,
						errors: { "name or password": "is invalid" },
					});
				} else if (!van.validatePassword(password)) {
					return done(null, false, {
						van: van,
						errors: { "name or password": "is invalid" },
					});
				}

				return done(null, van);
			})
			.catch(done);
	})
);

// Cookies store jwt provided at login using localstrategy
const cookieExtractor = function (req) {
	let token = null;
	if (req && req.cookies && req.cookies.jwt) {
		token = req.cookies["jwt"];
	}
	return token;
};

// validate user info by jwt
var opts = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		// Check for customer
		Customer.findById(
			jwt_payload.id,
			{ password: false },
			function (err, customer) {
				if (err) {
					return done(err, false);
				}
				if (customer) {
					return done(null, customer);
				} else {
					// If no customer is found check for vendor
					Van.findById(
						jwt_payload.id,
						{ password: false },
						function (err, customer) {
							if (err) {
								return done(err, false);
							}
							if (customer) {
								return done(null, customer);
							} else {
								// if neither is done return noerr, false
								return done(null, false);
							}
						}
					);
				}
			}
		);
	})
);

module.exports = cookieExtractor;
