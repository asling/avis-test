/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectSolutions = (state) => state.get('solutions');

const makeSelectUsername = () => createSelector(
  selectSolutions,
  (homeState) => homeState.get('username')
);

const makeSelectSites = () => createSelector(
	selectSolutions,
	(substate) => substate.get("sites")
);

const makeCity = () => createSelector(
	selectSolutions,
	(substate) => substate.get("city")
)

const makeSolutionParam = () => createSelector(
	selectSolutions,
	(substate) => {
		return {date: substate.get("date"), stype: substate.get("stype")}
	}
);

export {
  selectSolutions,
  makeSolutionParam,
  makeSelectSites,
  makeCity,
};
