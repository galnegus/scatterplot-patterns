import React, { useState, useEffect } from 'react';
import { Divider } from '@blueprintjs/core';
import dataGen from './dataGen';
import ClusterOptions from './ClusterOptions';

// sigma ~ x radius
// amplitude ~ y radius
const defaultCluster = (category) => {
  if (category > 9) throw new Error("There are at most 10 categories!");

  const sigma = Math.random() / 3 + 0.1;
  const max = 1 - sigma * 2 - 0.2; // want x, y mean in interval (-max, max) to avoid points outside of canvas boundary.

  return {
    x: Math.random() * max * 2 - max,
    y: Math.random() * max * 2 - max,
    sigma,
    angle: Math.random() * Math.PI,
    amplitude: Math.random(),
    n: 100,
    category
  };
};

// gives you a new key when you call it.
const keyGen = (() => {
  let i = 1;
  return () => i++;
})();

export default function DataOptions({ scatterplot }) {
  const [clusters, setClusters] = useState({
    [keyGen()]: defaultCluster(0),
    [keyGen()]: defaultCluster(0),
    [keyGen()]: defaultCluster(3)
  });

  useEffect(() => {
    if (scatterplot !== null) {
      scatterplot.draw(Object.keys(clusters).map((clusterKey) => dataGen(clusters[clusterKey]))
        .reduce((acc, curr) => acc.concat(curr), []));
    }
  }, [scatterplot, clusters])

  const createSetCluster = (clusterKey) => {
    return (newCluster) => {
      setClusters((oldClusters) => ({ ...oldClusters, [clusterKey]: { ...oldClusters[clusterKey], ...newCluster }}));
    };
  };

  const addCluster = (category) => setClusters((oldClusters) => ({
    ...oldClusters,
    [keyGen()]: defaultCluster(category)
  }));

  const removeCluster = (clusterKey) => setClusters((oldClusters) => {
    const { [clusterKey]: _, ...otherKeys } = oldClusters; /* eslint-disable-line no-unused-vars */
    return otherKeys;
  });

  const renderClusterOptions = Object.keys(clusters).map((clusterKey) => (
    <ClusterOptions
      key={clusterKey}
      clusterKey={clusterKey}
      cluster={clusters[clusterKey]}
      setCluster={createSetCluster(clusterKey)}
    />
  ));

  return (
    <div>
      <Divider />
      {renderClusterOptions}
    </div>
  );
}
