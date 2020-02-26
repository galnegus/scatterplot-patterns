import { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import _isFunction from 'lodash-es/isFunction';
import { debounceTime } from './constants';

const updateValue = _debounce((setPattern, optionName, newValue) => setPattern({ [optionName]: newValue }), debounceTime);
export default function useSlider(optionName, defaultValue, setPattern, processNewValueFn = null) {
  const [value, setValue] = useState(defaultValue);
  const onChange = (newValue) => {
    if (_isFunction(processNewValueFn)) newValue = processNewValueFn(newValue);
    setValue(newValue);
    updateValue(setPattern, optionName, newValue);
  };
  return [value, onChange];
}
