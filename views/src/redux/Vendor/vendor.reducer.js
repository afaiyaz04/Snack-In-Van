import { SET_VENDOR, DELETE_VENDOR } from "./vendor.types";

const INITIAL_STATE = null;

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_VENDOR:
			if (action.payload == undefined) {
				return null;
			}
			return action.payload;
		case DELETE_VENDOR:
			return null;
		default:
			return state;
	}
};

export default reducer;
