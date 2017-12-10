/*
 *
 * Solutions reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SITES_SUCCESS_ACTION,
  SITES_FAIL_ACTION,
} from './constants';

import {
	getSitesSuccessAction,
	getSitesFailAction,
} from './actions';

const initialState = fromJS({
	sites: [],
  city: '',
});

function solutionsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    
    case SITES_ACTION : 
      return state.set("city");
    case SITES_SUCCESS_ACTION:
      return state.set("sites",action.sites);
    case SITES_FAIL_ACTION:
      return state.set("sites",action.err);
    default:
      return state;
  }
}

export default solutionsReducer;
