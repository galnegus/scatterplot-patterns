import React from 'react';
import { FormGroup, Slider, Switch, Alignment } from '@blueprintjs/core';
import { CirclePicker } from 'react-color';
import { defaultColors } from './reducers/categoryColors';
import useSlider from './useSlider';
import useColorPicker from './useColorPicker';

function renderPercentage(val) {
  return `${Math.round(val * 100)}%`;
}

function renderSeconds(val) {
  return `${val.toPrecision(2)}s`;
}

export default function PulseOptions({ pattern, setPattern }) {
  const [a, aChange] = useSlider(pattern, setPattern, 'a');
  const [c1, c1Change] = useSlider(pattern, setPattern, 'c1');
  const [c2, c2Change] = useSlider(pattern, setPattern, 'c2');
  const [minValue, minValueChange] = useSlider(pattern, setPattern, 'minValue');
  const [phaseShift, phaseShiftChange] = useSlider(pattern, setPattern, 'phaseShift');
  const [cyclesPerSecond, cyclesPerSecondChange] = useSlider(pattern, setPattern, 'cyclesPerSecond');
  const [wavesPerCycle, wavesPerCycleChange] = useSlider(pattern, setPattern, 'wavesPerCycle');
  const [curve, curveChange] = useSlider(pattern, setPattern, 'curve');
  const [color, colorChange] = useColorPicker(pattern);
  const [hueVariation, hueVariationChange] = useSlider(pattern, setPattern, 'hueVariation');
  const [hueVariationPeriod, hueVariationPeriodChange] = useSlider(pattern, setPattern, 'hueVariationPeriod');

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });
  const invertChange = (event) => setPattern({ invert: event.target.checked ? 1 : 0 });

  const direction = pattern.direction === 1;
  const invert = pattern.invert === 1;

  return (
    <>
      <span className="option-title bp3-text-muted">Wave Parameters</span>
      <FormGroup>
        <Switch
          checked={direction}
          label="Direction"
          onChange={directionChange}
          innerLabel="In"
          innerLabelChecked="Out"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup>
        <Switch
          checked={invert}
          label="Invert"
          onChange={invertChange}
          innerLabel="No"
          innerLabelChecked="Yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup
        label="a"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelPrecision={2}
          labelStepSize={1}
          value={a}
          onChange={aChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="c1"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelPrecision={2}
          labelStepSize={1}
          value={c1}
          onChange={c1Change}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="c2"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelPrecision={2}
          labelStepSize={1}
          value={c2}
          onChange={c2Change}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Min value"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          labelRenderer={renderPercentage}
          value={minValue}
          onChange={minValueChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Phase shift"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          value={phaseShift}
          onChange={phaseShiftChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Cycles/s"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={5}
          labelPrecision={1}
          labelStepSize={5}
          value={cyclesPerSecond}
          onChange={cyclesPerSecondChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Waves/cycle"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={5}
          labelPrecision={1}
          labelStepSize={5}
          value={wavesPerCycle}
          onChange={wavesPerCycleChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Curve"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={-5}
          max={5}
          labelStepSize={10}
          value={curve}
          onChange={curveChange}
          fill={true}
        />
      </FormGroup>
      <span className="option-title bp3-text-muted">Color Parameters</span>
      <FormGroup
        label="Color"
        inline={true}
      >
        <CirclePicker
          color={color}
          colors={defaultColors}
          onChange={colorChange}
          circleSize={14}
          circleSpacing={1}
          width={150}
        />
      </FormGroup>
      <FormGroup
        label="Hue amp."
        inline={true}
      >
        <Slider
          stepSize={0.005}
          min={0}
          max={0.2}
          labelPrecision={2}
          labelStepSize={0.2}
          labelRenderer={renderPercentage}
          value={hueVariation}
          onChange={hueVariationChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Hue period"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={5}
          labelStepSize={5}
          labelRenderer={renderSeconds}
          value={hueVariationPeriod}
          onChange={hueVariationPeriodChange}
          fill={true}
        />
      </FormGroup>
    </>
  );
}
