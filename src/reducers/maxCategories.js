import { SET_MAX_CATEGORIES } from '../actions';

export default function maxCategories(state = 0, action) {
  if (action.type === SET_MAX_CATEGORIES)
    return action.value;
  return state;
}
