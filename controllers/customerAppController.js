const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const updateNamesJoi = require("../models/joi/updateNamesJoi");

// require models
const Item = mongoose.model("Item");
const Customer = mongoose.model("Customer");

// handle post request to update nameGiven and nameFamily
const updateNames = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = updateNamesJoi.validate(clean);
		if (error) throw error;

		const customer = await Customer.findById(req.params.id);
		customer.nameGiven = value.nameGiven;
		customer.nameFamily = value.nameFamily;

		result = await customer.save();
		res.send(result.id);
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// handle request for customer's menu page
const getMenu = async (req, res) => {
	try {
		const result = await Item.find({}, {});
		res.send(result);
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// handle request for menu item details
const getItem = async (req, res) => {
	try {
		const result = await Item.findById(req.params.id);
		res.send(result);
	} catch (err) {
		// Not a valid item
		console.log(err.stack);
		res.send(err);
	}
};

module.exports = {
	updateNames,
	getMenu,
	getItem,
};
