import { UPDATE_ORDER, DELETE_ORDER } from "./order.types";

const INITIAL_STATE = null;

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_ORDER:
			if (action.payload == undefined) {
				return null;
			}
			return action.payload;
		case DELETE_ORDER:
			return null;
		default:
			return state;
	}
};

export default reducer;
