const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const path = require("path");
require("dotenv").config();

// HTTP header protection
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				"img-src": [
					"'self'",
					"anima-uploads.s3.amazonaws.com",
					"source.unsplash.com",
					"images.unsplash.com",
					"http://maps.stamen.com/toner/",
					"http://maps.stamen.com/",
				],
			},
		},
	})
);

// cors for communicating with react frontend
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// rate limit setup
const rateLimit = require("express-rate-limit");
app.set("trust proxy", 1);
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5000, // limit each IP to 5000 requests per windowMs
});
app.use("/api/", apiLimiter);

// database models
require("../models");

// passport config
require("../config/passport");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Used to parse JSON bodies, size limited for security
app.use(express.json({ limit: "300kb" }));

// set up routers
const authenticationRouter = require("../routes/authenticationRouter");
const customerRouter = require("../routes/customerRouter");
const vendorRouter = require("../routes/vendorRouter");

// Handle log in requests
// the log in routes are added onto the end of '/'
app.use("/api/auth/", authenticationRouter);

// Handle customer side of app
// the log in routes are added onto the end of '/'
app.use("/api/customer/", customerRouter);

// Handle vendor side of app
// the log in routes are added onto the end of '/'
app.use("/api/vendor/", vendorRouter);

// Serve static frontend files
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));

	app.get("/*", function (req, res) {
		res.sendFile(path.join(__dirname, "../client/build", "index.html"));
	});
}

app.listen(process.env.PORT || 8080, () => {
	console.log("The food truck app is listening on port 8080");
});
