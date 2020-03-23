import { combineReducers } from 'redux';
import categoryColors from './categoryColors';
import isDarkTheme from './isDarkTheme';
import isLoading from './isLoading';
import maxCategories from './maxCategories';

export default combineReducers({
  categoryColors,
  isDarkTheme,
  isLoading,
  maxCategories
});
