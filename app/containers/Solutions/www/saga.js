/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';

import request from 'utils/request';
import { makeCity, makeSelectSites } from './selectors';
import { getSitesSuccessAction, getSitesFailAction } from './actions';
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
  console.log("xxxxx");
  const { city } = makeCity();
  const requestURL = `localhost:5000/sitemaps/city/${city}`;

  try {
    const sites = yield call(request, requestURL);
    yield put(getSitesSuccessAction(sites));
  } catch (err) {
    yield put(getSitesFailAction(err));
  }
}

export function* takeSites(){
  console.log("action");
   yield takeLatest(SITES_ACTION, getSites);
}


export default function*(ar){
  yield takeSites(ar);
}


