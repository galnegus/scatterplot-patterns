import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { FormGroup, Slider, Switch, Alignment, Divider } from '@blueprintjs/core';
import { defaultValues } from './constants';
import { toggleTheme } from './actions';
import useSlider from './useSlider';

function renderPercentage(val) {
  return `${Math.round(val * 100)}%`;
}

export default function ScatterplotOptions({ scatterplot }) {
  const [pointSize, pointSizeChange] = useSlider('pointSize', defaultValues.pointSize, scatterplot && scatterplot.set);
  const [animateBy, animateByChange] = useSlider('animateBy', defaultValues.animateBy, scatterplot && scatterplot.set);
  const [animateDepth, setAnimateDepth] = useState(false);

  const isDarkTheme = useSelector((state) => state.isDarkTheme);
  const dispatch = useDispatch();

  const animateDepthChange = (event) => {
    setAnimateDepth(event.target.checked);
    scatterplot && scatterplot.set({ animateDepth: event.target.checked });
    if (event.target.checked)
      animateByChange([0, 0, 1]);
    else
      animateByChange([0, 1, 0]);
  };

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
      <span className="option-title bp3-text-muted">Animate by</span>

      <FormGroup
        label="Saturation"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          labelRenderer={renderPercentage}
          value={animateBy[0]}
          onChange={(newSat) => animateByChange([newSat, animateBy[1], animateBy[2]])}
          fill={true}
        />
      </FormGroup>

      <FormGroup
        label="Value"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          labelRenderer={renderPercentage}
          value={animateBy[1]}
          onChange={(newVal) => animateByChange([animateBy[0], newVal, animateBy[2]])}
          fill={true}
        />
      </FormGroup>

      <FormGroup
        label="Alpha"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          labelRenderer={renderPercentage}
          value={animateBy[2]}
          onChange={(newAlpha) => animateByChange([animateBy[0], animateBy[1], newAlpha])}
          fill={true}
          disabled={animateDepth}
        />
      </FormGroup>
       <FormGroup>
        <Switch
          checked={animateDepth}
          label="Depth (experimental)"
          onChange={animateDepthChange}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
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
