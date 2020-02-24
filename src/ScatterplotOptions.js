import React, { useState, useContext } from 'react';
import _debounce from 'lodash-es/debounce';
import { FormGroup, Slider, Switch, Alignment, Divider } from '@blueprintjs/core';
import { defaultValues, colorsCool, colorsLame } from './constants';
import { ThemeContext } from './contexts';

const debounceTime = 100;

const updatePointSize = _debounce((scatterplot, newValue) => scatterplot.set({ pointSize: newValue }), debounceTime);

export default function ScatterplotOptions({ scatterplot }) {
  const [pointSize, setPointSize] = useState(defaultValues.pointSize);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const useColorsChange = (event) => scatterplot.set({ colors: event.target.checked ? colorsCool : colorsLame });
  const pointSizeChange = (newValue) => {
    setPointSize(newValue);
    updatePointSize(scatterplot, newValue);
  };

  return (
    <div>
      <Divider />
      <FormGroup>
        <Switch
          defaultChecked={defaultValues.useColors}
          label="Use colors"
          onChange={useColorsChange}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
        />
        <Switch
          defaultChecked={isDarkTheme}
          label="Dark theme"
          onChange={toggleTheme}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup
        label={"Point size"}
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={10}
          labelStepSize={10}
          labelPrecision={1}
          value={pointSize}
          onChange={pointSizeChange}
          fill={true}
        />
      </FormGroup>
      
      <Divider />

      <p style={{ textAlign: 'center' }}>
        <b>Note: </b> 
        <span className="bp3-text-muted">Each slider has a 100ms debounce to avoid clogging the system.</span>
      </p>
    </div>
  );
}
