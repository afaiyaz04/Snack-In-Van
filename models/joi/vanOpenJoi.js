const Joi = require("joi");

// define schema for the post login route
const vanOpenJoi = Joi.object({
	location: Joi.object({
		lat: Joi.number().min(-90).max(90).required(),
		lng: Joi.number().min(-180).max(180).required(),
	}),

	locDescription: Joi.string().max(255).required(),
});

module.exports = vanOpenJoi;
