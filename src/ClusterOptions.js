import React, { useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { FormGroup, Slider, Collapse, Divider, Button, Intent } from '@blueprintjs/core';
import ClusterHeader from './ClusterHeader';

const debounceTime = 500;

const updateX = _debounce((setCluster, newValue) => setCluster({ x: newValue }), debounceTime);
const updateY = _debounce((setCluster, newValue) => setCluster({ y: newValue }), debounceTime);
const updateSigma = _debounce((setCluster, newValue) => setCluster({ sigma: newValue }), debounceTime);
const updateAngle = _debounce((setCluster, newValue) => setCluster({ angle: newValue }), debounceTime);
const updateAmplitude = _debounce((setCluster, newValue) => setCluster({ amplitude: newValue }), debounceTime);
const updateN = _debounce((setCluster, newValue) => setCluster({ n: newValue }), debounceTime);
const updateCategory = _debounce((setCluster, newValue) => setCluster({ category: newValue }), debounceTime);


export default function ClusterOptions({ clusterKey, cluster, setCluster, removeCluster }) {
  const [x, setX] = useState(cluster.x);
  const [y, setY] = useState(cluster.y);
  const [sigma, setSigma] = useState(cluster.sigma);
  const [angle, setAngle] = useState(cluster.angle);
  const [amplitude, setAmplitude] = useState(cluster.amplitude);
  const [n, setN] = useState(cluster.n);
  const [category, setCategory] = useState(cluster.category);
  const [isOpen, setIsOpen] = useState(false);

  const xChange = (newValue) => {
    setX(newValue);
    updateX(setCluster, newValue);
  };
  const yChange = (newValue) => {
    setY(newValue);
    updateY(setCluster, newValue);
  };
  const sigmaChange = (newValue) => {
    setSigma(newValue);
    updateSigma(setCluster, newValue);
  };
  const angleChange = (newValue) => {
    setAngle(newValue);
    updateAngle(setCluster, newValue);
  };
  const amplitudeChange = (newValue) => {
    setAmplitude(newValue);
    updateAmplitude(setCluster, newValue);
  };
  const nChange = (newValue) => {
    setN(newValue);
    updateN(setCluster, newValue);
  };
  const categoryChange = (newValue) => {
    setCategory(newValue);
    updateCategory(setCluster, newValue);
  };

  const removeClickHandler = () => removeCluster(clusterKey);

  return (
    <div>
      <ClusterHeader clusterKey={clusterKey} category={category} setIsOpen={setIsOpen} isOpen={isOpen} />
      <Collapse isOpen={isOpen}>
        <FormGroup
          label="X-pos"
          inline={true}
        >
          <Slider
            stepSize={0.01}
            min={-1}
            max={1}
            labelPrecision={1}
            labelStepSize={2}
            value={x}
            onChange={xChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Y-pos"
          inline={true}
        >
          <Slider
            stepSize={0.01}
            min={-1}
            max={1}
            labelPrecision={1}
            labelStepSize={2}
            value={y}
            onChange={yChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Std. Dev."
          inline={true}
        >
          <Slider
            stepSize={0.01}
            min={0}
            max={0.8}
            labelPrecision={1}
            labelStepSize={0.8}
            value={sigma}
            onChange={sigmaChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Angle"
          inline={true}
        >
          <Slider
            stepSize={0.03}
            min={0}
            max={Math.PI}
            labelPrecision={1}
            labelStepSize={Math.PI}
            value={angle}
            onChange={angleChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Amplitude"
          inline={true}
        >
          <Slider
            stepSize={0.03}
            min={0}
            max={3}
            labelPrecision={1}
            labelStepSize={3}
            value={amplitude}
            onChange={amplitudeChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Points"
          inline={true}
        >
          <Slider
            stepSize={10}
            min={1}
            max={10000}
            labelStepSize={9999}
            value={n}
            onChange={nChange}
            fill={true}
          />
        </FormGroup>
        <FormGroup
          label="Category"
          inline={true}
        >
          <Slider
            stepSize={1}
            min={0}
            max={9}
            labelStepSize={9}
            value={category}
            onChange={categoryChange}
            fill={true}
          />
        </FormGroup>
        <div className="cluster-remove">
          <Button intent={Intent.DANGER} onClick={removeClickHandler}>
            Remove this cluster
          </Button>
        </div>
        <Divider />
      </Collapse>

      <style jsx>{`
        .cluster-remove {
          margin: 10px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
