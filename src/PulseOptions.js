import React from 'react';
import { FormGroup, Slider, Switch, Alignment } from '@blueprintjs/core';
import { HuePicker } from 'react-color';
import useSlider from './useSlider';

export default function PulseOptions({ pattern, setPattern }) {
  const [a, aChange] = useSlider('a', pattern.a, setPattern);
  const [c1, c1Change] = useSlider('c1', pattern.c1, setPattern);
  const [c2, c2Change] = useSlider('c2', pattern.c2, setPattern);
  const [minValue, minValueChange] = useSlider('minValue', pattern.minValue, setPattern);
  const [cyclesPerSecond, cyclesPerSecondChange] = useSlider('cyclesPerSecond', pattern.cyclesPerSecond, setPattern);
  const [wavesPerCycle, wavesPerCycleChange] = useSlider('wavesPerCycle', pattern.wavesPerCycle, setPattern);
  const [hsvColor, hsvColorChange] = useSlider('hsvColor', pattern.hsvColor, setPattern, (newColor) => [newColor.hsv.h / 360, newColor.hsv.s, newColor.hsv.v]);

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });

  const hsvObj = { h: hsvColor[0] * 360, s: hsvColor[1], v: hsvColor[2] };

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
          labelPrecision={2}
          labelStepSize={1}
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
        label="Hue"
        inline={true}
      />
      <HuePicker
        color={hsvObj}
        onChange={hsvColorChange}
        width={243}
      />
    </>
  );
}
