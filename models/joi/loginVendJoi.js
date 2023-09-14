const Joi = require("joi");

// define schema for the post login vend route
const loginVendJoi = Joi.object({
	name: Joi.string().required().max(255),

	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.max(255)
		.required(),
});

module.exports = loginVendJoi;
