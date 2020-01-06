import React, { useCallback, useState } from 'react';
import createScatterplot from './winglets/regl-scatterplot-winglets.esm.min.js';
import dataGen from './dataGen';
import Sidebar from './Sidebar';
import Meta from './Meta';
import { defaultWingletsOptions, defaultValues, colorsCool } from './constants';

function initScatterplot(canvas, setScatterplot) {
  let { width, height } = canvas.getBoundingClientRect();

  const lassoMinDelay = 10;
  const lassoMinDist = 2;
  const pointSize = defaultValues.pointSize;
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
    recticleColor,
    wingletsOptions: defaultWingletsOptions
  });

  const resizeHandler = () => {
    ({ width, height } = canvas.getBoundingClientRect());
    scatterplot.set({ width, height });
  };
  window.addEventListener('resize', resizeHandler);

  const generatePoints = (num, category) => {
    const sigma = Math.random() / 3 + 0.1;
    const max = 1 - sigma * 2 - 0.2; // want x, y mean in interval (-max, max) to avoid points outside of canvas boundary.

    return dataGen({
      x: Math.random() * max * 2 - max,
      y: Math.random() * max * 2 - max,
      sigma,
      angle: Math.random() * Math.PI,
      amplitude: Math.random(),
      n: num,
      category
    });
  };

  scatterplot.set({ colorBy: 'category', colors: colorsCool });

  const points = new Array(2)
    .fill()
    .map((_, i) => generatePoints(100, i))
    .reduce((acc, curr) => acc.concat(curr), []);
  scatterplot.draw(points);
  setScatterplot(scatterplot);
}

function App() {
  const [scatterplot, setScatterplot] = useState(null);

  const canvasRef = useCallback((canvas) => {
    initScatterplot(canvas, setScatterplot);
  }, [setScatterplot]);
  
  return (
    <div className="App">
      <Meta />
      <div className="content">
        <div className="canvas-wrapper">
          <canvas className="canvas" ref={canvasRef}></canvas>
        </div>
      </div>
      <Sidebar scatterplot={scatterplot} />
      <style jsx>{`
        .App {
          background-color: #10161A;
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
        }

        .content {
          flex-grow: 1;
          height: 100%;
          position: relative;
        }

        .canvas-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .canvas {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default App;
