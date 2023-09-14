import axios from "axios";
import { AUTHORISED, FAILURE, ORDER_PENDING, SUCCESS } from "./statusEnums";
import {
	API_AUTH,
	LOGIN,
	LOGOUT,
	REGISTER,
	API_CUSTOMER,
	ORDER,
	UPDATE,
	SLASH,
	CUSTOMER,
	ORDER_S,
	STATUS,
	GET,
	API_VENDOR,
	SET,
	BUSINESS,
	OPEN,
	CLOSE,
	VENDOR,
	CURRENT,
	MENU,
	LINEITEMS,
	ITEM,
	VANS,
	CONFIRM,
	FEEDBACK,
} from "./urlConfig";

// Post login, res: JWT and customer ID from API, stored in localstorage
// Source, lecture 9-1
export const APIloginUser = async (user, history) => {
	try {
		const { email, password } = user;

		const endpoint = API_AUTH + LOGIN + CUSTOMER;
		const res = await axios.post(
			endpoint,
			{
				email: email,
				password: password,
			},
			{ withCredentials: true }
		);
		const data = res.data;

		// if login is a success
		if (data !== undefined) {
			history.push("/");
		} else {
			history.push("/login/view");
		}
	} catch (err) {
		alert("Invalid username or password");
		console.log(err.stack);
	}
};

// call auth route and return failure if jwt is not of type customer
export const APIauthCustomer = async () => {
	try {
		const endpoint = API_AUTH + CURRENT;
		const res = await axios.get(endpoint, {
			withCredentials: true,
		});
		// check to see if the object returned is a customer
		if (res.data.email !== undefined) {
			return res.data;
		} else {
			return FAILURE;
		}
	} catch (err) {
		console.log(err);
	}
};

// call auth route and return failure if jwt is not of type vendor
export const APIauthVendor = async () => {
	try {
		const endpoint = API_AUTH + CURRENT;
		console.log(endpoint);
		const res = await axios.get(endpoint, {
			withCredentials: true,
		});
		// check to see if the object returned is a vendor
		if (res.data.status !== undefined) {
			return res.data;
		} else {
			return FAILURE;
		}
	} catch (err) {
		console.log(err);
	}
};

// Post login, res: JWT and customer ID from API, stored in localstorage
// Source, lecture 9-1
export const APIloginVendor = async (user, history) => {
	try {
		const { name, password } = user;

		const endpoint = API_AUTH + LOGIN + VENDOR;
		const res = await axios.post(
			endpoint,
			{
				name: name,
				password: password,
			},
			{ withCredentials: true }
		);
		const data = res.data;
		// // if login is a success
		if (data === AUTHORISED) {
			history.push("/vendor/orders/curr");
		} else {
			alert("Incorrect van name or password");
		}
	} catch (err) {
		alert("Invalid username or password");
		console.log(err.stack);
	}
};

// replace jwt with blank token through api call
export const APIlogoutUser = async () => {
	try {
		const endpoint = API_AUTH + LOGOUT;
		await axios.post(endpoint, { withCredentials: true });
	} catch (err) {
		console.log(err);
	}
};

// Post register, res: JWT and customer ID from API, stored in localstorage
// Source, lecture 9-1
export const APIregisterUser = async (user) => {
	try {
		const { email, password, password2, nameGiven, nameFamily } = user;

		const endpoint = API_AUTH + REGISTER + CUSTOMER;
		const res = await axios.post(
			endpoint,
			{
				email: email,
				password: password,
				password2: password2,
				nameGiven: nameGiven,
				nameFamily: nameFamily,
			},
			{ withCredentials: true }
		);
		const data = res.data;
		if (data && data.customer) {
			alert("account created successfully");
			return SUCCESS;
		} else {
			return FAILURE;
		}
	} catch (err) {
		console.log(err.stack);
	}
};

// request menu of item objects from api
export const APIgetMenu = async () => {
	try {
		const endpoint = API_CUSTOMER + MENU;
		const response = await axios.get(endpoint, {
			withCredentials: true,
		});
		return response.data;
	} catch (err) {
		console.log(err);
	}
};

// request an individual item's details
export const APIgetItem = async (itemId) => {
	try {
		const endpoint = API_CUSTOMER + MENU + ITEM + SLASH + itemId;
		const response = await axios.get(endpoint, {
			withCredentials: true,
		});
		return response.data;
	} catch (err) {
		console.log(err);
	}
};

// get the lineItemObjects from an order
export const APIgetLineItems = async (orderId) => {
	try {
		const endpoint = API_CUSTOMER + ORDER + SLASH + orderId + LINEITEMS;
		const response = await axios.get(endpoint, {
			withCredentials: true,
		});
		return response.data;
	} catch (err) {
		console.log(err);
	}
};

