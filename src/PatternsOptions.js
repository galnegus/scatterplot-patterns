import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux'
import tinycolor from 'tinycolor2';
import { Divider } from '@blueprintjs/core';
import PatternOptions from './PatternOptions';
import { PATTERN_TYPES, defaultOptions } from './scatterplot/patterns/PatternManager';

// gives you a new key when you call it.
const keyGen = (() => {
  let i = 3;
  return () => i++;
})();

const defaultPulse = (category, hsvColor) => ({
  type: PATTERN_TYPES.PULSE,
  category,
  ...defaultOptions[PATTERN_TYPES.PULSE],
  hsvColor
});

const defaultRadar = (category, hsvColor) => ({
  type: PATTERN_TYPES.RADAR,
  category,
  ...defaultOptions[PATTERN_TYPES.RADAR],
  hsvColor
});

function toHsvColor(hex) {
  const hsvObj = tinycolor(hex).toHsv();
  return [hsvObj.h / 360, hsvObj.s, hsvObj.v];
}

export default function DataOptions({ scatterplot }) {
  const categoryColors = useSelector((state) => state.categoryColors, shallowEqual);

  const [patterns, setPatterns] = useState({
    1: defaultRadar(0, toHsvColor(categoryColors[0])),
    2: defaultPulse(1, toHsvColor(categoryColors[1]))
  });

  const maxCategories = useSelector((state) => state.maxCategories);

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
