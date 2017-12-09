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

const makeSelectSolutions = () => createSelector(
  selectSolutionsDomain,
  (substate) => substate.toJS()
);

const selectSites = () => createSelector(
	selectSolutionsDomain,
	(substate) => substate.get("sites"),
);

export default makeSelectSolutions;
export {
  selectSolutionsDomain,
  selectSites,
};
