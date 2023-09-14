import {
	SET_CUSTOMER,
	DELETE_CUSTOMER,
} from "./customer.types";

export const setCustomer = (customerId) => ({
	type: SET_CUSTOMER,
	payload: customerId,
});

export const deleteCustomer = () => ({
	type: DELETE_CUSTOMER,
});
