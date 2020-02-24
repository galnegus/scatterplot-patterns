import React, { useState, useEffect, useContext } from 'react';
import { Divider, Button, Intent } from '@blueprintjs/core';
import dataGen from './dataGen';
import ClusterOptions from './ClusterOptions';
import { DataContext } from './contexts';

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
  let i = 3;
  return () => i++;
})();

export default function DataOptions({ scatterplot }) {
  const [clusters, setClusters] = useState({
    1: defaultCluster(0),
    2: defaultCluster(1)
  });

  const { setMaxCategories } = useContext(DataContext)
  useEffect(() => {
    if (scatterplot !== null) {
      scatterplot.draw(Object.keys(clusters).map((clusterKey) => dataGen(clusters[clusterKey]))
        .reduce((acc, curr) => acc.concat(curr), []));
      setMaxCategories(Math.max(...Object.keys(clusters).map((clusterKey) => clusters[clusterKey].category)) + 1);
    }
  }, [scatterplot, clusters, setMaxCategories])

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

  const unusedCategory = () => {
    const usedCategories = new Set();
    Object.keys(clusters).forEach((clusterKey) => usedCategories.add(clusters[clusterKey].category));

    for (let i = 0; i < 10; ++i) {
      if (!usedCategories.has(i)) return i;
    }
    return 0;
  }

  const addClickHandler = () => addCluster(unusedCategory());

  const renderClusterOptions = Object.keys(clusters).map((clusterKey) => (
    <ClusterOptions
      key={clusterKey}
      clusterKey={clusterKey}
      cluster={clusters[clusterKey]}
      setCluster={createSetCluster(clusterKey)}
      removeCluster={removeCluster}
    />
  ));

  return (
    <div>
      <Divider />
      <p className="bp3-text-muted" style={{ textAlign: 'center' }}>
        Click on a cluster to show/hide options.
      </p>
      {renderClusterOptions}
      <div className="data-add-new">
        <Button intent={Intent.PRIMARY} onClick={addClickHandler}>
          Add cluster
        </Button>
      </div>

      <style jsx>{`
        .data-add-new {
          margin: 10px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
