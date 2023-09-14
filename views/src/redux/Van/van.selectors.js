import { createSelector } from "reselect";
const selectData = (state) => state;

export const getVan = createSelector([selectData], (data) => data.vanState);
