import React, { useState } from 'react';
import { FormGroup, HTMLSelect, Collapse, Divider } from '@blueprintjs/core';
import PatternHeader from './PatternHeader';
import { PATTERN_TYPES, defaultOptions } from './scatterplot/patterns/PatternManager';
import PulseOptions from './PulseOptions';
import RadarOptions from './RadarOptions';

export default function PatternOptions({ patternKey, pattern, setPattern }) {
  const [type, setType] = useState(pattern.type);
  const [isOpen, setIsOpen] = useState(false);

  const typeChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setPattern({ type: newValue, ...defaultOptions[newValue] });
    setType(newValue);
  };

  let typeOptions;
  if (type === PATTERN_TYPES.PULSE) {
    typeOptions = <PulseOptions pattern={pattern} setPattern={setPattern} />
  } else if (type === PATTERN_TYPES.RADAR) {
    typeOptions = <RadarOptions pattern={pattern} setPattern={setPattern} />
  }

  return (
    <div>
      <PatternHeader patternKey={patternKey} category={pattern.category} setIsOpen={setIsOpen} isOpen={isOpen} />
      <Collapse isOpen={isOpen}>
        <FormGroup
          label="Type"
          inline={true}
        >
          <HTMLSelect
            options={[
              { label: 'Radar', value: PATTERN_TYPES.RADAR },
              { label: 'Pulse', value: PATTERN_TYPES.PULSE },
            ]}
            onChange={typeChange}
            value={type}
            fill={true}
          />
        </FormGroup>
        {typeOptions}
        <Divider />
      </Collapse>
    </div>
  );
}
