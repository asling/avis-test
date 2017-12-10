import { createSelector } from 'reselect';

/**
 * Direct selector to the solutions state domain
 */
const selectSolutionsDomain = (state) => state.get('solutions');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Solutions
 */

const makeSelectSites = () => createSelector(
	selectSolutionsDomain,
	(substate) => substate.get("sites")
);

const makeCity = () => createSelector(
	selectSolutionsDomain,
	(substate) => substate.get("city")
)

export {
  makeSelectSites,
  makeCity,
};
