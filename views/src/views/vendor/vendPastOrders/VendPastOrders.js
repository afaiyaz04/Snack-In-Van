import { React, Component } from "react";
// import redux config
import { connect } from "react-redux";
import {
	mapStateToProps,
	mapDispatchToProps,
} from "../../../redux/reduxConfig";

// components
import SideBar from "../../../components/sideBar/SideBar";
import OrderCard from "../../../components/orderCard/OrderCard";
import { APIauthVendor, APIgetOrdersAtStatus } from "../../../app/apiCalls";
import { FAILURE, ORDER_PAST } from "../../../app/statusEnums";

class VendCurrentOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			past: null,
		};
	}

	// Query API
	componentDidMount = async () => {
		// bounce back unauthenticated users
		if ((await APIauthVendor()) === FAILURE) {
			this.props.history.push("/vendor/login");
		}
		const past = await APIgetOrdersAtStatus(
			this.props.vendor._id,
			ORDER_PAST
		);
		this.setState({
			past: past,
		});
	};

	render() {
		// Don't render until API response has been recieved
		if (!this.state.past) {
			return null;
		}

		return (
			<div className="container-vendor">
				<SideBar />
				<div className="vendor-display__orders">
					<h1 className="largeheading">Past Orders</h1>
					<RenderPastOrders past={this.state.past} />
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(VendCurrentOrders);

function RenderPastOrders(props) {
	if (props.past.length === 0) {
		return (
			<div className="render-ordersno-text">
				<div className="normaltext">No orders to display.</div>
			</div>
		);
	}
	return (
		<div>
			{props.past.map((order) => (
				<OrderCard key={order._id} order={order} />
			))}
		</div>
	);
}
