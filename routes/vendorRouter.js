const express = require("express");
const passport = require("passport");

// add router
const vendorRouter = express.Router();

// require the vendor controller
const vendorController = require("../controllers/vendorController.js");

// handle GET request for vanlist
vendorRouter.get("/vans/", vendorController.getVanList);

// handle GET request for individual van
vendorRouter.get("/vans/:id", vendorController.getVan);

// handle request for vendor to view that vendors orders at provided STATUS
vendorRouter.post(
	"/orders/status/get/:id/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
			res.send().status(403);
			return;
		}
		vendorController.getAtStatus(req, res);
	}
);

// handle POST request to change order status to READY, FULFILLED, or CANCELLED
vendorRouter.post(
	"/orders/status/set/:id/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		vendorController.setStatus(req, res);
	}
);

// handle POST request to set OPEN status and update location/description
vendorRouter.post("/business/open/:id", vendorController.vanOpen);

// handle POST request to set CLOSED
vendorRouter.post(
	"/business/close/:id",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
			res.send().status(403);
			return;
		}
		vendorController.vanClose(req, res);
	}
);

// export the router
module.exports = vendorRouter;
