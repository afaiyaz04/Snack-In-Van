const Joi = require("joi");

// define schema for the post updateNames
const updateNamesJoi = Joi.object({
	nameGiven: Joi.string().required().max(255),

	nameFamily: Joi.string().required().max(255),
});

module.exports = updateNamesJoi;
