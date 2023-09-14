import { createSelector } from "reselect";
const selectData = (state) => state;

export const getCustomerId = createSelector(
	[selectData],
	(data) => data.customerState._id
);
