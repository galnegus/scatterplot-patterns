import React, { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { FormGroup, Slider, Switch, Alignment } from '@blueprintjs/core';
import { HuePicker } from 'react-color';

const debounceTime = 100;

const updateGamma1 = _debounce((setPattern, newValue) => setPattern({ gamma1: newValue }), debounceTime);
const updateGamma2 = _debounce((setPattern, newValue) => setPattern({ gamma2: newValue }), debounceTime);
const updateMinValue = _debounce((setPattern, newValue) => setPattern({ minValue: newValue }), debounceTime);
const updateCyclesPerSecond = _debounce((setPattern, newValue) => setPattern({ cyclesPerSecond: newValue }), debounceTime);
const updateHsvColor = _debounce((setPattern, newValue) => setPattern({ hsvColor: newValue }), debounceTime);

export default function ClusterOptions({ pattern, setPattern }) {
  const [gamma1, setGamma1] = useState(pattern.gamma1);
  const [gamma2, setGamma2] = useState(pattern.gamma2);
  const [minValue, setMinValue] = useState(pattern.minValue);
  const [cyclesPerSecond, setCyclesPerSecond] = useState(pattern.cyclesPerSecond);
  const [hsvColor, setHsvColor] = useState(pattern.hsvColor);

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });
  const gamma1Change = (newValue) => {
    setGamma1(newValue);
    updateGamma1(setPattern, newValue);
  };
  const gamma2Change = (newValue) => {
    setGamma2(newValue);
    updateGamma2(setPattern, newValue);
  };
  const minValueChange = (newValue) => {
    setMinValue(newValue);
    updateMinValue(setPattern, newValue);
  };
  const cyclesPerSecondChange = (newValue) => {
    setCyclesPerSecond(newValue);
    updateCyclesPerSecond(setPattern, newValue);
  };
  const hsvColorChange = (newColor) => {
    const hsvArr = [newColor.hsv.h / 360, newColor.hsv.s, newColor.hsv.v];
    setHsvColor(hsvArr);
    updateHsvColor(setPattern, hsvArr);
  }

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
          max={50}
          labelPrecision={1}
          labelStepSize={50}
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
          max={50}
          labelPrecision={1}
          labelStepSize={50}
          value={gamma2}
          onChange={gamma2Change}
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
          stepSize={0.1}
          min={0}
          max={10}
          labelPrecision={1}
          labelStepSize={10}
          value={cyclesPerSecond}
          onChange={cyclesPerSecondChange}
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
