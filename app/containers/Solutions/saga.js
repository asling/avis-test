/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';

import request from 'utils/request';
import { selectSolutionsDomain, selectSites } from './selectors';
import { getSitesAction, getSitesSuccessAction, getSitesFailAction } from './actions';
import {
	SITES_SUCCESS_ACTION,
	SITES_FAIL_ACTION,
	SITES_ACTION,
} from './constants';

/**
 * Github repos request/response handler
 */
export function* getSites(action) {
  // Select username from store
  const { city } = action.city; 
  const requestURL = `localhost:5000/sitemaps/city/${city}`;

  try {
    const sites = yield call(request, requestURL);
    yield put(getSitesSuccessAction(sites));
  } catch (err) {
    yield put(getSitesFailAction(err));
  }
}

export function* takeSites(action){
	 yield takeLatest(SITES_ACTION, getSites);

/**
 * Root saga manages watcher lifecycle
 */
// export default function* githubData() {
//   // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
//   // By using `takeLatest` only the result of the latest API call is applied.
//   // It returns task descriptor (just like fork) so we can continue execution
//   // It will be cancelled automatically on component unmount
//   yield takeLatest(LOAD_REPOS, getRepos);
// }

export default {
	takeSites,
}

