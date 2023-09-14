const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { VAN_OPEN, VAN_CLOSED } = require("./statusEnums");

// define the location child schema
const location = new mongoose.Schema(
	{
		lat: { type: Number, min: -90, max: 90, required: true },
		lng: { type: Number, min: -180, max: 180, required: true },
	},
	{ _id: false }
);

// define the Van schema
const vanSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	status: {
		type: String,
		enum: [VAN_OPEN, VAN_CLOSED],
		default: VAN_CLOSED,
		required: true,
	},
	location: { type: location, default: null },
	locDescription: { type: String, default: null },
});

// generate and validate methods from lecture
vanSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

vanSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// JWT generation
vanSchema.methods.generateJWT = function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.ACCESS_TOKEN_SECRET
	);
};

// compile into Model
const Van = mongoose.model("Van", vanSchema);

module.exports = Van;
