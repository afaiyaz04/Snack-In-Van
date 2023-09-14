import React, { Component, useRef, useEffect } from "react";
import "../../app/style.css";

import { roundNum, getTotalPrice } from "../../app/helperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	ORDER_CONFIRMED,
	ORDER_READY,
	ORDER_CANCELLED,
} from "../../app/statusEnums";
import { APIsetOrderStatus } from "../../app/apiCalls";

class OrderCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldConfirm: false,
			isOutsideClick: false,
			shouldCancel: false,
			isCancelButtonDisabled: true,
		};
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.state.shouldCancel) {
			if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
				this.setState({ shouldCancel: false });
			}
		}
	}

	handleButtonPress() {
		console.log("pressing");
		this.buttonPressTimer = setTimeout(
			() => this.setState({ shouldCancel: true }),
			1500
		);
		setTimeout(() => this.setState({ isCancelButtonDisabled: false }), 100);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}

	render() {
		const order = this.props.order;

		const toggleShouldConfrimReady = async () => {
			// if we should confirm the order
			if (this.state.isOutsideClick) {
				toggleIsOutsideClick();
				this.setState({ shouldConfirm: false });
			} else if (this.state.shouldConfirm) {
				// send post request to API
				APIsetOrderStatus(order._id, ORDER_READY);
				this.props.setShouldUpdate();
			} else {
				this.setState({ shouldConfirm: true });
			}
		};

		const handleCancel = async () => {
			if (!this.state.isCancelButtonDisabled) {
				APIsetOrderStatus(order._id, ORDER_CANCELLED);
				this.props.setShouldUpdate();
			}
		};

		const toggleIsOutsideClick = () => {
			if (this.state.isOutsideClick) {
				this.setState({ isOutsideClick: false });
			} else {
				this.setState({ isOutsideClick: true });
			}
		};

		if (order.status !== ORDER_CONFIRMED) {
			return (
				<div ref={this.wrapperRef} className="order-card__past">
					<OrderBody order={order} />
					<ToggleConfirmButtons
						orderStatus={order.status}
						shouldConfirm={this.state.shouldConfirm}
						toggleShouldConfrimReady={() =>
							toggleShouldConfrimReady()
						}
						toggleIsOutsideClick={() => toggleIsOutsideClick()}
					/>
				</div>
			);
		}
		if (!this.state.shouldCancel) {
			return (
				<div
					className="order-card"
					ref={this.wrapperRef}
					onTouchStart={this.handleButtonPress}
					onTouchEnd={this.handleButtonRelease}
					onMouseDown={this.handleButtonPress}
					onMouseUp={this.handleButtonRelease}
					onMouseLeave={this.handleButtonRelease}
				>
					<OrderBody order={order} />
					<ToggleConfirmButtons
						orderStatus={order.status}
						shouldConfirm={this.state.shouldConfirm}
						toggleShouldConfrimReady={() =>
							toggleShouldConfrimReady()
						}
						toggleIsOutsideClick={() => toggleIsOutsideClick()}
					/>
				</div>
			);
		} else {
			return (
				<div
					onClick={() => handleCancel()}
					className="order-card"
					id="order-card__cancel"
					ref={this.setWrapperRef}
				>
					<OrderBody order={order} setInisible={true} />
					<div className="order-card__replace-buttons"></div>
				</div>
			);
		}
	}
}
export default OrderCard;

function ToggleConfirmButtons(props) {
	const toggleShouldConfrimReady = props.toggleShouldConfrimReady;
	const toggleIsOutsideClick = props.toggleIsOutsideClick;

	// in the case were orderCard is being rendered on the past Orders screen
	if (props.orderStatus !== ORDER_CONFIRMED) {
		return null;
	}

	// manage toggling of confirm/tick
	if (props.shouldConfirm) {
		return (
			<ConfirmButton
				setInisible={props.setInvisible}
				toggleShouldConfrimReady={() => toggleShouldConfrimReady()}
				toggleIsOutsideClick={() => toggleIsOutsideClick()}
			/>
		);
	} else {
		return (
			<TickButton
				setInvisible={props.setInvisible}
				toggleShouldConfrimReady={() => toggleShouldConfrimReady()}
			/>
		);
	}
}

