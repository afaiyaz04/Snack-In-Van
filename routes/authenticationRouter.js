const express = require("express");
const passport = require("passport");

// add our router
const authenticationRouter = express.Router();

// require the authentication controller
const authenticationController = require("../controllers/authenticationController.js");

// handle the Post request post login customer
authenticationRouter.post(
	"/login/customer/",
	authenticationController.postCustLogin
);

// handle POST request for register customer
authenticationRouter.post(
	"/register/customer/",
	authenticationController.postCustRegister
);

// handle POST to update customer password
authenticationRouter.post(
	"/update/customer/:id",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
			res.send().status(403);
			return;
		}
		authenticationController.updatePw(req, res);
	}
);

// handle the Post request post login vendor
authenticationRouter.post(
	"/login/vendor/",
	authenticationController.postVendLogin
);

// handle POST request for register vendor
// Used by admin to populate van collection, while hashing passwords
authenticationRouter.post(
	"/register/vendor/",
	authenticationController.postVendRegister
);

// get current user if client is authenticated
authenticationRouter.get(
	"/current/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		authenticationController.getCurrentUser(req, res);
	}
);

// get a null jwt to replace the logged in user's jwt in browser
authenticationRouter.post(
	"/logout/",
	passport.authenticate("jwt", { session: false }),
	function (req, res) {
		authenticationController.postLogout(req, res);
	}
);

// export the router
module.exports = authenticationRouter;
