/*
 *
 * Solutions actions
 *
 */

import {
  DEFAULT_ACTION,
  SITES_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
/*sitemaps/city/*/
export function sitesAction(city){
	return {
		type: SITES_ACTION,
		city,
	}
};
