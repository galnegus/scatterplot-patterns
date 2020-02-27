import { useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { updateCategoryColor } from './actions';

export default function useColorPicker(pattern, setPattern) {
  const dispatch = useDispatch();
  const categoryColors = useSelector((state) => state.categoryColors, shallowEqual);
  const [color, setColor] = useState(categoryColors[pattern.category]);
  const colorChange = (newColor) => {
    setPattern({ hsvColor: [newColor.hsv.h / 360, newColor.hsv.s, newColor.hsv.v]});
    dispatch(updateCategoryColor(pattern.category, newColor.hex));
    setColor(newColor.hex);
  };

  return [color, colorChange];
}
