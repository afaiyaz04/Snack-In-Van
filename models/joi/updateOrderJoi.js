const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// define schema for the post login route
const updateOrderJoi = Joi.object({
	orderId: Joi.objectId(),

	customer: Joi.object({
		_id: Joi.objectId(),

		email: Joi.string()
			.email({
				minDomainSegments: 2,
			})
			.max(254),
		nameGiven: Joi.string().max(255),

		nameFamily: Joi.string().max(255),

		__v: Joi.number(),
	}).required(),

	van: Joi.object({
		status: Joi.string().max(255),

		location: Joi.object({
			lat: Joi.number().min(-90).max(90).required(),
			lng: Joi.number().min(-180).max(180).required(),
		}),

		locDescription: Joi.string().max(255),

		_id: Joi.objectId(),

		name: Joi.string().max(255),

		__v: Joi.number(),
	}).required(),

	itemId: Joi.objectId().required(),

	quantity: Joi.number().integer().min(0).required(),
});

module.exports = updateOrderJoi;
