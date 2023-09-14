import { React, Component } from "react";
import { Link } from "react-router-dom";
import { getTotalQuantity, getTotalPrice } from "../../../app/helperFunctions";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";

// components
import Header from "../../../components/header/Header";
import ListItem from "../../../components/listItem/ListItem";
import BottomButtons from "../../../components/buttons/BottomButtons";
import { APIgetLineItems, APIpostOrderConfirm } from "../../../app/apiCalls";

class EditOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lineItemObjects: null,
			totalPrice: null,
			totalQuantity: null,
		};
	}

	// Query API
	componentDidMount = async () => {
		try {
			// get the objects in the order for rendering
			if (this.props.customer === null) {
				this.props.history.push("/login/");
			}

			const lineItemObjects = await APIgetLineItems(this.props.order._id);

			// get the objects in the order for rendering totals
			if (this.props.order) {
				const newTotalQuantity = getTotalQuantity(
					this.props.order.lineItems
				);
				this.setState({
					totalPrice: getTotalPrice(lineItemObjects),
					totalQuantity: newTotalQuantity,
					lineItemObjects: lineItemObjects,
				});
			} else {
				this.setState({ lineItemObjects: lineItemObjects });
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.lineItemObjects) {
			return null;
		}

		const handleBackClick = () => {
			this.props.history.goBack();
		};

		// post order confirmation, then clear redux state and alert user
		const handleConfirmClick = async () => {
			try {
				await APIpostOrderConfirm(this.props.order._id);
				const date = new Date();
				this.props.setTimer(date.toISOString());
				this.props.history.push("/order/prep/");
			} catch (err) {
				console.log(err);
			}
		};

		return (
			<div className="container-center-horizontal">
				<div className="container-center-vertical">
					<Header backButtonAction={this.props.history.goBack} />
					<h1 className="cart__category-header largeheading">
						Order
					</h1>
					<div className="cart__page-contents">
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

						{/* This bottom panel is just a shape at the moment */}
						<div className="cart__bottom-panel">
							{/* This holds and structures the items */}
							<div className="cart__panel-items">
								<div className="cart__display-line">
									<div className="cart_heading heading">
										Total Quantity:
									</div>
									<div className="cart_heading heading">
										{this.state.totalQuantity}
									</div>
								</div>
								<div className="cart__display-line">
									<div className="cart_heading heading">
										Total Price:
									</div>
									<div className="cart_heading heading">
										${this.state.totalPrice}
									</div>
								</div>
								<div className="BottomButtons">
									<BottomButtons
										button1Text={"Edit"}
										button1Action={() => handleBackClick()}
										button2Text={"Confrim"}
										button2Action={() =>
											handleConfirmClick()
										}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(EditOrder);
