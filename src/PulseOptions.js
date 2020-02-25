import React, { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { FormGroup, Slider, Switch, Alignment } from '@blueprintjs/core';
import { HuePicker } from 'react-color';

const debounceTime = 100;

const updateA = _debounce((setPattern, newValue) => setPattern({ a: newValue }), debounceTime);
const updateC1 = _debounce((setPattern, newValue) => setPattern({ c1: newValue }), debounceTime);
const updateC2 = _debounce((setPattern, newValue) => setPattern({ c2: newValue }), debounceTime);
const updateMinValue = _debounce((setPattern, newValue) => setPattern({ minValue: newValue }), debounceTime);
const updateCyclesPerSecond = _debounce((setPattern, newValue) => setPattern({ cyclesPerSecond: newValue }), debounceTime);
const updateWavesPerCycle = _debounce((setPattern, newValue) => setPattern({ wavesPerCycle: newValue }), debounceTime);
const updateHsvColor = _debounce((setPattern, newValue) => setPattern({ hsvColor: newValue }), debounceTime);

export default function PulseOptions({ pattern, setPattern }) {
  const [a, setA] = useState(pattern.a);
  const [c1, setC1] = useState(pattern.c1);
  const [c2, setC2] = useState(pattern.c2);
  const [minValue, setMinValue] = useState(pattern.minValue);
  const [cyclesPerSecond, setCyclesPerSecond] = useState(pattern.cyclesPerSecond);
  const [wavesPerCycle, setWavesPerCycle] = useState(pattern.wavesPerCycle);
  const [hsvColor, setHsvColor] = useState(pattern.hsvColor);

  const directionChange = (event) => setPattern({ direction: event.target.checked ? 1 : -1 });
  const aChange = (newValue) => {
    setA(newValue);
    updateA(setPattern, newValue);
  };
  const c1Change = (newValue) => {
    setC1(newValue);
    updateC1(setPattern, newValue);
  };
  const c2Change = (newValue) => {
    setC2(newValue);
    updateC2(setPattern, newValue);
  };
  const minValueChange = (newValue) => {
    setMinValue(newValue);
    updateMinValue(setPattern, newValue);
  };
  const cyclesPerSecondChange = (newValue) => {
    setCyclesPerSecond(newValue);
    updateCyclesPerSecond(setPattern, newValue);
  };
  const wavesPerCycleChange = (newValue) => {
    setWavesPerCycle(newValue);
    updateWavesPerCycle(setPattern, newValue);
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
        label="Waves/cycle"
        inline={true}
      >
        <Slider
          stepSize={0.1}
          min={0}
          max={10}
          labelPrecision={1}
          labelStepSize={10}
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
