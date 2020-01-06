import React, { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { FormGroup, Slider, Switch, Alignment, Divider } from '@blueprintjs/core';
import { defaultValues, colorsCool, colorsLame } from './constants';

const debounceTime = 500;

const updatePointSize = _debounce((scatterplot, newValue) => scatterplot.set({ pointSize: newValue }), debounceTime);
const updateLineWidth = _debounce((setOptions, newValue) => setOptions({ lineWidth: newValue }), debounceTime);
const updateA = _debounce((setOptions, newValue) => setOptions({ a: newValue }), debounceTime);
const updateB = _debounce((setOptions, newValue) => setOptions({ b: newValue }), debounceTime);
const updateN = _debounce((setOptions, newValue) => setOptions({ n: newValue }), debounceTime);
const updateContourDropoff = _debounce((setOptions, newValue) => setOptions({ contourDropoff: newValue }), debounceTime);

function renderPercentage(val) {
  return `${Math.round(val * 100)}%`;
}

export default function WingletsOptions({ scatterplot }) {
  const [pointSize, setPointSize] = useState(defaultValues.pointSize);
  const [lineWidth, setLineWidth] = useState(defaultValues.lineWidth);
  const [a, setA] = useState(defaultValues.a);
  const [b, setB] = useState(defaultValues.b);
  const [n, setN] = useState(defaultValues.n);
  const [contourDropoff, setContourDropoff] = useState(defaultValues.contourDropoff);

  const setOptions = (options) => {
    if (scatterplot !== null) {
      scatterplot.draw();
      scatterplot.setWingletsOptions(options);
    }
  };

  const showContoursChange = (event) => setOptions({ showContours: event.target.checked });
  const showWingletsChange = (event) => setOptions({ showWinglets: event.target.checked });
  const useColorsChange = (event) => scatterplot.set({ colors: event.target.checked ? colorsCool : colorsLame });
  const pointSizeChange = (newValue) => {
    setPointSize(newValue);
    updatePointSize(scatterplot, newValue);
  };
  const lineWidthChange = (newValue) => { 
    setLineWidth(newValue);
    updateLineWidth(setOptions, newValue);
  };
  const aChange = (newValue) => { 
    setA(newValue);
    updateA(setOptions, newValue);
  };
  const bChange = (newValue) => { 
    setB(newValue);
    updateB(setOptions, newValue);
  };
  const nChange = (newValue) => { 
    setN(newValue);
    updateN(setOptions, newValue);
  };
  const contourDropoffChange = (newValue) => { 
    setContourDropoff(newValue);
    updateContourDropoff(setOptions, newValue);
  };

  return (
    <div>
      <Divider />
      <FormGroup>
        <Switch
          defaultChecked={defaultValues.showContours}
          label="Show contours"
          onChange={showContoursChange}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
        />
        <Switch
          defaultChecked={defaultValues.showWinglets}
          label="Show winglets"
          onChange={showWingletsChange}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
        />
        <Switch
          defaultChecked={defaultValues.useColors}
          label="Use colors"
          onChange={useColorsChange}
          innerLabel="no"
          innerLabelChecked="yes"
          alignIndicator={Alignment.RIGHT}
        />
      </FormGroup>
      <FormGroup
        label={"Point size"}
        labelInfo={`(default: ${defaultValues.pointSize})`}
      >
        <Slider
          stepSize={1}
          min={0}
          max={10}
          labelStepSize={2.5}
          value={pointSize}
          onChange={pointSizeChange}
          fill={true}
        />
      </FormGroup>
      <FormGroup
        label={"Winglet line width"}
        labelInfo={`(default: ${defaultValues.lineWidth})`}
      >
        <Slider
          stepSize={0.2}
          min={0}
          max={5}
          labelStepSize={1}
          value={lineWidth}
          onChange={lineWidthChange}
          fill={true}
        />
      </FormGroup>
      <Divider />
       <FormGroup
        label={"Contour drop off %"}
          labelInfo={`(default: ${renderPercentage(defaultValues.contourDropoff)})`}
      >
        <Slider
          stepSize={0.001}
          min={0}
          max={0.2}
          labelStepSize={0.05}
          value={contourDropoff}
          onChange={contourDropoffChange}
          labelRenderer={renderPercentage}
          fill={true}
        />
      </FormGroup>

      <FormGroup
        label={(
          <span className="bp3-text-muted">
            Winglet length = <b>A</b> + <b>B</b> * s(i)^<b>N</b>
          </span>
        )}
        style={{ textAlign: 'center' }}
      >
        <FormGroup
          label="A"
          labelInfo={`(default: ${defaultValues.a})`}
          style={{ textAlign: 'left' }}
        >
          <Slider
            stepSize={0.001}
            min={0}
            max={0.1}
            labelStepSize={0.025}
            value={a}
            onChange={aChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="B"
          labelInfo={`(default: ${defaultValues.b})`}
          style={{ textAlign: 'left' }}
        >
          <Slider
            stepSize={0.01}
            min={0}
            max={1}
            labelStepSize={0.25}
            value={b}
            onChange={bChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="N"
          labelInfo={`(default: ${defaultValues.n})`}
          style={{ textAlign: 'left' }}
        >
          <Slider
            stepSize={0.5}
            min={0}
            max={3}
            labelStepSize={1}
            value={n}
            onChange={nChange}
            fill={true}
          />
        </FormGroup>
      </FormGroup>

      <Divider />

      <p style={{ textAlign: 'center' }}>
        <b>Note: </b> 
        <span className="bp3-text-muted">Each slider has a 500ms debounce to avoid clogging the system.</span>
      </p>
    </div>
  );
}
