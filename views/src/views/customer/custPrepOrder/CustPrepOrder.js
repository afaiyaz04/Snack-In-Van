import { React, Component } from "react";
import { Link } from "react-router-dom";
import { throttle } from "lodash";
import {
	getTotalQuantity,
	getTotalPrice,
	millisToMinutesAndSeconds,
} from "../../../app/helperFunctions";

// axios for API access
import axios from "axios";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import Header from "../../../components/header/Header";
import ListItem from "../../../components/listItem/ListItem";
import { API_CUSTOMER, ORDER, LINEITEMS, SLASH } from "../../../app/urlConfig";
import {
	DISCOUNT_TIME,
	EDIT_TIME,
	ORDER_READY,
} from "../../../app/statusEnums";
import { APIcheckOrderStatus } from "../../../app/apiCalls";

class CustPrepOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lineItemObjects: null,
			totalPrice: null,
			totalQuantity: null,
			timeRemaining: null,
		};
		this.showDate = this.showDate.bind(this);
		this.throttledCheckStatus = throttle(this.checkStatus, 2000);
	}

	checkStatus = async () => {
		console.log("checking status");
		const order = this.props.order;
		const status = await APIcheckOrderStatus(order._id);
		console.log(status);
		if (status === ORDER_READY) {
			order.status = ORDER_READY;
			this.props.history.push("/order/collect");
		}
	};

	showDate = async () => {};

	// Query API
	componentDidMount = async () => {
		// get the objects in the order for rendering
		if (this.props.customer == null) {
			this.props.history.push("/login/");
		}
		try {
			await this.throttledCheckStatus();
			// set timer
			this.interval = setInterval(() => {
				const timePlaced = Date.parse(this.props.timer);
				const timeCurr = Date.now();
				const timeRemaining = DISCOUNT_TIME - (timeCurr - timePlaced);

				if (timeRemaining > 0) {
					this.setState({
						timePlaced: timePlaced,
						timeRemaining: DISCOUNT_TIME - (timeCurr - timePlaced),
					});
				} else {
					this.setState({
						timePlaced: timePlaced,
						timeRemaining: 0,
					});
				}
			}, 1000);

			const endpoint1 =
				API_CUSTOMER + ORDER + SLASH + this.props.order._id + LINEITEMS;
			const response1 = await axios.get(endpoint1, {
				withCredentials: true,
			});
			this.setState({ lineItemObjects: response1.data });

			// get the objects in the order for rendering totals
			if (this.props.order) {
				const newTotalQuantity = getTotalQuantity(
					this.props.order.lineItems
				);
				// if quantity of items has changed update totalPrice
				if (newTotalQuantity !== this.state.totalQuantity) {
					const endpoint2 =
						API_CUSTOMER +
						ORDER +
						SLASH +
						this.props.order._id +
						LINEITEMS;

					const response2 = await axios.get(endpoint2, {
						withCredentials: true,
					});
					this.setState({
						totalPrice: getTotalPrice(response2.data),
						totalQuantity: newTotalQuantity,
					});
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	componentDidUpdate = async () => {
		await this.throttledCheckStatus();
	};

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		// Don't render until API response has been recieved
		if (!this.state.lineItemObjects) {
			return null;
		}
		if (this.props.order.status == ORDER_READY) {
			this.props.history.push("/order/collect");
		}

		const handleBackClick = () => {
			this.props.history.push("/order/edit");
		};

		const applyDiscount = (totalPrice) => totalPrice * 0.1;

		var discounted;
		if (this.state.timeRemaining <= 0) {
			discounted = applyDiscount(this.state.totalPrice);
		} else {
			discounted = 0;
		}
		const timeRemainingString = millisToMinutesAndSeconds(
			this.state.timeRemaining
		);
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour12: true,
			hour: "2-digit",
			minute: "2-digit",
		};
		const timeDate = new Date(this.props.timer);
		const timePlaced = timeDate.toLocaleTimeString(undefined, options);
		var goBackClick;
		if (this.state.timeRemaining > EDIT_TIME) {
			goBackClick = this.props.history.goBack;
		}

		return (
			<div className="container-center-horizontal">
				<div className="container-center-vertical">
					<Header backButtonAction={() => goBackClick()} />
					<div className="cart__page-contents">
						<div className="cart__upper">
							<div className="cust-order-prep__heading heading">
								Your Order is Being Prepared!
							</div>
							<div className="cust-order-prep__time subheading">
								Time remaining to edit: {timeRemainingString}
							</div>
							<div className="cart__list-items">
								{this.state.lineItemObjects.map((object) => (
									<Link
										key={object.itemId._id}
										to={"/menu/item/" + object.itemId._id}
									>
										<ListItem item={object.itemId} />
									</Link>
								))}
							</div>
						</div>
						<div className="cust-order-prep__bottom-panel flex-column">
							<div className="cust-order-prep__text-container flex-row">
								<div className="heading">Total</div>
								<div className="heading">
									${this.state.totalPrice}
								</div>
							</div>
							<div className="cust-order-prep__text-container flex-row">
								<div className="subheading">Discount</div>
								<div className="subheading">
									- ${discounted.toPrecision(2)}
								</div>
							</div>
							<div className="seperator"></div>
							<div className="cust-order-prep__text-container flex-row">
								<div className="normaltext">Time ordered:</div>
								<div className="normaltext">{timePlaced}</div>
							</div>
							<EditButton
								timeRemaining={this.state.timeRemaining}
								handleClick={() => handleBackClick()}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(CustPrepOrder);

function EditButton(props) {
	const handleClick = props.handleClick;
	if (props.timeRemaining < EDIT_TIME) {
		return (
			<div className="cust-order-prep__medium-buttons">
				<div className="medium-button flex-row" id="grey__button">
					<div className="medium-button__back-icon">
						<FontAwesomeIcon icon="chevron-left" />
					</div>
					<div className="heading">{"Edit Order"}</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="cust-order-prep__medium-buttons">
				<div
					className="medium-button flex-row"
					onClick={() => handleClick()}
				>
					<div className="medium-button__back-icon">
						<FontAwesomeIcon icon="chevron-left" />
					</div>
					<div className="heading">{"Edit Order"}</div>
				</div>
			</div>
		);
	}
}
