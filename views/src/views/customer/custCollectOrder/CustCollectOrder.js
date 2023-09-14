import React, { Component } from "react";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

// components
import Header from "../../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APIsetFeedback } from "../../../app/apiCalls";

class CustCollectOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rating: 2,
			value: "",
			order: this.props.order,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleSubmit.bind(this);
		this.handleRatingChange = this.handleRatingChange.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}
	// Changing the rating
	handleRatingChange(event) {
		this.setState({ rating: event.target.value });
	}

	handleSubmit() {
		APIsetFeedback(
			this.props.order._id,
			this.state.rating,
			this.state.value
		);
		this.props.history.push("/");
	}

	render() {
		// Don't render until API response has been recieved

		const handleFinishClick = () => {
			this.props.history.push("/");
		};

		return (
			<div className="container-center-horizontal">
				<div className="container-center-vertical">
					<Header backButtonAction={this.props.history.goBack} />
					<div className="cust-order-collect__heading heading">
						Your Order is ready for pickup!
					</div>
					<div className="cust-order-collect__subheading subheading">
						Thankyou for ordering with us! <br />
						We&#x27;d really appreciate if you could tell us about
						your experience.
					</div>
					<div className="cust-order-collect__ratings-container flex-row">
						<SimpleRating
							rating={this.state.rating}
							updateRating={this.handleRatingChange}
						/>
					</div>
					<div className="cust-order-collect__form-container">
						<form
							className="cust-order-collect__form flex-column"
							onSubmit={this.handleFormSubmit}
						>
							<label className="cust-order-collect__label heading">
								Please give us your feedback!
							</label>
							<input
								className="cust-order-collect__text-area"
								name="cust-feedback"
								placeholder="Enter.."
								value={this.state.value}
								onChange={this.handleChange}
							/>
							<div
								id="collect__bottom-buttons"
								className="bottom-buttons margin-top flex-row"
							>
								<div
									className="medium-button flex-row"
									onClick={() => handleFinishClick()}
								>
									<div className="medium-button__back-icon">
										<FontAwesomeIcon icon="chevron-left" />
									</div>
									<div className="heading">Finish</div>
								</div>
								<button
									className="medium-button flex-row"
									type="submit"
								>
									<div className="heading">Submit</div>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(CustCollectOrder);

const StyledRating = withStyles({
	iconFilled: {
		color: "#ff7154",
	},
	iconHover: {
		color: "#e96045",
	},
})(Rating);

// source https://codesandbox.io/s/evp1k?file=/demo.js:417-582
function SimpleRating(props) {
	const rating = props.rating;
	const updateRating = props.updateRating;

	return (
		<Box component="fieldset" mb={3} borderColor="transparent">
			<StyledRating
				size="large"
				name="simple-controlled"
				value={rating}
				onChange={(event) => {
					updateRating(event);
				}}
			/>
		</Box>
	);
}
