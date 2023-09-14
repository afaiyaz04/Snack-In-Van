const Joi = require("joi");
const {
	ORDER_READY,
	ORDER_FULFILLED,
	ORDER_CANCELLED,
} = require("../statusEnums");

// define schema for the post register customer
const setStatusJoi = Joi.object({
	newStatus: Joi.string()
		.valid(ORDER_READY, ORDER_FULFILLED, ORDER_CANCELLED)
		.required(),
});

module.exports = setStatusJoi;
