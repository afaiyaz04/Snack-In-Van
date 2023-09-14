import { SET_VENDOR, DELETE_VENDOR } from "./vendor.types";

export const setVendor = (vendorId) => ({
	type: SET_VENDOR,
	payload: vendorId,
});

export const deleteVendor = () => ({
	type: DELETE_VENDOR,
});
