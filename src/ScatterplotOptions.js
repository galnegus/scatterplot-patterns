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
  const [animationMix, animationMixChange] = useSlider('animationMix', defaultValues.animationMix, scatterplot && scatterplot.set);
  const [animateDepth, setAnimateDepth] = useState(false);

  const showPatternsChange = (event) => scatterplot.set({ 'showPatterns': event.target.checked });
  const useColorsChange = (event) => scatterplot.set({ 'useColors': event.target.checked });

  const isDarkTheme = useSelector((state) => state.isDarkTheme);
  const dispatch = useDispatch();

  const animateDepthChange = (event) => {
    setAnimateDepth(event.target.checked);
    scatterplot && scatterplot.set({ animateDepth: event.target.checked });
    if (event.target.checked)
      animationMixChange([0, 0, 1]);
    else
      animationMixChange([0, 1, 0]);
  };

  return (
    <div>
      <Divider />
      <FormGroup>
        <Switch
          defaultChecked={isDarkTheme}
          label="Dark theme"
          onChange={() => dispatch(toggleTheme())}
          innerLabel="No"
          innerLabelChecked="Yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup>
        <Switch
          defaultChecked={defaultValues.useColors}
          label="Use colors"
          onChange={useColorsChange}
          innerLabel="No"
          innerLabelChecked="Yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup>
        <Switch
          defaultChecked={defaultValues.showPatterns}
          label="Show patterns"
          onChange={showPatternsChange}
          innerLabel="No"
          innerLabelChecked="Yes"
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
      <span className="option-title bp3-text-muted">Animation mix</span>

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
          value={animationMix[0]}
          onChange={(newSat) => animationMixChange([newSat, animationMix[1], animationMix[2]])}
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
          value={animationMix[1]}
          onChange={(newVal) => animationMixChange([animationMix[0], newVal, animationMix[2]])}
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
          value={animationMix[2]}
          onChange={(newAlpha) => animationMixChange([animationMix[0], animationMix[1], newAlpha])}
          fill={true}
          disabled={animateDepth}
        />
      </FormGroup>
       <FormGroup>
        <Switch
          checked={animateDepth}
          label="Depth (experimental)"
          onChange={animateDepthChange}
          innerLabel="No"
          innerLabelChecked="Yes"
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
