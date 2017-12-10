/*
 *
 * Solutions actions
 *
 */

import {
  DEFAULT_ACTION,
  SITES_ACTION,
  SITES_SUCCESS_ACTION,
  SITES_FAIL_ACTION,
} from './constants';

export function defaultAction() {
	console.log('32324234');
  return {
    type: DEFAULT_ACTION,
  };
}
/*sitemaps/city/*/
export function sitesAction(city){
	console.log('ddfdf');
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