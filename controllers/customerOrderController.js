const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const updateOrderJoi = require("../models/joi/updateOrderJoi");
const feedbackJoi = require("../models/joi/feedbackJoi");

// require models
const Item = mongoose.model("Item");
const Order = mongoose.model("Order");

const {
	ORDER_PENDING,
	ORDER_CONFIRMED,
	ORDER_READY,
	ORDER_FULFILLED,
	ORDER_CANCELLED,
} = require("../models/statusEnums");

// handle request for order information
const getOrder = async (req, res) => {
	try {
		const result = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}

		res.send(result);
	} catch (err) {
		// Not a valid order
		console.log(err.stack);
		res.send(err);
	}
};

// handle request for order status
const getOrderStatus = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}
		res.send(order.status);
	} catch (err) {
		// Not a valid order
		console.log(err.stack);
		res.send(err);
	}
};

// handle GET request for item details when provided an array of lineItems
const getLineItems = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}

		const lineItemObjects = (await order.execPopulate("lineItems.itemId"))
			.lineItems;

		res.send(lineItemObjects);
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// take in:
// OrderdId, CustomerId, VanId, ItemId, Quantity
// if OrderId is null then creates a new order before adding item
const postOrder = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = updateOrderJoi.validate(clean);
		if (error) {
			res.send(error);
		}

		var currentOrder;
		// if there is no order create one and store first item
		if (!value.orderId) {
			currentOrder = new Order({
				customer: value.customer,
				van: value.van,
				lineItems: [
					{
						itemId: value.itemId,
						quantity: value.quantity,
					},
				],
			});
		} else {
			// find existing order
			currentOrder = await Order.findById(value.orderId);
			if (
				!(
					currentOrder.status === ORDER_PENDING ||
					currentOrder.status === ORDER_CONFIRMED
				)
			) {
				return res.send(
					"status must be " + ORDER_PENDING + " or " + ORDER_CONFIRMED
				);
			}

			// Check to see item already has a lineItem
			const index = currentOrder.lineItems.findIndex((lineItem) => {
				return lineItem.itemId == value.itemId;
			});

			// if there is a lineItem update quantity, else add a line item
			if (index != -1) {
				// if we are changing the quantity to zero, delete the lineItem
				if (value.quantity === 0) {
					currentOrder.lineItems.splice(index, 1);
				}
				// else set the new quantity
				else {
					currentOrder.lineItems[parseInt(index)].quantity =
						value.quantity;
				}
			} else {
				currentOrder.lineItems.push({
					itemId: value.itemId,
					quantity: value.quantity,
				});
			}
		}

		// save to database
		currentOrder.save().then((result) => res.send(result));
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// handle delete order route for use cleaning up pending orders
const deleteOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}

		if (order) {
			if (order.status === ORDER_PENDING) {
				order.delete();
				res.status(204).send();
			} else {
				res.send("status must be " + ORDER_PENDING);
			}
		} else {
			res.send("not a valid order");
		}
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// update order status to confirmed
const orderSetConfirmed = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}

		if (order.status === ORDER_PENDING) {
			order.status = ORDER_CONFIRMED;
			order.save().then((result) => res.send(result));
		} else {
			res.send("status must be " + ORDER_PENDING);
		}
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

// update order status to confirmed
const orderSetFeedback = async (req, res) => {
	try {
		// sanitize
		const clean = sanitize(req.body);
		// validate
		const { value, error } = feedbackJoi.validate(clean);
		if (error) {
			res.send(error);
		}

		const order = await Order.findById(req.params.id);
		if (JSON.stringify(req.user._id) !== JSON.stringify(order.customer)) {
			res.send().status(403);
			return;
		}
		if (
			order.status === ORDER_READY ||
			order.status === ORDER_FULFILLED ||
			order.status === ORDER_CANCELLED
		) {
			order.rating = value.rating;
			order.feedback = value.feedback;

			const result = await order.save();
			res.send(result);
		} else {
			console.log("status");
			res.send(
				"status must be " +
					ORDER_READY +
					" or " +
					ORDER_FULFILLED +
					" or " +
					ORDER_CANCELLED
			);
		}
	} catch (err) {
		console.log(err.stack);
		res.send(err);
	}
};

module.exports = {
	getOrder,
	getOrderStatus,
	getLineItems,
	postOrder,
	deleteOrder,
	orderSetConfirmed,
	orderSetFeedback,
};
