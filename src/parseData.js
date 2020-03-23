import Papa from 'papaparse';

// ISSUE: needs to be async
export default function parseData(csvFile) {
  let fieldNames = [];
  let parsedFields = false;

  let fieldIsCategory = {};
  let fieldValuesSet = {};
  let fieldIsData = {};

  let promise = new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      //header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (results) => {
        if (!parsedFields) {
          fieldNames = [...results.data];
          parsedFields = true;

          fieldNames.forEach((fieldName) => {
            if (fieldName) { // do this to avoid empty string
              fieldIsCategory[fieldName] = true;
              fieldValuesSet[fieldName] = new Set();
              fieldIsData[fieldName] = true;
            }
          });

          return;
        }

        fieldNames.forEach((fieldName, i) => {
          if (fieldIsCategory[fieldName]) {
            if (!fieldValuesSet[fieldName].has(results.data[i])) {
              fieldValuesSet[fieldName].add(results.data[i]);
              if (fieldValuesSet[fieldName].size > 10) fieldIsCategory[fieldName] = false;
            }
          }

          if (fieldIsData[fieldName] && typeof results.data[i] !== 'number')
            fieldIsData[fieldName] = false;
        });
      },
      complete: () => {
        const catFields = [];
        const dataFields = [];

        fieldNames.forEach((fieldName) => {
          if (fieldIsCategory[fieldName]) catFields.push(fieldName);
          if (fieldIsData[fieldName]) dataFields.push(fieldName);
        });

        resolve([dataFields, catFields]);
      },
      error: () => {
        reject();
      }
    });
  });

  return promise;
}