function TickButton(props) {
	const toggleShouldConfrimReady = props.toggleShouldConfrimReady;
	if (props.setInvisible) {
		return (
			<div className="order-card__button-spacer set-invisible">
				<button className="order-card__tick">
					<FontAwesomeIcon icon={"check"} />
				</button>
			</div>
		);
	}
	return (
		<div className="order-card__button-spacer">
			<button
				className="order-card__tick"
				onClick={() => toggleShouldConfrimReady()}
			>
				<FontAwesomeIcon icon={"check"} />
			</button>
		</div>
	);
}

function ConfirmButton(props) {
	const toggleShouldConfrimReady = props.toggleShouldConfrimReady;
	const toggleIsOutsideClick = props.toggleIsOutsideClick;
	useEffect(() => {
		// add when mounted
		document.addEventListener("mousedown", handleOutsideClick);
		// return function to be called when unmounted
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const handleOutsideClick = (e) => {
		if (node.current.contains(e.target)) {
			// inside click
			return;
		}
		// outside click
		toggleIsOutsideClick();
		toggleShouldConfrimReady();
	};

	const node = useRef();

	if (props.setInisible) {
		return (
			<div className="order-card__button-spacer set-invisible">
				<div ref={node}>
					<button className="order-card__confirm">Confirm</button>
				</div>
			</div>
		);
	}
	return (
		<div className="order-card__button-spacer">
			<div ref={node}>
				<button
					className="order-card__confirm"
					onClick={() => toggleShouldConfrimReady()}
				>
					Confirm
				</button>
			</div>
		</div>
	);
}

function OrderBody(props) {
	const order = props.order;

	const foodLineItems = order.lineItems.filter(
		(li) => li.itemId.category === "Food"
	);
	const drinkLineItems = order.lineItems.filter(
		(li) => li.itemId.category === "Beverage"
	);
	if (props.setInisible) {
		return (
			<div>
				<div className="order-card__text set-invisible">
					<div className="order-card__upper">
						<h2>{order.status}</h2>
						<h2>
							#{order._id.slice(-2)} - {order.customer.nameGiven}{" "}
							{order.customer.nameFamily}
						</h2>
						<h2 className="heading">0:50</h2>
					</div>
					<div className="order-card__lower">
						<div className="order-card__food">
							<h2 className="subheading">Food</h2>
							{foodLineItems.map((lineItem) => (
								<li key={lineItem.itemId._id}>
									<h3 className="normaltext">
										{lineItem.quantity}x{" "}
										{lineItem.itemId.name} = $
										{roundNum(lineItem.itemId.price, 2)}
									</h3>
								</li>
							))}
						</div>
						<div className="order-card__beverages">
							<h2 className="subheading">Beverages</h2>
							{drinkLineItems.map((lineItem) => (
								<li key={lineItem.itemId._id}>
									<h3 className="normaltext">
										{lineItem.quantity}x{" "}
										{lineItem.itemId.name}
									</h3>
								</li>
							))}
						</div>
						<h1 className="subheading">
							${roundNum(getTotalPrice(order.lineItems), 2)}
						</h1>
					</div>
				</div>
				<div className="order-card__cancel-text largeheading">
					CANCEL
				</div>
			</div>
		);
	}
	return (
		<div className="order-card__text">
			<div className="order-card__upper">
				<h2>{order.status}</h2>
				<br />
				<h2 className="order-card__subheading">
					#{order._id.slice(-2)} - {order.customer.nameGiven}{" "}
					{order.customer.nameFamily}
				</h2>
				<h2 className="order-card__subheading">0:50</h2>
			</div>
			<div className="order-card__lower">
				<div className="order-card__food">
					<h2 className="order-card__subheading subheading">Food</h2>
					{foodLineItems.map((lineItem) => (
						<li key={lineItem.itemId._id}>
							<h3 className="normaltext">
								{lineItem.quantity}x {lineItem.itemId.name} = $
								{roundNum(lineItem.itemId.price, 2)}
							</h3>
						</li>
					))}
				</div>
				<div className="order-card__beverages">
					<h2 className="order-card__subheading subheading">
						Beverages
					</h2>
					{drinkLineItems.map((lineItem) => (
						<li key={lineItem.itemId._id}>
							<h3 className="normaltext">
								{lineItem.quantity}x {lineItem.itemId.name}
							</h3>
						</li>
					))}
				</div>
				<h1 className="order-card__price subheading">
					${roundNum(getTotalPrice(order.lineItems), 2)}
				</h1>
			</div>
		</div>
	);
}
