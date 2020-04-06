import Papa from 'papaparse';

export default function loadData(csv, dataOptions) {
  const { xField, yField, catField } = dataOptions;

  const categories = new Map();
  let nCategories = 0;

  let xMin = Number.POSITIVE_INFINITY;
  let yMin = Number.POSITIVE_INFINITY;
  let xMax = Number.NEGATIVE_INFINITY;
  let yMax = Number.NEGATIVE_INFINITY;

  const res = [];

  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      worker: true,
      step: (results) => {
        if (!categories.has(results.data[catField]))
          categories.set(results.data[catField], nCategories++);

        res.push([
          results.data[xField],
          results.data[yField],
          categories.get(results.data[catField]),
          0
        ]);

        if (results.data[xField] < xMin) xMin = results.data[xField];
        if (results.data[xField] > xMax) xMax = results.data[xField];
        if (results.data[yField] < yMin) yMin = results.data[yField];
        if (results.data[yField] > yMax) yMax = results.data[yField];
      },
      complete: () => {
        const xLength = (xMax - xMin) / 2;
        const yLength = (yMax - yMin) / 2;

        for(let i = 0; i < res.length; ++i) {
          res[i][0] = (res[i][0] - xMin) / xLength - 1;
          res[i][1] = (res[i][1] - yMin) / yLength - 1;
        }

        resolve({ results: res, nCategories });
      },
      error: () => {
        reject();
      }
    });
  });
}
