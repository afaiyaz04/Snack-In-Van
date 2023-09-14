const mongoose = require("mongoose");
const passport = require("passport");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const sanitize = require("mongo-sanitize");
const loginCustJoi = require("../models/joi/loginCustJoi");
const registerCustJoi = require("../models/joi/registerCustJoi");
const updatePwJoi = require("../models/joi/updatePwJoi");
const loginVendJoi = require("../models/joi/loginVendJoi");
const registerVendJoi = require("../models/joi/registerVendJoi");
const redisClient = require("../config/redisClient");

// require models
const Customer = mongoose.model("Customer");
const Van = mongoose.model("Van");

const cookieExtractor = require("../config/passport");

const BLACKLISTKEY = "tokenBlacklist";

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "login_fail_ip_per_day",
	points: maxWrongAttemptsByIPperDay,
	duration: 60 * 60 * 24,
	blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "login_fail_consecutive_username_and_ip",
	points: maxConsecutiveFailsByUsernameAndIP,
	duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
	blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

// Authenticates a email and password via the local strategy, then responds with a JWT session marker
// bruteforce protection sourced from:
// https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection
const postCustLogin = async (req, res, next) => {
	const ipAddr = req.ip;

	// sanitize
	const clean = sanitize(req.body);
	// validate
	const { value, error } = loginCustJoi.validate(clean);
	if (error) {
		res.send(error);
	}

	const usernameIPkey = getUsernameIPkey(value.email, ipAddr);
	const customer = value;

	const [resUsernameAndIP, resSlowByIP] = await Promise.all([
		limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
		limiterSlowBruteByIP.get(ipAddr),
	]);

	let retrySecs = 0;

	// Check if IP or Username + IP is already blocked
	if (
		resSlowByIP !== null &&
		resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
	) {
		retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
	} else if (
		resUsernameAndIP !== null &&
		resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
	) {
		retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
	}

	if (retrySecs > 0) {
		res.set("Retry-After", String(retrySecs));
		res.status(429).send("Too Many Requests");
	} else {
		// return an HTTP only cookie that stores a jwt token used for validation
		passport.authenticate(
			"localCustomer",
			{ session: false },
			async (err, passportCustomer, info) => {
				if (err) {
					return res.status(401).json(err);
				}
				if (passportCustomer) {
					token = passportCustomer.generateJWT();

					if (
						resUsernameAndIP !== null &&
						resUsernameAndIP.consumedPoints > 0
					) {
						// Reset login limit successful authorisation
						await limiterConsecutiveFailsByUsernameAndIP.delete(
							usernameIPkey
						);
					}

					return res
						.cookie("jwt", token, { httpOnly: true })
						.status(200)
						.json("authorised");
				}

				try {
					const promises = [limiterSlowBruteByIP.consume(ipAddr)];
					if (info.customer) {
						// Count failed attempts by Username + IP only for registered users
						promises.push(
							limiterConsecutiveFailsByUsernameAndIP.consume(
								usernameIPkey
							)
						);
					}

					await Promise.all(promises);

					return res.status(401).json(info);
				} catch (rlRejected) {
					if (rlRejected instanceof Error) {
						throw rlRejected;
					} else {
						res.set(
							"Retry-After",
							String(
								Math.round(rlRejected.msBeforeNext / 1000)
							) || 1
						);
						res.status(429).send("Too Many Requests");
					}
				}
			}
		)(req, res, next);
	}
};

// Registers a email and password then responds with a JWT session marker
const postCustRegister = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = registerCustJoi.validate(clean);
		if (error) {
			res.send(error);
		}
		const customer = value;

		const newCustomer = new Customer({
			email: customer.email,
			password: null,
			nameFamily: customer.nameFamily,
			nameGiven: customer.nameGiven,
		});

		newCustomer.password = newCustomer.generateHash(customer.password);

		result = await newCustomer.save();
		res.send({ customer: result._id });
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// handle post request to update password
const updatePw = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = updatePwJoi.validate(clean);
		if (error) {
			res.send(error);
		}
		console.log(value);
		const customer = await Customer.findById(req.params.id);

		customer.password = customer.generateHash(value.password2);

		result = await customer.save();
		res.send(result._id);
	} catch (err) {
		console.log(err.stack);
	}
};

