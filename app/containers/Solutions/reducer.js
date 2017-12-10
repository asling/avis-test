/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  CHANGE_USERNAME,
  DEFAULT_ACTION,
  SITES_SUCCESS_ACTION,
  SITES_FAIL_ACTION,
  SITES_ACTION,
  SOLUTION_ACTION,
  SOLUTION_SUCCESS_ACTION,
  SOLUTION_FAIL_ACTION,
} from './constants';


// The initial state of the App
const initialState = fromJS({
  username: '',
  sites: [],
  city: '',
  date: "",
  stype: "",
  solution: '',
});

function solutionsReducer(state = initialState, action) {
  switch (action.type) {
    case SITES_ACTION : 
      return state.set("city",action.city);
    case SITES_SUCCESS_ACTION:
      return state.set("sites",action.sites);
    case SITES_FAIL_ACTION:
      return state.set("sites",action.err);
    case SOLUTION_ACTION: 
      return state.set("date",action.date).set("stype",action.stype);
    case SOLUTION_SUCCESS_ACTION :
      return state.set("solution",action.solution);
    case SOLUTION_FAIL_ACTION:
      return state.set("solution",action.msg);
    default:
      return state;
  }
}

export default solutionsReducer;

