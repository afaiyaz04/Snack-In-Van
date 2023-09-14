const Joi = require("joi");

// define schema for the post register customer
const registerCustJoi = Joi.object({
	email: Joi.string()
		.email({
			minDomainSegments: 2,
		})
		.max(254)
		.required(),

	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
		.max(255)
		.required(),

	password2: Joi.string().valid(Joi.ref("password")).max(255).required(),

	nameGiven: Joi.string().max(255).required(),

	nameFamily: Joi.string().max(255).required(),
});

module.exports = registerCustJoi;
