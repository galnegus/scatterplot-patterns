import React from 'react';
import { FormGroup, Slider, Switch, Alignment } from '@blueprintjs/core';
import { HuePicker } from 'react-color';
import useSlider from './useSlider';

export default function ClusterOptions({ pattern, setPattern }) {
  const [gamma1, gamma1Change] = useSlider('gamma1', pattern.gamma1, setPattern);
  const [gamma2, gamma2Change] = useSlider('gamma2', pattern.gamma2, setPattern);
  const [maxValue, maxValueChange] = useSlider('maxValue', pattern.maxValue, setPattern);
  const [minValue, minValueChange] = useSlider('minValue', pattern.minValue, setPattern);
  const [cyclesPerSecond, cyclesPerSecondChange] = useSlider('cyclesPerSecond', pattern.cyclesPerSecond, setPattern);
  const [nSpokes, nSpokesChange] = useSlider('nSpokes', pattern.nSpokes, setPattern);
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
          innerLabel="Counter-clockwise"
          innerLabelChecked="Clockwise"
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
          labelPrecision={2}
          labelStepSize={1}
          value={maxValue}
          onChange={maxValueChange}
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
