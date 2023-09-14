import { createSelector } from "reselect";
const selectData = (state) => state;

export const getVendor = createSelector(
	[selectData],
	(data) => data.vendorState
);
