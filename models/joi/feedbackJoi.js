const Joi = require("joi");

// define schema for the post register customer
const nameUpdateJoi = Joi.object({
	rating: Joi.number().integer().min(0).max(5).required(),

	feedback: Joi.string().max(1024).required(),
});

module.exports = nameUpdateJoi;
