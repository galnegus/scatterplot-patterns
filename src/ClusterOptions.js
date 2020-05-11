import React, { useState } from 'react';
import { FormGroup, Slider, Collapse, Divider, Button, Intent } from '@blueprintjs/core';
import useSlider from './useSlider';
import ClusterHeader from './ClusterHeader';

export default function ClusterOptions({ clusterKey, cluster, setCluster, removeCluster }) {
  const [x, xChange] = useSlider(cluster, setCluster, 'x');
  const [y, yChange] = useSlider(cluster, setCluster, 'y');
  const [sigma, sigmaChange] = useSlider(cluster, setCluster, 'sigma');
  const [angle, angleChange] = useSlider(cluster, setCluster, 'angle');
  const [amplitude, amplitudeChange] = useSlider(cluster, setCluster, 'amplitude');
  const [n, nChange] = useSlider(cluster, setCluster, 'n');
  const [category, categoryChange] = useSlider(cluster, setCluster, 'category');

  const [isOpen, setIsOpen] = useState(false);
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
