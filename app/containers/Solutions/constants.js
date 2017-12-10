/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SITES_ACTION = 'app/Solutions/SITES_ACTION';
export const SITES_SUCCESS_ACTION = 'app/Solutions/SITES_SUCCESS_ACTION';
export const SITES_FAIL_ACTION = 'app/Solutions/SITES_FAIL_ACTION';

export const SOLUTION_FAIL_ACTION = 'app/Solutions/SOLUTION_FAIL_ACTION';
export const SOLUTION_ACTION = 'app/Solutions/SOLUTION_ACTION';
export const SOLUTION_SUCCESS_ACTION = 'app/Solutions/SOLUTION_SUCCESS_ACTION';
