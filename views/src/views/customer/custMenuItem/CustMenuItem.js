import { React, Component } from "react";

// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";
import { roundNum, getQuantityInOrder } from "../../../app/helperFunctions";
import { APIgetItem, APIpostOrderUpdate } from "../../../app/apiCalls";

// components
import Header from "../../../components/header/Header";
import BottomButtons from "../../../components/buttons/BottomButtons";
import MinusButton from "../../../components/buttons/MinusButton";
import PlusButton from "../../../components/buttons/PlusButton";
import { SLASH, IMAGE_SRC } from "../../../app/urlConfig";

class MenuItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			item: null,
			quantity: null,
		};
	}

	// query API for an item
	componentDidMount = async () => {
		try {
			const item = await APIgetItem(this.props.match.params.id);
			this.setState({ item: item });

			// if there is an order check if the current item is in that order
			if (this.props.order != null) {
				// if in the order display the current quantity
				const quantity = getQuantityInOrder(
					item._id,
					this.props.order.lineItems
				);
				console.log(quantity);
				if (quantity > 0) {
					this.setState({
						quantity: getQuantityInOrder(
							this.props.order.lineItems
						),
					});
					return;
				}
			}
			// set quantity to one if there is no order or if item not yet in order
			this.setState({ quantity: 1 });
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.item) {
			return null;
		}

		const item = this.state.item;
		const quantity = this.state.quantity;
		const photoString = IMAGE_SRC + SLASH + this.state.item.photo;

		// functions to be passed as onClick to components:

		// passed to QuantityButtons
		const incrementQuantity = () => {
			this.setState({ quantity: this.state.quantity + 1 });
		};
		const decrementQuantity = () => {
			if (this.state.quantity > 0) {
				this.setState({ quantity: this.state.quantity - 1 });
			}
		};

		// passed to BottomButtons
		const button1Action = () => {
			this.props.history.push("/menu");
		};
		const button2Action = async (props) => {
			const customer = props.customer;
			if (!customer) {
				this.props.history.push("/login");
			} else {
				const newOrder = await APIpostOrderUpdate(
					this.props.order,
					this.props.customer,
					this.props.van,
					this.state.item._id,
					this.state.quantity
				);
				this.props.updateOrder(newOrder);
				// return to menu page
				this.props.history.push("/menu");
			}
		};

		return (
			// this centers the pages contents
			<div
				id="page-container"
				className="container-center-horizontal flex-row"
			>
				{/* This sets the height and width of a phone screen. */}
				<div className="container-center-vertical">
					<Header backButtonAction={this.props.history.goBack} />
					<div className="item-details">
						<img
							className="item-details__picture-holder"
							src={photoString}
							alt=""
						/>
						{/* This bottom panel is just a shape at the moment */}
						<div className="item-details__bottom-panel flex-row">
							{/* This holds and structures the items */}
							<div className="item-details__panel-items flex-column">
								<ItemInfo item={item} />
								<QtySetter
									quantity={quantity}
									decrementQuantity={decrementQuantity}
									incrementQuantity={incrementQuantity}
								/>
								<div className="item-details__medium-buttons">
									<BottomButtons
										button1Text="Back"
										button1Action={button1Action}
										button2Text="Add to Order"
										button2Action={() =>
											button2Action(this.props)
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
// connect to redux
export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);

// FUNCTIONAL COMPONENTS

function ItemInfo(props) {
	const name = props.item.name;
	const tagline = props.item.tagline;
	const roundedPrice = roundNum(props.item.price, 2);
	const description = props.item.description;

	return (
		// This container holds all the item details
		<div className="item-info">
			<h1 className="item-info__title largeheading">{name}</h1>
			{/* This sets up a smaller container to show this side by side */}
			<div className="item-info__row-container flex-row">
				<div className="item-info__subtitle subheading">{tagline}</div>
				<div className=".item-info__price subheading">
					{roundedPrice}
				</div>
			</div>
			<p className="item-info__description normaltext">{description}</p>
		</div>
	);
}

function QtySetter(props) {
	const quantity = props.quantity;

	return (
		// this container holds the quantity items and shows them side by side
		<div className="qty-setter flex-row">
			<div
				className="qty-setter__minus"
				onClick={() => props.decrementQuantity()}
			>
				<MinusButton />
			</div>

			<div className="qty-setter__current-quantity largeheading">
				{quantity}
			</div>
			<div
				className="qty-setter__plus"
				onClick={() => props.incrementQuantity()}
			>
				<PlusButton />
			</div>
		</div>
	);
}
