import React, { useCallback, useState } from 'react';
import createScatterplot from './scatterplot';
import dataGen from './dataGen';
import Sidebar from './Sidebar';
import Meta from './Meta';
import { defaultValues, colorsCool } from './constants';
import { ThemeContext, DataContext } from './contexts';

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
  });

  const resizeHandler = () => {
    ({ width, height } = canvas.getBoundingClientRect());
    scatterplot.set({ width, height });
  };
  window.addEventListener('resize', resizeHandler);

  scatterplot.set({ colorBy: 'category', colors: colorsCool });
  setScatterplot(scatterplot);
}

function App() {
  const [scatterplot, setScatterplot] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [maxCategories, setMaxCategories] = useState(0);

  const canvasRef = useCallback((canvas) => {
    initScatterplot(canvas, setScatterplot);
  }, [setScatterplot]);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);
  
  //const darkBg = '#10161A';
  const darkBg = '#000000';
  //const lightBg = '#efefef';
  const lightBg = '#ffffff';

  return (
    <ThemeContext.Provider value={{isDarkTheme, toggleTheme}}>
      <DataContext.Provider value={{maxCategories, setMaxCategories}}>
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
              background-color: ${isDarkTheme ? darkBg : lightBg};
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
      </DataContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