// post order changes to API and update redux store
export const APIpostOrderUpdate = async (
	order,
	customer,
	van,
	itemId,
	quantity
) => {
	try {
		// only parse Id if there is currently an order
		// leave order id null to create new order
		var orderId;
		if (order) {
			orderId = order._id;
		}
		const endpoint = API_CUSTOMER + ORDER + UPDATE;

		// send order changes to API

		const res = await axios.post(
			endpoint,
			{
				orderId: orderId,
				customer: customer,
				van: van,
				itemId: itemId,
				quantity: quantity,
			},
			{ withCredentials: true }
		);
		return res.data;
	} catch (err) {
		console.log(err.stack);
	}
};

export const APIcheckOrderStatus = async (orderId) => {
	try {
		const endpoint = API_CUSTOMER + ORDER + SLASH + orderId + STATUS;
		const res = await axios.get(endpoint, {
			withCredentials: true,
		});
		return res.data;
	} catch (err) {
		console.log(err);
	}
};

// post a request to set order status to confirmed
export const APIpostOrderConfirm = async (orderId) => {
	try {
		const endpoint = API_CUSTOMER + ORDER + SLASH + orderId + CONFIRM;
		axios.post(endpoint, {
			withCredentials: true,
		});
	} catch (err) {
		console.log(err);
	}
};

// Discard unconfirmed order
export const APIshouldDelete = async (order) => {
	try {
		if (order) {
			const endpoint = API_CUSTOMER + ORDER + SLASH + order._id;
			if (order.status === ORDER_PENDING) {
				try {
					await axios.delete(endpoint, {
						withCredentials: true,
					});
					return true;
				} catch (err) {
					console.log(err);
					return false;
				}
			} else {
				return true;
			}
		}
	} catch (err) {
		console.log(err);
	}
};

// request a list of all open vans, position calculation is done
// userside to avoid the need to transmit location
export const APIgetVanList = async () => {
	try {
		const endpoint = API_VENDOR + VANS;
		const response = await axios.get(endpoint, {
			withCredentials: true,
		});
		return response.data;
	} catch (err) {
		console.log(err);
	}
};

// Get orders at provided status for provided van
export const APIgetOrdersAtStatus = async (vanId, status) => {
	try {
		const endpoint = API_VENDOR + ORDER_S + STATUS + GET + SLASH + vanId;
		const res = await axios.post(
			endpoint,
			{
				getStatus: status,
			},
			{ withCredentials: true }
		);
		return res.data;
	} catch (err) {
		console.log(err);
		return false;
	}
};

// Set order status to newStatus
export const APIsetOrderStatus = async (orderId, status) => {
	const endpoint = API_VENDOR + ORDER_S + STATUS + SET + SLASH + orderId;
	try {
		await axios.post(
			endpoint,
			{
				newStatus: status,
			},
			{ withCredentials: true }
		);
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};

// Set van status to open
export const APIsetVanOpen = async (vanId, lat, lng, locDescription) => {
	try {
		const endpoint = API_VENDOR + BUSINESS + OPEN + SLASH + vanId;
		await axios.post(
			endpoint,
			{
				location: {
					lat: lat,
					lng: lng,
				},
				locDescription: locDescription,
			},
			{
				withCredentials: true,
			}
		);
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};

// Set van status to closed
export const APIsetVanClose = async (vanId) => {
	try {
		const endpoint = API_VENDOR + BUSINESS + CLOSE + SLASH + vanId;
		await axios.post(endpoint, {
			withCredentials: true,
		});
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};
// Update password
export const APIupdatePassword = async (data) => {
	try {
		const { customerId, password, password2 } = data;
		const endpoint = API_AUTH + UPDATE + CUSTOMER + SLASH + customerId;
		const res = await axios.post(endpoint, {
			password: password,
			password2: password2,
		});
		console.log(res);
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};

// update givenName and familyName
export const APIupdateName = async (data) => {
	try {
		const { customerId, nameGiven, nameFamily } = data;
		const endpoint = API_CUSTOMER + UPDATE + SLASH + customerId;
		const res = await axios.post(endpoint, {
			nameGiven: nameGiven,
			nameFamily: nameFamily,
		});
		console.log(res);
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};

// update givenName and familyName
export const APIsetFeedback = async (orderId, rating, feedback) => {
	try {
		const endpoint = API_CUSTOMER + ORDER + SLASH + orderId + FEEDBACK;
		await axios.post(endpoint, {
			rating: rating,
			feedback: feedback,
		});
		return SUCCESS;
	} catch (err) {
		console.log(err);
		return FAILURE;
	}
};
