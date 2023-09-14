import { UPDATE_ORDER, DELETE_ORDER } from "./order.types";

export const updateOrder = (order) => ({
	type: UPDATE_ORDER,
	payload: order,
});

export const deleteOrder = () => ({
	type: DELETE_ORDER,
});
