import { React, Component } from "react";
import { Link } from "react-router-dom";
import { getTotalPrice, getTotalQuantity } from "../../../app/helperFunctions";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";

// components
import Header from "../../../components/header/Header";
import ListItem from "../../../components/listItem/ListItem";
import { APIgetLineItems, APIgetMenu } from "../../../app/apiCalls";

class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menu: null,
			lineItemObjects: null,
			totalPrice: null,
			totalQuantity: null,
		};
	}

	// query API
	componentDidMount = async () => {
		try {
			const menu = await APIgetMenu();
			this.setState({ menu: menu.map((item) => item) });

			// get the objects in the order for rendering totals
			if (this.props.order) {
				console.log("we have an order");
				const newTotalQuantity = getTotalQuantity(
					this.props.order.lineItems
				);
				if (newTotalQuantity !== this.state.totalQuantity) {
					const lineItems = await APIgetLineItems(
						this.props.order._id
					);
					console.log("setting state");
					this.setState({
						totalPrice: getTotalPrice(lineItems),
						totalQuantity: newTotalQuantity,
					});
					console.log(this.state.totalPrice);
					console.log(this.state.totalQuantity);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.menu) {
			return null;
		}
		const food = "Food";
		const drink = "Drink";

		// create arrays of food and drink to be rendered
		const foods = this.state.menu.filter(
			(item) => item.category === "Food"
		);
		const drinks = this.state.menu.filter(
			(item) => item.category === "Beverage"
		);
		const snackBarHandler = () => {
			this.props.history.push("/order/edit");
		};

		return (
			<div className="container-center-horizontal no-link-underline">
				<div className="container-center-vertical">
					<Header
						backButtonAction={() => this.props.history.push("/")}
					/>
					<div className="menu__category-header heading">{food}</div>
					<div className="menu__list-items">
						{foods.map((item) => (
							<Link key={item._id} to={"/menu/item/" + item._id}>
								<ListItem item={item} />
							</Link>
						))}
					</div>
					<h1 className="menu__category-header heading">{drink}</h1>
					<div className="menu__list-items">
						{drinks.map((item) => (
							<Link key={item._id} to={"/menu/item/" + item._id}>
								<ListItem item={item} />
							</Link>
						))}
					</div>
					<SnackBar
						handleClick={snackBarHandler}
						totalPrice={this.state.totalPrice}
						totalQuantity={this.state.totalQuantity}
					/>
				</div>
			</div>
		);
	}
}
//connect to redux
export default connect(mapStateToProps, mapDispatchToProps)(Menu);

function SnackBar(props) {
	console.log(props);
	const handleClick = props.handleClick;
	if (props.totalPrice && props.totalQuantity) {
		return (
			<div className="menu__snackbar" onClick={() => handleClick()}>
				<div className="menu__snackbar-button">
					<div className="menu__snackbar-heading heading">
						Checkout - {props.totalQuantity}
					</div>
					<div className="heading">${props.totalPrice}</div>
				</div>
			</div>
		);
	}
	return null;
}
