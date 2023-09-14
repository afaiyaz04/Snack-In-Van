import { SET_VAN, DELETE_VAN } from "./van.types";

export const setVan = (vanId) => ({
	type: SET_VAN,
	payload: vanId,
});

export const deleteVan = () => ({
	type: DELETE_VAN,
});
