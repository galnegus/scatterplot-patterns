import React, { useCallback } from 'react';
import createScatterplot from './winglets/regl-scatterplot-winglets.esm.min.js';
import gen from './dataGen';
import './App.css';

function setupScatterplot(canvas) {
  let { width, height } = canvas.getBoundingClientRect();

  const lassoMinDelay = 10;
  const lassoMinDist = 2;
  const pointSize = 5;
  const showRecticle = true;
  const recticleColor = [1, 1, 0.878431373, 0.33];

  const scatterplot = createScatterplot({
    canvas,
    width,
    height,
    lassoMinDelay,
    lassoMinDist,
    pointSize,
    showRecticle,
    recticleColor
  });

  const resizeHandler = () => {
    ({ width, height } = canvas.getBoundingClientRect());
    scatterplot.set({ width, height });
  };
  window.addEventListener('resize', resizeHandler);

  const generatePoints = (num, category) => {
    const sigma = Math.random() / 3 + 0.1;
    const max = 1 - sigma * 2 - 0.2; // want x, y mean in interval (-max, max) to avoid points outside of canvas boundary.

    return gen({
      x: Math.random() * max * 2 - max,
      y: Math.random() * max * 2 - max,
      sigma,
      angle: Math.random() * Math.PI,
      amplitude: Math.random(),
      n: num,
      category
    });
  };

  const colorsCat = [
    '#fccde5',
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#d9d9d9',
    '#bc80bd'
  ];
  scatterplot.set({ colorBy: 'category', colors: colorsCat });

  const points = new Array(2)
    .fill()
    .map((_, i) => generatePoints(100, i))
    .reduce((acc, curr) => acc.concat(curr), []);
  scatterplot.draw(points);
}

function App() {
  const canvasRef = useCallback((canvas) => {
    setupScatterplot(canvas);
    console.log(canvas);
    //let { width, height } = canvasRef.current.getBoundingClientRect();
    //console.log(width, height);
  }, []);
  return (
    <div className="App">
      <div className="canvas-wrapper">
        <canvas className="canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;
