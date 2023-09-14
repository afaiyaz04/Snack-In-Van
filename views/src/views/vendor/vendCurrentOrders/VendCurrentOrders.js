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
import ReadyCard from "../../../components/readyCard/ReadyCard";
import { APIauthVendor, APIgetOrdersAtStatus } from "../../../app/apiCalls";
import {
	FAILURE,
	ORDER_CONFIRMED,
	ORDER_READY,
} from "../../../app/statusEnums";
// import { throttle } from "lodash";

class VendCurrentOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmed: undefined,
			ready: undefined,
			shouldUpdate: false,
			vendor: undefined,
		};
		// this.throttledPopulateState = throttle(this.populateState, 1500);
	}

	// populateState = async () => {
	// 	const confirmed = await APIgetOrdersAtStatus(
	// 		this.props.van._id,
	// 		ORDER_CONFIRMED
	// 	);
	// 	const ready = await APIgetOrdersAtStatus(
	// 		this.props.van._id,
	// 		ORDER_READY
	// 	);
	// 	this.setState({
	// 		confirmed: confirmed,
	// 		ready: ready,
	// 	});
	// };

	// Query API
	componentDidMount = async () => {
		const vendor = await APIauthVendor();
		if (vendor === FAILURE) {
			this.props.history.push("/vendor/login");
		}
		this.setState({ vendor: vendor });
		this.props.setVendor(vendor);
		// this.throttledPopulateState();
		const confirmed = await APIgetOrdersAtStatus(
			this.props.van._id,
			ORDER_CONFIRMED
		);
		const ready = await APIgetOrdersAtStatus(
			this.props.van._id,
			ORDER_READY
		);
		this.setState({
			confirmed: confirmed,
			ready: ready,
		});
	};

	// Query API again when component is updated in case there are changes
	componentDidUpdate = async () => {
		if (this.state.shouldUpdate) {
			this.setState({ shouldUpdate: false });
		}

		// this.throttledPopulateState();
		const confirmed = await APIgetOrdersAtStatus(
			this.props.van._id,
			ORDER_CONFIRMED
		);
		const ready = await APIgetOrdersAtStatus(
			this.props.van._id,
			ORDER_READY
		);
		this.setState({
			confirmed: confirmed,
			ready: ready,
		});
	};

	render() {
		// Don't render until API response has been recieved
		if (this.state.confirmed === undefined) {
			return null;
		}

		const setShouldUpdate = () => {
			this.setState({ shouldUpdate: true });
		};

		return (
			<div id="vendor-container" className="container-vendor">
				<SideBar />
				<div className="vendor-display__orders">
					<h1 className="largeheading">Orders to Prepare</h1>
					<RenderCurrOrders
						confirmed={this.state.confirmed}
						setShouldUpdate={() => setShouldUpdate()}
					/>
				</div>
				<div className="vendor-display__ready">
					<h1 className="largeheading">Ready To Collect</h1>
					<RenderReadyOrders
						ready={this.state.ready}
						setShouldUpdate={() => setShouldUpdate()}
					/>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(VendCurrentOrders);

function RenderCurrOrders(props) {
	if (props.confirmed.length === 0) {
		return (
			<div className="render-orders__no-text">
				<div className="normaltext">No orders to display.</div>
			</div>
		);
	}
	return (
		<div>
			{props.confirmed.map((order) => (
				<OrderCard
					key={order._id}
					order={order}
					setShouldUpdate={() => props.setShouldUpdate()}
				/>
			))}
		</div>
	);
}

function RenderReadyOrders(props) {
	if (props.ready.length === 0) {
		return (
			<div className="render-orders__no-text">
				<div className="normaltext">No orders to display.</div>
			</div>
		);
	}
	return (
		<div>
			{props.ready.map((order) => (
				<ReadyCard
					key={order._id}
					order={order}
					setShouldUpdate={() => props.setShouldUpdate()}
				/>
			))}
		</div>
	);
}
