const Joi = require("joi");

// define schema for the post login cust route
const loginCustJoi = Joi.object({
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
});

module.exports = loginCustJoi;
