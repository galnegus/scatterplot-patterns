import { UPDATE_CATEGORY_COLOR } from '../actions';

// http://colorbrewer2.org/?type=qualitative&scheme=Set1&n=9
export const defaultColors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999', '#0fc'];

// https://blueprintjs.com/docs/#core/colors
/*export const defaultColors = [
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
];*/

export default function categoryColors(state = defaultColors, action) {
  if (action.type === UPDATE_CATEGORY_COLOR) {
    const shallowCopy = [...state];
    shallowCopy[action.category] = action.color;
    return shallowCopy;
  }
  return state;
}
