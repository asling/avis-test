/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  SITES_ACTION,
  SITES_SUCCESS_ACTION,
  SITES_FAIL_ACTION,
  SOLUTION_ACTION,
  SOLUTION_SUCCESS_ACTION,
  SOLUTION_FAIL_ACTION,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

/*sitemaps/city/*/
export function sitesAction(city){
	return {
		type: SITES_ACTION,
		city,
	}
};

export function getSitesSuccessAction(sites){
	return {
		type: SITES_SUCCESS_ACTION,
		sites,
	};
}

export function getSitesFailAction(err){
	return {
		type: SITES_FAIL_ACTION,
		err,
	}
}

export function solutionAction({date,stype}){
	return {
		type: SOLUTION_ACTION,
		date,
		stype,
	}
}

export function solutionSuccessAction(solution){
	return {
		type: SOLUTION_SUCCESS_ACTION,
		solution
	}
}

export function solutionFailAction(msg){
	return {
		type: SOLUTION_FAIL_ACTION,
		msg,
	}
}
