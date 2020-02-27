import { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import _isFunction from 'lodash-es/isFunction';
import { debounceTime } from './constants';

const updateValue = _debounce((set, optionName, newValue) => set({ [optionName]: newValue }), debounceTime);
export default function useSlider(optionName, defaultValue, set, processNewValueFn = null) {
  const [value, setValue] = useState(defaultValue);
  const onChange = (newValue) => {
    if (_isFunction(processNewValueFn)) newValue = processNewValueFn(newValue);
    setValue(newValue);
    updateValue(set, optionName, newValue);
  };
  return [value, onChange];
}
