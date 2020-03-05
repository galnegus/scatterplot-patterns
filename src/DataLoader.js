import React, { useState, useEffect } from 'react';
import { FormGroup, HTMLSelect, Divider, Button, Intent } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';
import Diamonds from './data/Diamonds';
import Abalone from './data/Abalone';
import loadData from './loadData';

// each data source should be an object containing 3 props: csv, dataFields, and catFields
const dataSources = {
  Diamonds,
  Abalone,
};

function DataOptions({ dataSource, dataOptions, setDataOptions }) {
  const { dataFields, catFields } = dataSources[dataSource];
  const { xField, yField, catField } = dataOptions;

  useEffect(() => {
    setDataOptions((prevState) => ({
      ...prevState,
      xField: dataFields[0],
      yField: dataFields[1],
      catField: catFields[0],
    }));
  }, [dataSource]);

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

  const dataSourceChange = (event) => setDataSource(event.target.value)
  const loadClickHandler = () => loadData(scatterplot.draw, dispatch, dataSources[dataSource].csv, dataOptions);

  return (
    <div>
      <FormGroup
        label="Data source"
        inline={true}
      >
        <HTMLSelect
          options={Object.keys(dataSources)}
          onChange={dataSourceChange}
          value={dataSource}
          fill={true}
        />
      </FormGroup>

      <Divider />

      <DataOptions
        dataSource={dataSource}
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
      `}</style>
    </div>
  );
}