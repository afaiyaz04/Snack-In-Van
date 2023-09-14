import { combineReducers } from "redux";

import orderReducer from "./Order/order.reducer";
import customerReducer from "./Customer/customer.reducer";
import vanReducer from "./Van/van.reducer";
import vendorReducer from "./Vendor/vendor.reducer";
import timerReducer from "./EditTimer/editTimer.reducer";

const rootReducer = combineReducers({
	orderState: orderReducer,
	customerState: customerReducer,
	vanState: vanReducer,
	vendorState: vendorReducer,
	timerState: timerReducer,
});

export default rootReducer;
