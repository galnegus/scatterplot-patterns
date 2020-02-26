import React, { useState, useEffect, useContext } from 'react';
import { Divider } from '@blueprintjs/core';
import PatternOptions from './PatternOptions';
import { PATTERN_TYPES } from './scatterplot/patterns/PatternManager';
import { DataContext } from './contexts';

// gives you a new key when you call it.
const keyGen = (() => {
  let i = 3;
  return () => i++;
})();

const defaultPulse = (category) => ({
  type: PATTERN_TYPES.PULSE,
  category,
  hsvColor: [Math.random(), 1, 1],
  a: 1,
  c1: 0.1,
  c2: 0.1,
  minValue: 0.2,
  cyclesPerSecond: 1,
  wavesPerCycle: 1,
  direction: 1,
});

const defaultRadar = (category) => ({
  type: PATTERN_TYPES.RADAR,
  category,
  hsvColor: [Math.random(), 1, 1],
  gamma1: 5,
  gamma2: 5,
  maxValue: 1,
  minValue: 0.2,
  cyclesPerSecond: 1,
  nSpokes: 2,
  direction: 1,
});

export default function DataOptions({ scatterplot }) {
  const [patterns, setPatterns] = useState({
    1: defaultRadar(0),
    2: defaultPulse(1)
  });

  const { maxCategories } = useContext(DataContext);

  // TODO: effect when maxCategories change, add/remove patterns

  useEffect(() => {
    if (scatterplot !== null) {
      scatterplot.patternManager.setAll(Object.keys(patterns).map((patternKey) => patterns[patternKey]));
    }
  }, [scatterplot, patterns])

  const createSetPattern = (patternKey) => {
    return (newPattern) => {
      setPatterns((oldPatterns) => ({ ...oldPatterns, [patternKey]: { ...oldPatterns[patternKey], ...newPattern }}));
    };
  };

  const addPattern = (category) => setPatterns((oldPatterns) => ({
    ...oldPatterns,
    [keyGen()]: defaultPulse(category)
  }));

  const removePattern = (patternKey) => setPatterns((oldPatterns) => {
    const { [patternKey]: _, ...otherKeys } = oldPatterns; /* eslint-disable-line no-unused-vars */
    return otherKeys;
  });

  useEffect(() => {
    if (maxCategories > 0) { // initial state
      // try delete first
      const categoriesToAdd = new Set(new Array(maxCategories).fill().map((_, i) => i));
      Object.keys(patterns).forEach((patternKey) => {
        const pattern = patterns[patternKey];
        if (pattern.category >= maxCategories) removePattern(patternKey);
        else categoriesToAdd.delete(pattern.category);
      });

      // try add
      categoriesToAdd.forEach((category) => addPattern(category));
    }
  }, [maxCategories]);


  const renderPatternOptions = Object.keys(patterns).map((patternKey) => (
    <PatternOptions
      key={patternKey}
      patternKey={patternKey}
      pattern={patterns[patternKey]}
      setPattern={createSetPattern(patternKey)}
    />
  ));

  return (
    <div>
      <Divider />
      <p className="bp3-text-muted" style={{ textAlign: 'center' }}>
        Click on a cluster to show/hide options.
      </p>
      {renderPatternOptions}

      <style jsx>{`
        .data-add-new {
          margin: 10px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
