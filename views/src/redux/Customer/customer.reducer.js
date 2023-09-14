import {
	SET_CUSTOMER,
	DELETE_CUSTOMER,
} from "./customer.types";

const INITIAL_STATE = null;

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_CUSTOMER:
			if (action.payload == undefined) {
				return null;
			}
			return action.payload;
		case DELETE_CUSTOMER:
			return null;
		default:
			return state;
	}
};

export default reducer;
