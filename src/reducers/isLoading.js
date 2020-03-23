import { SET_LOADING } from '../actions';

export default function isLoading(state = false, action) {
  if (action.type === SET_LOADING)
    return action.value;
  return state;
}
