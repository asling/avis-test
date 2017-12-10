
import { fromJS } from 'immutable';
import solutionsReducer from '../reducer';

describe('solutionsReducer', () => {
  it('returns the initial state', () => {
    expect(solutionsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
