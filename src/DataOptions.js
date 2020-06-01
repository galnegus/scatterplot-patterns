import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Divider, Button, NumericInput } from '@blueprintjs/core';
import { saveAs } from 'file-saver';
import dataGen from './dataGen';
import ClusterOptions from './ClusterOptions';
import { setMaxCategories } from './actions';
import DataLoader from './DataLoader';
import computeOverlap from './computeOverlap';

function renderPercentage(val) {
  return `${Math.round(val * 100)}%`;
}

function distributePoints(n, k) {
  const step = n / k;
  const res = [];

  let prev = 0;
  for (let i = 1; i <= k; ++i) {
    const curr = Math.round(i * step);
    res.push(curr - prev);
    prev = curr;
  }

  return res;
}

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
  const [nPointsInput, setNPointsInput] = useState(NumericInput.VALUE_EMPTY);
  const lastData = useRef(null);
  const dispatch = useDispatch();
  
  const overlap = computeOverlap(Object.keys(clusters).map((key) => clusters[key]));

  useEffect(() => {
    if (scatterplot !== null) {
      const data = Object.keys(clusters).map((clusterKey) => dataGen(clusters[clusterKey]))
        .reduce((acc, curr) => acc.concat(curr), []);

      lastData.current = data;
      scatterplot.draw(data);
      dispatch(setMaxCategories(Math.max(...Object.keys(clusters).map((clusterKey) => clusters[clusterKey].category)) + 1));
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

  const unusedCategory = () => {
    const usedCategories = new Set();
    Object.keys(clusters).forEach((clusterKey) => usedCategories.add(clusters[clusterKey].category));

    for (let i = 0; i < 10; ++i) {
      if (!usedCategories.has(i)) return i;
    }
    return 0;
  }

  const handlePointsValueChange = (value) => {
    if (!isNaN(value))
      setNPointsInput(value);
    else
      setNPointsInput(nPointsInput);
  };
  const nPointsClickHandler = () => {
    setClusters((oldClusters) => {
      const newClusters = {};
      const points = distributePoints(nPointsInput, Object.keys(oldClusters).length);
      Object.keys(oldClusters).forEach((key, i) => {
        const oldCluster = oldClusters[key];
        const newCluster = { ...oldCluster, n: points[i] };
        newClusters[key] = newCluster;
      });
      return newClusters;
    });
  };
  const addClickHandler = () => addCluster(unusedCategory());
  const exportClickHandler = () => {
    const nPoints = Object.keys(clusters).reduce((sum, key) => sum + clusters[key].n, 0);
    const nClusters = Object.keys(clusters).length;

    const res = {
      data: lastData.current,
      meta: {
        nPoints,
        nClusters,
        overlap
      },
    };

    const filename = `c${nClusters}_n${nPoints}.json`;
    const jsonFile = new Blob([JSON.stringify(res, null, 2)], {
      type: 'application/json',
    });

    saveAs(jsonFile, filename);
  };

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
      <span className="option-title bp3-text-muted">GENERATE DATA</span>
      <p className="bp3-text-muted" style={{ textAlign: 'center' }}>
        Click on a cluster to show/hide options.
      </p>
      {renderClusterOptions}

      <p className="overlap">
        <strong>Overlap:</strong>
        {renderPercentage(overlap)}
      </p>

      <div className="points-input">
        <div className="points-input__number-wrapper">
          <NumericInput
            buttonPosition="left"
            placeholder="Force number of points"
            fill={true}
            value={nPointsInput}
            onValueChange={handlePointsValueChange}
            min={10}
            max={10000}
          />
        </div>
        <Button onClick={nPointsClickHandler}>
          Go
        </Button>
      </div>

      <div className="data-button">
        <Button onClick={addClickHandler} fill={true}>
          Add cluster
        </Button>
      </div>
      <div className="data-button">
        <Button onClick={exportClickHandler} fill={true}>
          Export data (JSON)
        </Button>
      </div>

      <Divider />

      <span className="option-title bp3-text-muted">LOAD REAL DATA</span>
      <DataLoader scatterplot={scatterplot} />

      <style jsx>{`
        .data-button {
          margin: 10px 0;
          text-align: center;
        }

        .overlap {
          margin-bottom: 10px;
          text-align: center;
        }

        .overlap strong {
          margin-right: 5px;
        }

        .points-input {
          display: flex;
        }

        .points-input__number-wrapper {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
