import { TOGGLE_THEME } from '../actions';

export default function isDarkTheme(state = true, action) {
  if (action.type === TOGGLE_THEME)
    return !state;
  return state;
}
