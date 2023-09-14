const express = require("express");
const passport = require("passport");

// add our router
const customerRouter = express.Router();

// require the customer controller
const customerAppController = require("../controllers/customerAppController.js");
const customerOrderController = require("../controllers/customerOrderController.js");

// handle post request to update customer names
customerRouter.post(
	"/update/:id",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
			res.send().status(403);
			return;
		}
		customerAppController.updateNames(req, res);
	}
);

// handle GET request for menu page
customerRouter.get("/menu/", customerAppController.getMenu);

// handle GET request for menu item details
customerRouter.get("/menu/item/:id/", customerAppController.getItem);

// handle POST request for customer order creation
customerRouter.post(
	"/order/update/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.postOrder(req, res);
	}
);

// handle GET request for customer's order summary
customerRouter.get(
	"/order/:id/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.getOrder(req, res);
	}
);

// handle GET request for customer's order status
customerRouter.get(
	"/order/:id/status/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.getOrderStatus(req, res);
	}
);

// handle GET request for item details when provided an array of lineItems
customerRouter.get(
	"/order/:id/lineitems/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.getLineItems(req, res);
	}
);

// handle DELETE request for order
customerRouter.delete(
	"/order/:id/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.deleteOrder(req, res);
	}
);

// handle post request to set order status as confirmed
customerRouter.post(
	"/order/:id/confirm/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.orderSetConfirmed(req, res);
	}
);

// handle post request to set order status as confirmed
customerRouter.post(
	"/order/:id/feedback/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		customerOrderController.orderSetFeedback(req, res);
	}
);

// export the router
module.exports = customerRouter;
