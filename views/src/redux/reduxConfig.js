// Import config setup for pages that need to access redux
import { updateOrder, deleteOrder } from "./Order/order.actions";
import {
	setCustomer,
	deleteCustomer,
} from "./Customer/customer.actions";
import { setVan, deleteVan } from "./Van/van.actions";
import { setVendor, deleteVendor } from "./Vendor/vendor.actions";
import { startTimer, resetTimer } from "./EditTimer/editTimer.actions";

const mapStateToProps = (state) => ({
	order: state.orderState,
	customer: state.customerState,
	van: state.vanState,
	vendor: state.vendorState,
	timer: state.timerState,
});

const mapDispatchToProps = (dispatch) => ({
	updateOrder: (order) => dispatch(updateOrder(order)),
	deleteOrder: () => dispatch(deleteOrder()),

	setCustomer: (customerId) => dispatch(setCustomer(customerId)),
	deleteCustomer: () => dispatch(deleteCustomer()),

	setVan: (vanId) => dispatch(setVan(vanId)),
	deleteVan: () => dispatch(deleteVan()),

	setVendor: (vendorId) => dispatch(setVendor(vendorId)),
	deleteVendor: () => dispatch(deleteVendor()),

	setTimer: (date) => dispatch(startTimer(date)),
	deleteTimer: () => dispatch(resetTimer()),
});

export { mapStateToProps, mapDispatchToProps };
