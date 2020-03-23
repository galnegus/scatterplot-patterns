import React, { useState, useRef } from 'react';
import { FormGroup, HTMLSelect, Collapse, Divider, Button, Intent, FileInput } from '@blueprintjs/core';
import { saveAs } from 'file-saver';
import PatternHeader from './PatternHeader';
import { PATTERN_TYPES, defaultOptions } from './scatterplot/patterns/PatternManager';
import PulseOptions from './PulseOptions';
import RadarOptions from './RadarOptions';

export default function PatternOptions({ patternKey, pattern, setPattern }) {
  const [isOpen, setIsOpen] = useState(false);
  const importFileRef = useRef(null);
  const { type } = pattern;

  const typeChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setPattern({ type: newValue, ...defaultOptions[newValue] });
  };

  let typeOptions;
  if (type === PATTERN_TYPES.PULSE) {
    typeOptions = <PulseOptions pattern={pattern} setPattern={setPattern} />
  } else if (type === PATTERN_TYPES.RADAR) {
    typeOptions = <RadarOptions pattern={pattern} setPattern={setPattern} />
  }

  const onExportClick = () => {
    // hsvColor and category should not be exported! (it's too much work)
    const {
      hsvColor, // eslint-disable-line no-unused-vars
      category, // eslint-disable-line no-unused-vars
      ...patternOptions
    } = pattern;

    const jsonFile = new Blob([JSON.stringify(patternOptions, null, 2)], {
      type: 'application/json',
    });

    saveAs(jsonFile, 'pattern.json');
  };

  const onImportClick = async () => {
    if (importFileRef.current === null)
      throw new Error('Import doesn\'t work for some reason');

    const textPromise = importFileRef.current.files[0].text();
    const patternJSON = JSON.parse(await textPromise);

    setPattern(patternJSON);
  };

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
        <span className="option-title bp3-text-muted">Import/Export</span>
        <div className="pattern-buttons">
          <Button onClick={onExportClick} className="pattern-buttons__button" fill={true}>
            Export pattern
          </Button>

          <FileInput
            buttonText="Import pattern"
            inputProps={{ onChange: onImportClick, ref: importFileRef, intent: Intent.PRIMARY, accept: 'application/json' }}
            fill={true}
            className="pattern-buttons__button"
          />
        </div>
        <Divider />
        
      </Collapse>
      <style jsx>
      {`
        .pattern-buttons {
          text-align: center;
          margin: 15px 0;
        }
      `}
      </style>
      <style jsx global>
      {`
        .pattern-buttons__button {
          margin: 5px 0;
        }

        .pattern-buttons__button.bp3-file-input {
          box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.4);
        }

        .pattern-buttons .bp3-file-upload-input::after {
          margin: 0;
          width: 100%;
          line-height: inherit;
        }
      `}
      </style>
    </div>
  );
}
