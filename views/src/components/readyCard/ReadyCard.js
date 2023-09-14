import { React, Component, useRef, useEffect } from "react";
//app
import "../../app/style.css";
import { ORDER_FULFILLED } from "../../app/statusEnums";
import { APIsetOrderStatus } from "../../app/apiCalls";

class ReadyCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldConfirm: false,
			isOutsideClick: false,
		};
	}

	render() {
		const order = this.props.order;

		const toggleShouldConfrimReady = async () => {
			// if we should confirm the order
			if (this.state.isOutsideClick) {
				toggleIsOutsideClick();
				this.setState({ shouldConfirm: false });
			} else if (this.state.shouldConfirm) {
				// // send post request to API
				APIsetOrderStatus(order._id, ORDER_FULFILLED);
				this.props.setShouldUpdate();
			} else {
				this.setState({ shouldConfirm: true });
			}
		};

		const toggleIsOutsideClick = () => {
			// if we should confirm the order
			if (this.state.isOutsideClick) {
				// send post request to API
				this.setState({ isOutsideClick: false });
			} else {
				this.setState({ isOutsideClick: true });
			}
		};

		return (
			<ToggleButtons
				order={order}
				shouldConfirm={this.state.shouldConfirm}
				toggleShouldConfrimReady={() => toggleShouldConfrimReady()}
				toggleIsOutsideClick={() => toggleIsOutsideClick()}
			/>
		);
	}
}
export default ReadyCard;

function ToggleButtons(props) {
	const toggleShouldConfrimReady = props.toggleShouldConfrimReady;
	const toggleIsOutsideClick = props.toggleIsOutsideClick;
	const order = props.order;

	// manage toggling of confirm/tick
	if (props.shouldConfirm) {
		return (
			<ConfirmButton
				toggleShouldConfrimReady={() => toggleShouldConfrimReady()}
				toggleIsOutsideClick={() => toggleIsOutsideClick()}
			/>
		);
	} else {
		return (
			<NameButton
				order={order}
				toggleShouldConfrimReady={() => toggleShouldConfrimReady()}
			/>
		);
	}
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

	return (
		<div ref={node}>
			<button
				className="ready-card"
				onClick={() => toggleShouldConfrimReady()}
			>
				<div className="largeheading">Confirm</div>
			</button>
		</div>
	);
}

function NameButton(props) {
	const order = props.order;
	const toggleShouldConfrimReady = props.toggleShouldConfrimReady;
	return (
		<button
			className="name-card"
			onClick={() => toggleShouldConfrimReady()}
		>
			<li>
				<h3 className="heading">#{order._id.slice(-2)}</h3>
				<h3 className="subheading">
					{order.customer.nameGiven} {order.customer.nameFamily}
				</h3>
			</li>
		</button>
	);
}
