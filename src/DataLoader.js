import React, { useState, useEffect, useRef } from 'react';
import { FormGroup, HTMLSelect, Divider, Button, Intent, FileInput } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import { setLoading, setMaxCategories } from './actions';
import Diamonds from './data/Diamonds';
import Abalone from './data/Abalone';
import Beautiful from './data/Beautiful';
import loadData from './loadData';
import parseData from './parseData';

// each data source should be an object containing 3 props: csv, dataFields, and catFields
const dataSources = {
  Diamonds,
  Abalone,
  Beautiful,
};

function DataOptions({ dataFields, catFields, dataOptions, setDataOptions }) {
  const { xField, yField, catField } = dataOptions;

  useEffect(() => {
    setDataOptions((prevState) => ({
      ...prevState,
      xField: dataFields[0],
      yField: dataFields[1],
      catField: catFields[0],
    }));
  }, [dataFields, catFields]);

  const xOptions = dataFields.filter((field) => field !== yField);
  const yOptions = dataFields.filter((field) => field !== xField);

  const xChange = (event) => {
    const newX = event.target.value;
    setDataOptions((prevState) => ({ ...prevState, xField: newX }));
  };
  const yChange = (event) => {
    const newY = event.target.value;
    setDataOptions((prevState) => ({ ...prevState, yField: newY }));
  };
  const catChange = (event) => {
    const newCat = event.target.value;
    setDataOptions((prevState) => ({ ...prevState, catField: newCat }));
  };

  if (xField === null || yField === null || catField === null) return null;

  return (
    <div>
      <FormGroup
        label="X"
        inline={true}
        className="data-option-select"
      >
        <HTMLSelect
          options={xOptions}
          onChange={xChange}
          value={xField}
          fill={true}
        />
      </FormGroup>

      <FormGroup
        label="Y"
        inline={true}
        className="data-option-select"
      >
        <HTMLSelect
          options={yOptions}
          onChange={yChange}
          value={yField}
          fill={true}
        />
      </FormGroup>

      <FormGroup
        label="Category"
        inline={true}
        className="data-option-select"
      >
        <HTMLSelect
          options={catFields}
          onChange={catChange}
          value={catField}
          fill={true}
        />
      </FormGroup>

      <style jsx global>
      {`
        .data-option-select {
          margin-bottom: 5px;
        }
      `}  
      </style>
    </div>
  );
}

export default function DataLoader({ scatterplot }) {
  const [dataSource, setDataSource] = useState('Diamonds');
  const [dataOptions, setDataOptions] = useState({
    xField: null,
    yField: null,
    catField: null,
  });
  const dispatch = useDispatch();

  const [inputFile, setInputFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputFieldsRef = useRef(null);

  const dataSourceChange = (event) => {
    if (!event.target.value) return;

    setDataSource(event.target.value)
    setInputFile(null);
    fileInputRef.current.value = '';
  }
  const loadClickHandler = async () => {
    const csv = inputFile ? inputFile : dataSources[dataSource].csv;

    await dispatch(setLoading(true));
    const { results, nCategories } = await loadData(csv, dataOptions);
    await dispatch(setLoading(false));

    dispatch(setMaxCategories(nCategories));
    scatterplot.draw(results);
  }
  const inputFileChange = async () =>  {
    if (fileInputRef.current.files.length === 0) return;

    await dispatch(setLoading(true));
    inputFieldsRef.current = await parseData(fileInputRef.current.files[0]);
    await dispatch(setLoading(false));

    setInputFile(fileInputRef.current.files[0]);
    setDataSource('');
  }

  const dataFields = inputFile ? inputFieldsRef.current[0] : dataSources[dataSource].dataFields;
  const catFields = inputFile ? inputFieldsRef.current[1] : dataSources[dataSource].catFields;

  return (
    <div>
      <FormGroup
        label="Data source"
        inline={true}
      >
        <HTMLSelect
          options={[{ label: '---', value: '' }, ...Object.keys(dataSources).map((value) => ({ label: value + '.csv', value }))]}
          onChange={dataSourceChange}
          value={dataSource}
          fill={true}
        />

      </FormGroup>

      <div className="v-space" />

      <FormGroup className="v-space">
        <FileInput
          text={inputFile ? inputFile.name : 'Other CSV file...'}
          hasSelection={inputFile !== null}
          fill={true}
          inputProps={{ onChange: inputFileChange, ref: fileInputRef }}
        />
      </FormGroup>

      <Divider />

      <DataOptions
        dataFields={dataFields}
        catFields={catFields}
        dataOptions={dataOptions}
        setDataOptions={setDataOptions}
      />

      <div className="data-add-new">
        <Button intent={Intent.PRIMARY} onClick={loadClickHandler}>
          Load data
        </Button>
      </div>
      <style jsx>
      {`
        .data-add-new {
          margin: 10px 0;
          text-align: center;
        }

        .v-space {
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}