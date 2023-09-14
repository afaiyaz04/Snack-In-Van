const Joi = require("joi");
const { ORDER_READY, ORDER_CONFIRMED, ORDER_PAST } = require("../statusEnums");

// define schema for the post register customer
const getAtStatusJoi = Joi.object({
	getStatus: Joi.string()
		.valid(ORDER_READY, ORDER_CONFIRMED, ORDER_PAST)
		.required(),
});

module.exports = getAtStatusJoi;
