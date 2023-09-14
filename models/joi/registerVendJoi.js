const Joi = require("joi");

// For populating database
const registerVendJoi = Joi.object({
	name: Joi.string().max(255).required(),

	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.max(255)
		.required(),

	password2: Joi.string().valid(Joi.ref("password")).max(255).required(),
});

module.exports = registerVendJoi;
