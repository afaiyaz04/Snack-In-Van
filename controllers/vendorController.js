const mongoose = require("mongoose");
const vanOpenJoi = require("../models/joi/vanOpenJoi");
const setStatusJoi = require("../models/joi/setStatusJoi");
const getAtStatusJoi = require("../models/joi/getAtStatusJoi");

const sanitize = require("mongo-sanitize");

const Van = mongoose.model("Van");
const Order = mongoose.model("Order");

const {
	ORDER_PENDING,
	ORDER_CONFIRMED,
	ORDER_READY,
	ORDER_FULFILLED,
	ORDER_CANCELLED,
	ORDER_PAST,
	VAN_OPEN,
	VAN_CLOSED,
} = require("../models/statusEnums");

// handle request for a list of all vans that are OPEN
const getVanList = async (req, res) => {
	try {
		const result = await Van.find({ status: VAN_OPEN }, "-password");
		if (result === null) throw err;
		res.send(result);
	} catch (err) {
		res.send(err);
		console.log(err.stack);
	}
};

// handle request for vans's details
const getVan = async (req, res) => {
	try {
		const result = await Van.findById(req.params.id, "-password");
		if (result === null) throw err;
		res.send(result);
	} catch (err) {
		res.send(err);
		// Not a valid Van
		console.log(err.stack);
	}
};

// handle request for vendor to view current orders at provided status
const getAtStatus = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = getAtStatusJoi.validate(clean);
		if (error) throw error;
		var getStatus = value.getStatus;

		if (getStatus === ORDER_PAST) {
			getStatus = [ORDER_FULFILLED, ORDER_CANCELLED];
		}

		const result = await Order.find({
			van: req.params.id,
			status: getStatus,
		})
			.populate("lineItems.itemId")
			.populate("customer", "nameGiven nameFamily")
			.exec();
		res.send(result);
	} catch (err) {
		res.send(err);
		console.log(err.stack);
	}
};

// Change order status, if already at prerequisite status
const setStatus = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = setStatusJoi.validate(clean);
		if (error) throw error;
		const newStatus = value.newStatus;

		const result = await Order.findById(req.params.id);

		// vendor can only edit their own order
		if (JSON.stringify(req.user._id) !== JSON.stringify(result.van)) {
			res.send().status(403);
			return;
		}

		if (result) {
			switch (newStatus) {
				case ORDER_READY:
					if (result.status === ORDER_CONFIRMED) {
						result.status = ORDER_READY;
						result.save().then((result) => res.send(result));
					} else {
						res.send("status must be " + ORDER_CONFIRMED);
					}
					break;
				case ORDER_FULFILLED:
					if (result.status === ORDER_READY) {
						result.status = ORDER_FULFILLED;
						result.save().then((result) => res.send(result));
					} else {
						res.send("status must be " + ORDER_READY);
					}
					break;
				case ORDER_CANCELLED:
					if (
						result.status === ORDER_CONFIRMED ||
						result.status === ORDER_READY
					) {
						result.status = ORDER_CANCELLED;
						result.save().then((result) => res.send(result));
					} else {
						res.send(
							"status must be " +
								ORDER_CONFIRMED +
								" or " +
								ORDER_READY
						);
					}
					break;
			}
		} else {
			res.send("not a valid order");
		}
	} catch (err) {
		res.send(err);
		// Not a valid order, or order status not outstanding
		console.log(err.stack);
	}
};

// Post van location and description to database, and set van status to OPEN
const vanOpen = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = vanOpenJoi.validate(clean);
		if (error) throw error;

		// find van by ID
		const van = await Van.findById(req.params.id);

		// set new location and description
		van.location = value.location;
		van.locDescription = value.locDescription;
		van.status = VAN_OPEN;

		result = await van.save();
		res.send(result);
	} catch (err) {
		res.send(err);
		console.log(err.stack);
	}
};

const vanClose = async (req, res) => {
	try {
		// find van by ID
		const van = await Van.findById(req.params.id);

		// set status
		van.location = null;
		van.locDescription = null;
		van.status = VAN_CLOSED;

		// set all orders not at FULFILLED for that van to CANCELLED
		Order.updateMany(
			{
				van: van._id,
				status: [ORDER_PENDING, ORDER_CONFIRMED, ORDER_READY],
			},
			{ status: ORDER_CANCELLED }
		);

		result = await van.save();
		res.send(result);
	} catch (err) {
		res.send(err);
		console.log(err.stack);
	}
};

module.exports = {
	getVan,
	getVanList,
	getAtStatus,
	setStatus,
	vanOpen,
	vanClose,
};
