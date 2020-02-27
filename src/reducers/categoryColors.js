import { UPDATE_CATEGORY_COLOR } from '../actions';

// https://blueprintjs.com/docs/#core/colors
export const defaultColors = [
  "#DB2C6F",
  "#2965CC",
  "#29A634",
  "#D99E0B",
  "#D13913",
  "#8F398F",
  "#00B3A4",
  "#9BBF30",
  "#96622D",
  "#7157D9"
];

export default function categoryColors(state = defaultColors, action) {
  if (action.type === UPDATE_CATEGORY_COLOR) {
    const shallowCopy = [...state];
    shallowCopy[action.category] = action.color;
    return shallowCopy;
  }
  return state;
}
