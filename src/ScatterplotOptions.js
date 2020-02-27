import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { FormGroup, Slider, Switch, Alignment, Divider } from '@blueprintjs/core';
import { defaultValues } from './constants';
import { toggleTheme } from './actions';
import useSlider from './useSlider';

export default function ScatterplotOptions({ scatterplot }) {
  const [pointSize, pointSizeChange] = useSlider('pointSize', defaultValues.pointSize, scatterplot && scatterplot.set);
  const isDarkTheme = useSelector((state) => state.isDarkTheme);
  const dispatch = useDispatch();

  //const useColorsChange = (event) => scatterplot.set({ colors: event.target.checked ? colorsCool : colorsLame });

  return (
    <div>
      <Divider />
      <FormGroup>
        <Switch
          defaultChecked={isDarkTheme}
          label="Dark theme"
          onChange={() => dispatch(toggleTheme())}
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
