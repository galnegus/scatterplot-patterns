export const TOGGLE_THEME = 'toggle theme';
export const SET_MAX_CATEGORIES = 'set max categories';
export const UPDATE_CATEGORY_COLOR = 'update category color';

export const toggleTheme = () => ({
  type: TOGGLE_THEME
});

export const setMaxCategories = (value) => ({
  type: SET_MAX_CATEGORIES,
  value
});

export const updateCategoryColor = (category, color) => ({
  type: UPDATE_CATEGORY_COLOR,
  category,
  color
});
