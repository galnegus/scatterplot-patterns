import { combineReducers } from 'redux';
import categoryColors from './categoryColors';
import isDarkTheme from './isDarkTheme';
import maxCategories from './maxCategories';

export default combineReducers({
  categoryColors,
  isDarkTheme,
  maxCategories
});
