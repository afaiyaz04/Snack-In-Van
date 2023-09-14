import { SET_VAN, DELETE_VAN } from "./van.types";

const INITIAL_STATE = null;

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_VAN:
			if (action.payload == undefined) {
				return null;
			}
			return action.payload;
		case DELETE_VAN:
			return null;
		default:
			return state;
	}
};

export default reducer;
