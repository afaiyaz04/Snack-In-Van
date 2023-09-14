import {
	START_TIMER,
	RESET_TIMER,
} from "./editTimer.types";

const INITIAL_STATE = null;

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_TIMER:
			if (action.payload == undefined) {
				return null;
			}
			return action.payload;
		case RESET_TIMER:
			return null;
		default:
			return state;
	}
};

export default reducer;
