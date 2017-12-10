/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest,takeEvery,take } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectUsername, makeCity ,makeSolutionParam } from 'containers/Solutions/selectors';
import { sitesAction, getSitesSuccessAction, getSitesFailAction, solutionAction, solutionSuccessAction, solutionFailAction} from './actions';
import {
  SITES_SUCCESS_ACTION,
  SITES_FAIL_ACTION,
  SITES_ACTION,
  SOLUTION_ACTION,
  SOLUTION_SUCCESS_ACTION,
  SOLUTION_FAIL_ACTION,
} from './constants';
/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store

  console.log("fsfdsfsfsdf");
  const username = yield select(makeSelectUsername());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

/**


/**
 * Github repos request/response handler
 */
export function* getSites(action) {
  // Select username from store
  console.log("xxxxx");
  const city = yield select(makeCity());
  const requestURL = `localhost:5000/sitemaps/city/${city}`;

  try {
    const sites = yield call(request, requestURL);
    yield put(getSitesSuccessAction(sites));
  } catch (err) {
    yield put(getSitesFailAction(err));
  }
}

export function* getSolution() {
  // Select username from store
  const { date, stype} = yield select(makeSolutionParam());
  const requestURL = `localhost:5000/solution?/date=${date}&stype=${stype}`;

  try {
    const solution = yield call(request, requestURL);
    yield put(solutionSuccessAction(solution));
  } catch (err) {
    yield put(solutionFailAction(err));
  }
}

export function* takeSites(){
  console.log("action");
   yield takeLatest(SITES_ACTION, getSites);
}

export function* takeSolution(){
  yield takeLatest(SOLUTION_ACTION, getSolution);
}

// export  function* githubData() {

//   console.log('fdfsdf');

//   // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
//   // By using `takeLatest` only the result of the latest API call is applied.
//   // It returns task descriptor (just like fork) so we can continue execution
//   // It will be cancelled automatically on component unmount
//   yield takeEvery(LOAD_REPOS, getRepos);
// }

export default function*(ar){
  yield takeSites(ar);

}




