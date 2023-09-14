const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// define the Customer schema
const customerSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	nameFamily: { type: String, required: true },
	nameGiven: { type: String, required: true },
});

// generate and validate methods from lecture
customerSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

customerSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// JWT generation
customerSchema.methods.generateJWT = function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.ACCESS_TOKEN_SECRET
	);
};

// compile into Model
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