// Authenticates a email and password via the local strategy, then responds with a JWT session marker
// bruteforce protection sourced from:
// https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection
const postVendLogin = async (req, res, next) => {
	const ipAddr = req.ip;

	// sanitize
	const clean = sanitize(req.body);
	// validate
	const { value, error } = loginVendJoi.validate(clean);
	if (error) {
		res.send(error);
	}

	const usernameIPkey = getUsernameIPkey(value.email, ipAddr);

	const [resUsernameAndIP, resSlowByIP] = await Promise.all([
		limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
		limiterSlowBruteByIP.get(ipAddr),
	]);

	let retrySecs = 0;

	// Check if IP or Username + IP is already blocked
	if (
		resSlowByIP !== null &&
		resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
	) {
		retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
	} else if (
		resUsernameAndIP !== null &&
		resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
	) {
		retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
	}

	if (retrySecs > 0) {
		res.set("Retry-After", String(retrySecs));
		res.status(429).send("Too Many Requests");
	} else {
		// return an HTTP only cookie that stores a jwt token used for validation
		passport.authenticate(
			"localVendor",
			{ session: false },
			async (err, passportVendor, info) => {
				if (err) {
					return res.status(401).json(err);
				}
				if (passportVendor) {
					token = passportVendor.generateJWT();

					if (
						resUsernameAndIP !== null &&
						resUsernameAndIP.consumedPoints > 0
					) {
						// Reset login limit successful authorisation
						await limiterConsecutiveFailsByUsernameAndIP.delete(
							usernameIPkey
						);
					}

					return res
						.cookie("jwt", token, { httpOnly: true })
						.status(200)
						.json("authorised");
				}

				try {
					const promises = [limiterSlowBruteByIP.consume(ipAddr)];
					if (info.customer) {
						// Count failed attempts by Username + IP only for registered users
						promises.push(
							limiterConsecutiveFailsByUsernameAndIP.consume(
								usernameIPkey
							)
						);
					}

					await Promise.all(promises);

					return res.status(401).json(info);
				} catch (rlRejected) {
					if (rlRejected instanceof Error) {
						throw rlRejected;
					} else {
						res.set(
							"Retry-After",
							String(
								Math.round(rlRejected.msBeforeNext / 1000)
							) || 1
						);
						res.status(429).send("Too Many Requests");
					}
				}
			}
		)(req, res, next);
	}
};

// Register van method for populating database, with company vans while retaining
// password hash capabilities
const postVendRegister = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = registerVendJoi.validate(clean);
		if (error) {
			res.send(error);
		}
		const van = value;

		if (van.password !== van.password2) {
			throw err;
		}

		const newVan = new Van({
			name: van.name,
			password: null,
		});

		newVan.password = newVan.generateHash(van.password);

		result = await newVan.save();
		res.send({ van: result._id });
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// Queries database for user id from JWT that is sent in req header
const getCurrentUser = async (req, res) => {
	try {
		const tokenId = cookieExtractor(req);
		// check for blacklisted token
		await redisClient.lrange(BLACKLISTKEY, 0, -1, (err, reply) => {
			if (err) throw err;
			if (reply.includes(tokenId)) {
				res.send("invalid token");
			} else {
				res.send(req.user);
			}
		});
	} catch (err) {
		console.log(err);
		res.send(err);
	}
};

// Logs out user
const postLogout = async (req, res) => {
	try {
		const token = await cookieExtractor(req);
		// add token to blacklist
		await redisClient.rpush(BLACKLISTKEY, token);

		res.cookie("jwt", "none", {
			// Set token to none and expire after 5 seconds
			expires: new Date(Date.now() + 5 * 1000),
		})
			.status(200)
			.json({ success: true, message: "User logged out successfully" });
	} catch (err) {
		res.send(err);
	}
};

module.exports = {
	postCustLogin,
	postCustRegister,
	updatePw,
	postVendLogin,
	postVendRegister,
	getCurrentUser,
	postLogout,
};
