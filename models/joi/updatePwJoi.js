const Joi = require("joi");

// define schema for the post register customer
const updatePwJoi = Joi.object({
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.max(255)
		.required(),

	password2: Joi.string().valid(Joi.ref("password")).max(255).required(),
});

module.exports = updatePwJoi;
