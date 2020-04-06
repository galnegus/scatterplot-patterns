import { useState, useEffect } from 'react';
import _throttle from 'lodash-es/throttle';
import _isFunction from 'lodash-es/isFunction';
import { throttleTime } from './constants';

//const updateValue = _debounce((set, optionName, newValue) => set({ [optionName]: newValue }), debounceTime);
const updateValue = _throttle((set, optionName, newValue) => set({ [optionName]: newValue }), throttleTime);

export default function useSlider(dataObj, set, optionName, processNewValueFn = null) {
  const [value, setValue] = useState(dataObj[optionName]);
  const onChange = (newValue) => {
    if (_isFunction(processNewValueFn)) newValue = processNewValueFn(newValue);
    setValue(newValue);
    updateValue(set, optionName, newValue);
  };

  // this makes it so that if the dataObj[optionName] changes, update the underlying state too! (useful for imports)
  useEffect(() => {
    if (value !== dataObj[optionName]) setValue(dataObj[optionName]);
  }, [dataObj[optionName]]);

  return [value, onChange];
}
