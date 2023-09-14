import { createSelector } from "reselect";
const selectData = (state) => state;

export const getTimer = createSelector([selectData], (data) => data.timerState);
