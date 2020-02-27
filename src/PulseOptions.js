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
  const [a, aChange] = useSlider('a', pattern.a, setPattern);
  const [c1, c1Change] = useSlider('c1', pattern.c1, setPattern);
  const [c2, c2Change] = useSlider('c2', pattern.c2, setPattern);
  const [minValue, minValueChange] = useSlider('minValue', pattern.minValue, setPattern);
  const [cyclesPerSecond, cyclesPerSecondChange] = useSlider('cyclesPerSecond', pattern.cyclesPerSecond, setPattern);
  const [wavesPerCycle, wavesPerCycleChange] = useSlider('wavesPerCycle', pattern.wavesPerCycle, setPattern);
  const [color, colorChange] = useColorPicker(pattern, setPattern);
  const [hueVariation, hueVariationChange] = useSlider('hueVariation', pattern.hueVariation, setPattern);
  const [hueVariationPeriod, hueVariationPeriodChange] = useSlider('hueVariationPeriod', pattern.hueVariationPeriod, setPattern);

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });

  return (
    <>
      <FormGroup>
        <Switch
          defaultChecked={pattern.direction === 1}
          label="Direction"
          onChange={directionChange}
          innerLabel="In"
          innerLabelChecked="Out"
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
