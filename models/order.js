const mongoose = require("mongoose");
const {
	ORDER_PENDING,
	ORDER_CONFIRMED,
	ORDER_READY,
	ORDER_FULFILLED,
	ORDER_CANCELLED,
} = require("./statusEnums");

// define the LineItem child schema
const lineItemSchema = new mongoose.Schema(
	{
		itemId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
			required: true,
		},
		quantity: { type: Number, default: 1, required: true },
	},
	{ _id: false }
);

// define the Order schema
const orderSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer",
		required: true,
	},
	van: { type: mongoose.Schema.Types.ObjectId, ref: "Van", required: true },
	lineItems: { type: [lineItemSchema], required: true },
	timePlaced: { type: Date, default: Date.now },
	status: {
		type: String,
		enum: [
			ORDER_PENDING,
			ORDER_CONFIRMED,
			ORDER_READY,
			ORDER_FULFILLED,
			ORDER_CANCELLED,
		],
		default: ORDER_PENDING,
		required: true,
	},
	rating: { type: Number, min: 0, max: 5, required: false, default: null },
	feedback: { type: String, required: false, default: null },
});

// compile into Model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
