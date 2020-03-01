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

export default function RadarOptions({ pattern, setPattern }) {
  const [gamma1, gamma1Change] = useSlider('gamma1', pattern.gamma1, setPattern);
  const [gamma2, gamma2Change] = useSlider('gamma2', pattern.gamma2, setPattern);
  const [maxValue, maxValueChange] = useSlider('maxValue', pattern.maxValue, setPattern);
  const [minValue, minValueChange] = useSlider('minValue', pattern.minValue, setPattern);
  const [cyclesPerSecond, cyclesPerSecondChange] = useSlider('cyclesPerSecond', pattern.cyclesPerSecond, setPattern);
  const [nSpokes, nSpokesChange] = useSlider('nSpokes', pattern.nSpokes, setPattern);
  const [color, colorChange] = useColorPicker(pattern, setPattern);
  const [hueVariation, hueVariationChange] = useSlider('hueVariation', pattern.hueVariation, setPattern);
  const [hueVariationPeriod, hueVariationPeriodChange] = useSlider('hueVariationPeriod', pattern.hueVariationPeriod, setPattern);

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });
  const invertChange = (event) => setPattern({ invert: event.target.checked ? 1 : 0 });

  return (
    <>
      <span className="option-title bp3-text-muted">Rotation Parameters</span>
      <FormGroup>
        <Switch
          defaultChecked={pattern.direction === 1}
          label="Direction"
          onChange={directionChange}
          innerLabel="Counter-clockwise"
          innerLabelChecked="Clockwise"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup>
        <Switch
          defaultChecked={pattern.invert === 1}
          label="Invert"
          onChange={invertChange}
          innerLabel="No"
          innerLabelChecked="Yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup
        label="gamma1"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={25}
          labelPrecision={1}
          labelStepSize={25}
          value={gamma1}
          onChange={gamma1Change}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="gamma2"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={25}
          labelPrecision={1}
          labelStepSize={25}
          value={gamma2}
          onChange={gamma2Change}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label="Max value"
        inline={true}
      >
        <Slider
          stepSize={0.01}
          min={0}
          max={1}
          labelStepSize={1}
          value={maxValue}
          onChange={maxValueChange}
          labelRenderer={renderPercentage}
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
          value={minValue}
          onChange={minValueChange}
          labelRenderer={renderPercentage}
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
        label='"Spokes"'
        inline={true}
      >
        <Slider
          stepSize={1}
          min={1}
          max={10}
          labelStepSize={9}
          value={nSpokes}
          onChange={nSpokesChange}
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
