import React from "react";
import { Route, Switch } from "react-router-dom";

// css
import "./style.css";
import "../components/fontAwesomeIcons";

// VIEWS
// Dev
import DevRegisterForm from "../views/development/devRegisterForm/DevRegisterForm";
import DevVanList from "../views/development/devVanList/DevVanList";

// Vendor
import VendCurrOrders from "../views/vendor/vendCurrentOrders/VendCurrentOrders";
import VendPastOrders from "../views/vendor/vendPastOrders/VendPastOrders";
import VendSetStatus from "../views/vendor/vendSetStatus/VendSetStatus";
import VendLogin from "../views/vendor/vendLogin/VendLogin";

// Customer
import CustLogin from "../views/customer/custLogin/CustLogin";
import CustMenuItem from "../views/customer/custMenuItem/CustMenuItem";
import CustMenu from "../views/customer/custMenu/CustMenu";
import CustEditOrder from "../views/customer/custEditOrder/CustEditOrder";
import CustCollectOrder from "../views/customer/custCollectOrder/CustCollectOrder";
import CustPrepOrder from "../views/customer/custPrepOrder/CustPrepOrder";
import CustProfile from "../views/customer/custProfile/CustProfile";
import CustMap from "../views/customer/custMap/CustMap";

function App() {
	return (
		<div>
			{/* Route components are rendered if the path prop matches the current URL */}
			<Switch>
				{/* Vendor Routes */}
				<Route path="/vendor/orders/curr/" component={VendCurrOrders} />
				<Route path="/vendor/orders/past/" component={VendPastOrders} />
				<Route path="/vendor/status/" component={VendSetStatus} />
				<Route path="/vendor/login/" component={VendLogin} />

				{/* Customer Routes */}
				<Route path="/order/collect/" component={CustCollectOrder} />
				<Route path="/order/prep/" component={CustPrepOrder} />
				<Route path="/order/edit/" component={CustEditOrder} />

				<Route path="/menu/item/:id" component={CustMenuItem} />
				<Route path="/menu/" component={CustMenu} />

				<Route path="/profile/" component={CustProfile} />
				<Route path="/login/" component={CustLogin} />
				<Route path="/map/" component={CustMap} />

				<Route path="/register/" component={DevRegisterForm} />
				<Route exact path="/" component={DevVanList} />
			</Switch>
		</div>
	);
}

export default App;
