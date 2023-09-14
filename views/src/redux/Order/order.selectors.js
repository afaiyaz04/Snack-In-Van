import { createSelector } from "reselect";
const orderSelector = (state) => {
	if (state) {
		return state.orderState;
	}
};

export const getOrder = createSelector(orderSelector, (order) => order);

export const getLineItems = createSelector(orderSelector, (order) => {
	if (order) {
		return order.lineItems;
	}
	return null;
});

export const getTotalPrice = createSelector(orderSelector, (order) => {
	if (order) {
		if (order.lineItems) {
			return order.lineItems.map((li) => li.total).reduce(sumReducer, 0);
		}
	}
	return null;
});

export const getTotalQuantity = createSelector(orderSelector, (order) => {
	if (order) {
		if (order.lineItems) {
			return order.lineItems
				.map((li) => li.quantity)
				.reduce(sumReducer, 0);
		}
	}
	return null;
});

function sumReducer(sum, val) {
	return sum + val;
}
