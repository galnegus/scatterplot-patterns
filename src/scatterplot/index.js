import createDom2dCamera from './camera';
import KDBush from 'kdbush';
import createPubSub from 'pub-sub-es';
import withThrottle from 'lodash/throttle';
import withRaf from 'with-raf';
import { mat4, vec4 } from 'gl-matrix';
import createLine from 'regl-line';
import GLBench from 'gl-bench/dist/gl-bench';
import _groupBy from 'lodash/groupBy';
import _has from 'lodash/has';
import _mapValues from 'lodash/mapValues';

import BG_FS from './bg.frag';
import BG_VS from './bg.vert';
import POINT_FS from './point.frag';
import POINT_VS from './point.vert';

import PatternManager, { PATTERN_TYPES } from './patterns/PatternManager';

import {
  COLOR_ACTIVE_IDX,
  COLOR_BG_IDX,
  COLOR_HOVER_IDX,
  COLOR_NORMAL_IDX,
  COLOR_NUM_STATES,
  DEFAULT_BACKGROUND_IMAGE,
  DEFAULT_COLOR_BG,
  DEFAULT_COLOR_BY,
  DEFAULT_COLORS,
  DEFAULT_DATA_ASPECT_RATIO,
  DEFAULT_DISTANCE,
  DEFAULT_HEIGHT,
  DEFAULT_LASSO_COLOR,
  DEFAULT_SHOW_RECTICLE,
  DEFAULT_RECTICLE_COLOR,
  DEFAULT_POINT_OUTLINE_WIDTH,
  DEFAULT_POINT_SIZE,
  DEFAULT_POINT_SIZE_SELECTED,
  DEFAULT_ROTATION,
  DEFAULT_TARGET,
  DEFAULT_VIEW,
  DEFAULT_WIDTH,
  FLOAT_BYTES,
  LASSO_MIN_DELAY,
  LASSO_MIN_DIST
} from './constants';

import {
  checkReglExtensions,
  createRegl,
  createTextureFromUrl,
  dist,
  getBBox,
  isRgb,
  isPointInPolygon,
  isRgba,
  toRgba,
  max,
  min
} from './utils';

//import { version } from '../package.json';
const version = '0.7.5';

const createScatterplot = ({
  regl: initialRegl,
  background: initialBackground = DEFAULT_COLOR_BG,
  backgroundImage: initialBackgroundImage = DEFAULT_BACKGROUND_IMAGE,
  canvas: initialCanvas = document.createElement('canvas'),
  colorBy: initialColorBy = DEFAULT_COLOR_BY,
  colors: initialColors = DEFAULT_COLORS,
  lassoColor: initialLassoColor = DEFAULT_LASSO_COLOR,
  lassoMinDelay: initialLassoMinDelay = LASSO_MIN_DELAY,
  lassoMinDist: initialLassoMinDist = LASSO_MIN_DIST,
  showRecticle: initialShowRecticle = DEFAULT_SHOW_RECTICLE,
  recticleColor: initialRecticleColor = DEFAULT_RECTICLE_COLOR,
  pointSize: initialPointSize = DEFAULT_POINT_SIZE,
  pointSizeSelected: initialPointSizeSelected = DEFAULT_POINT_SIZE_SELECTED,
  pointOutlineWidth: initialPointOutlineWidth = DEFAULT_POINT_OUTLINE_WIDTH,
  width: initialWidth = DEFAULT_WIDTH,
  height: initialHeight = DEFAULT_HEIGHT,
  target: initialTarget = DEFAULT_TARGET,
  distance: initialDistance = DEFAULT_DISTANCE,
  rotation: initialRotation = DEFAULT_ROTATION,
  view: initialView = DEFAULT_VIEW
} = {}) => {
  const pubSub = createPubSub();
  const scratch = new Float32Array(16);
  const mousePosition = [0, 0];

  checkReglExtensions(initialRegl);

  let background = toRgba(initialBackground, true);
  let backgroundImage = initialBackgroundImage;
  let canvas = initialCanvas;
  let colors = initialColors;
  let width = initialWidth;
  let height = initialHeight;
  let pointSize = initialPointSize;
  let pointSizeSelected = initialPointSizeSelected;
  let pointOutlineWidth = initialPointOutlineWidth;
  let regl = initialRegl || createRegl(initialCanvas);
  let camera;
  let lasso;
  let mouseDown = false;
  let mouseDownShift = false;
  let mouseDownPosition = [0, 0];
  let numPoints = 0;
  let selection = [];
  let lassoColor = toRgba(initialLassoColor, true);
  let lassoMinDelay = +initialLassoMinDelay;
  let lassoMinDist = +initialLassoMinDist;
  let lassoPos = [];
  let lassoScatterPos = [];
  let lassoPrevMousePos;
  let searchIndex;
  let viewAspectRatio;
  let dataAspectRatio = DEFAULT_DATA_ASPECT_RATIO;
  let projection;
  let model;
  let showRecticle = initialShowRecticle;
  let recticleHLine;
  let recticleVLine;
  let recticleColor = toRgba(initialRecticleColor, true);

  let stateTex; // Stores the point texture holding x, y, category, and value
  let stateTexRes = 0; // Width and height of the texture
  let normalPointsIndexBuffer; // Buffer holding the indices pointing to the correct texel
  let selectedPointsIndexBuffer; // Used for pointing to the selected texels
  let hoveredPointIndexBuffer; // Used for pointing to the hovered texels

  let colorTex; // Stores the color texture
  let colorTexRes = 0; // Width and height of the texture

  let colorBy = initialColorBy;
  let isViewChanged = false;
  let isInit = false;

  let opacity = 1;

  let hoveredPoint;
  let isMouseInCanvas = false;

  let bboxTex;
  let bboxTexRes = 0;
  let glBench;
  let animationMix = [0, 1, 0]; // s = saturation, v = value, a = alpha
  let animateDepth = false;
  let showPatterns = true;
  let useColors = true;

  let patternManager = new PatternManager(regl);
  patternManager.set(0, {
    type: PATTERN_TYPES.PLAIN,
    color: [0.2, 1, 0.5, 1],
  });

  // Get a copy of the current mouse position
  const getMousePos = () => mousePosition.slice();

  const getNdcX = x => -1 + (x / width) * 2;

  const getNdcY = y => 1 + (y / height) * -2;

  // Get relative WebGL position
  const getMouseGlPos = () => [
    getNdcX(mousePosition[0]),
    getNdcY(mousePosition[1])
  ];

  const getScatterGlPos = () => {
    const [xGl, yGl] = getMouseGlPos();

    // Homogeneous vector
    const v = [xGl, yGl, 1, 1];

    // projection^-1 * view^-1 * model^-1 is the same as
    // model * view^-1 * projection
    const mvp = mat4.invert(
      scratch,
      mat4.multiply(
        scratch,
        projection,
        mat4.multiply(scratch, camera.view, model)
      )
    );

    // Translate vector
    vec4.transformMat4(v, v, mvp);

    return v.slice(0, 2);
  };

  const raycast = () => {
    const [x, y] = getScatterGlPos();

    const scaling = camera.scaling;
    const scaledPointSize =
      2 *
      pointSize *
      (min(1.0, scaling) + Math.log2(max(1.0, scaling))) *
      window.devicePixelRatio;

    const xNormalizedScaledPointSize = scaledPointSize / width;
    const yNormalizedScaledPointSize = scaledPointSize / height;

    // Get all points within a close range
    const pointsInBBox = searchIndex.range(
      x - xNormalizedScaledPointSize,
      y - yNormalizedScaledPointSize,
      x + xNormalizedScaledPointSize,
      y + yNormalizedScaledPointSize
    );

    // Find the closest point
    let minDist = scaledPointSize;
    let clostestPoint;
    pointsInBBox.forEach(idx => {
      const [ptX, ptY] = searchIndex.points[idx];
      const d = dist(ptX, ptY, x, y);
      if (d < minDist) {
        minDist = d;
        clostestPoint = idx;
      }
    });

    if (minDist < (pointSize / width) * 2) return clostestPoint;
    return -1;
  };

  const lassoExtend = () => {
    const currMousePos = getMousePos();

    if (!lassoPrevMousePos) {
      lassoPos = [...getMouseGlPos(currMousePos)];
      lassoScatterPos = [...getScatterGlPos(currMousePos)];
      lassoPrevMousePos = currMousePos;
    } else {
      const d = dist(...currMousePos, ...lassoPrevMousePos);

      if (d > lassoMinDist) {
        lassoPos.push(...getMouseGlPos(currMousePos));
        lassoScatterPos.push(...getScatterGlPos(currMousePos));
        lassoPrevMousePos = currMousePos;
        if (lassoPos.length > 2) {
          lasso.setPoints(lassoPos);
        }
      }
    }
  };
  let lassoExtendDb = withThrottle(lassoExtend, lassoMinDelay);

  const findPointsInLasso = lassoPolygon => {
    // get the bounding box of the lasso selection...
    const bBox = getBBox(lassoPolygon);
    // ...to efficiently preselect potentially selected points
    const pointsInBBox = searchIndex.range(...bBox);
    // next we test each point in the bounding box if it is in the polygon too
    const pointsInPolygon = [];
    pointsInBBox.forEach(pointIdx => {
      if (isPointInPolygon(searchIndex.points[pointIdx], lassoPolygon))
        pointsInPolygon.push(pointIdx);
    });

    return pointsInPolygon;
  };

  const deselect = () => {
    if (selection.length) {
      pubSub.publish('deselect');
      selection = [];
      //drawRaf(); // eslint-disable-line no-use-before-define
    }
  };

  const select = points => {
    selection = points;

    selectedPointsIndexBuffer({
      usage: 'dynamic',
      type: 'float',
      data: new Float32Array(selection)
    });

    pubSub.publish('select', {
      points: selection
    });

    //drawRaf(); // eslint-disable-line no-use-before-define
  };

  const getRelativeMousePosition = event => {
    const rect = canvas.getBoundingClientRect();

    mousePosition[0] = event.clientX - rect.left;
    mousePosition[1] = event.clientY - rect.top;

    return [...mousePosition];
  };

  const lassoEnd = () => {
    // const t0 = performance.now();
    const pointsInLasso = findPointsInLasso(lassoScatterPos);
    // console.log(`found ${pointsInLasso.length} in ${performance.now() - t0} msec`);
    select(pointsInLasso);
    lassoPos = [];
    lassoScatterPos = [];
    lassoPrevMousePos = undefined;
    lasso.clear();
  };

  const mouseDownHandler = event => {
    if (!isInit) return;

    mouseDown = true;

    mouseDownPosition = getRelativeMousePosition(event);
    mouseDownShift = event.shiftKey;

    if (mouseDownShift) {
      // Fix camera for the lasso selection
      camera.config({ isFixed: true });
      // Make sure we start a new lasso selection
      lassoPrevMousePos = undefined;
    }
  };

  const mouseUpHandler = () => {
    if (!isInit) return;

    mouseDown = false;

    if (mouseDownShift) {
      mouseDownShift = false;
      camera.config({ isFixed: false });
      lassoEnd();
    }
  };

  const mouseClickHandler = event => {
    if (!isInit) return;

    const currentMousePosition = getRelativeMousePosition(event);
    const clickDist = dist(...currentMousePosition, ...mouseDownPosition);

    if (clickDist >= LASSO_MIN_DIST) return;

    const clostestPoint = raycast();
    if (clostestPoint >= 0) select([clostestPoint]);
  };

  const mouseDblClickHandler = () => {
    deselect();
  };

  const mouseMoveHandler = event => {
    if (!isInit) return;

    getRelativeMousePosition(event);

    // Only ray cast if the mouse cursor is inside
    if (isMouseInCanvas && !mouseDownShift) {
      const clostestPoint = raycast();
      hover(clostestPoint); // eslint-disable-line no-use-before-define
    }

    if (mouseDownShift) lassoExtendDb();

    // Always redraw when mouse as the user might have panned or lassoed
    //if (mouseDown) drawRaf(); // eslint-disable-line no-use-before-define
  };

  const blurHandler = () => {
    if (!isInit) return;

    hoveredPoint = undefined;
    isMouseInCanvas = false;
    mouseUpHandler();
    //drawRaf(); // eslint-disable-line no-use-before-define
  };

  const createColorTexture = (newColors = colors) => {
    const numColors = newColors.length;
    colorTexRes = Math.max(2, Math.ceil(Math.sqrt(numColors)));
    const rgba = new Float32Array(colorTexRes ** 2 * 4);
    newColors.forEach((color, i) => {
      rgba[i * 4] = color[0]; // r
      rgba[i * 4 + 1] = color[1]; // g
      rgba[i * 4 + 2] = color[2]; // b
      // For all normal state colors check if the global opacity is not 1 and
      // if so use that instead.
      rgba[i * 4 + 3] =
        i % COLOR_NUM_STATES > 0 || opacity === 1 ? color[3] : opacity; // a
    });

    return regl.texture({
      data: rgba,
      shape: [colorTexRes, colorTexRes, 4],
      type: 'float'
    });
  };

  const updateViewAspectRatio = () => {
    viewAspectRatio = width / height;
    projection = mat4.fromScaling([], [1 / viewAspectRatio, 1, 1]);
    model = mat4.fromScaling([], [dataAspectRatio, 1, 1,]);
  };

  const setDataAspectRatio = newDataAspectRatio => {
    if (+newDataAspectRatio <= 0) return;
    dataAspectRatio = newDataAspectRatio;
  };

  const setColors = newColors => {
    if (!newColors || !newColors.length) return;

    const tmp = [];
    try {
      newColors.forEach(color => {
        if (Array.isArray(color) && !isRgb(color) && !isRgba(color)) {
          // Assuming color is an array of HEX colors
          for (let j = 0; j < 3; j++) {
            tmp.push(toRgba(color[j], true));
          }
        } else {
          const rgba = toRgba(color, true);
          const rgbaOpaque = [...rgba.slice(0, 3), 1];
          tmp.push(rgba, rgbaOpaque, rgbaOpaque); // normal, active, and hover
        }
        tmp.push(background);
      });
    } catch (e) {
      console.error(
        e,
        'Invalid format. Please specify an array of colors or a nested array of accents per colors.'
      );
    }
    colors = tmp;

    try {
      colorTex = createColorTexture();
    } catch (e) {
      colors = DEFAULT_COLORS;
      colorTex = createColorTexture();
      console.error('Invalid colors. Switching back to default colors.');
    }
  };
  const setHeight = newHeight => {
    if (!+newHeight || +newHeight <= 0) return;
    height = +newHeight;
    canvas.height = height * window.devicePixelRatio;
  };

  const setPointSize = newPointSize => {
    if (!+newPointSize || +newPointSize <= 0) return;
    pointSize = +newPointSize;
  };

  const setPointSizeSelected = newPointSizeSelected => {
    if (!+newPointSizeSelected || +newPointSizeSelected < 0) return;
    pointSizeSelected = +newPointSizeSelected;
  };

  const setPointOutlineWidth = newPointOutlineWidth => {
    if (!+newPointOutlineWidth || +newPointOutlineWidth < 0) return;
    pointOutlineWidth = +newPointOutlineWidth;
  };

  const setWidth = newWidth => {
    if (!+newWidth || +newWidth <= 0) return;
    width = +newWidth;
    canvas.width = width * window.devicePixelRatio;
  };

  const setColorBy = type => {
    switch (type) {
      case 'category':
        colorBy = 'category';
        break;

      case 'value':
        colorBy = 'value';
        break;

      default:
        colorBy = DEFAULT_COLOR_BY;
    }
  };

  const setOpacity = newOpacity => {
    if (!+newOpacity || +newOpacity <= 0) return;

    opacity = +newOpacity;
    colorTex = createColorTexture();
  };

  const getBackgroundImage = () => backgroundImage;
  const getColorTex = () => colorTex;
  const getColorTexRes = () => colorTexRes;
  const getNormalPointsIndexBuffer = () => normalPointsIndexBuffer;
  const getSelectedPointsIndexBuffer = () => selectedPointsIndexBuffer;
  const getPointSize = () => pointSize * window.devicePixelRatio;
  const getNormalPointSizeExtra = () => 0;
  const getStateTex = () => stateTex;
  const getStateTexRes = () => stateTexRes;
  const getProjection = () => projection;
  const getView = () => camera.view;
  const getModel = () => model;
  const getScaling = () => camera.scaling;
  const getNormalNumPoints = () => numPoints;
  const getIsColoredByCategory = () => (colorBy === 'category') * 1;
  const getIsColoredByValue = () => (colorBy === 'value') * 1;
  const getMaxColor = () => colors.length / COLOR_NUM_STATES - 1;
  const getNumColorStates = () => COLOR_NUM_STATES;
  const getTexture = () => patternManager.getTexture();
  const getAtlasSize = () => patternManager.getAtlasSize();
  const getBBoxTex = () => bboxTex;
  const getBBoxTexRes = () => bboxTexRes;
  const getAnimateDepth = () => animateDepth;

  const drawPoints = (
    getPointSizeExtra,
    getNumPoints,
    getStateIndexBuffer,
    globalState = COLOR_NORMAL_IDX
  ) =>
    regl({
      frag: POINT_FS,
      vert: POINT_VS,

      blend: {
        enable: true,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 'one',
          dstRGB: 'one minus src alpha',
          dstAlpha: 'one minus src alpha'
        }
      },

      depth: { enable: getAnimateDepth },

      attributes: {
        stateIndex: {
          buffer: getStateIndexBuffer,
          size: 1
        }
      },

      uniforms: {
        projection: getProjection,
        model: getModel,
        view: getView,
        scaling: getScaling,
        pointSize: getPointSize,
        pointSizeExtra: getPointSizeExtra,
        globalState,
        colorTex: getColorTex,
        colorTexRes: getColorTexRes,
        stateTex: getStateTex,
        stateTexRes: getStateTexRes,
        isColoredByCategory: getIsColoredByCategory,
        isColoredByValue: getIsColoredByValue,
        maxColor: getMaxColor,
        numColorStates: getNumColorStates,
        textureAtlas: getTexture,
        atlasSize: getAtlasSize,
        bboxTex: getBBoxTex,
        bboxTexRes: getBBoxTexRes,
        animateDepth: getAnimateDepth,
      },

      count: getNumPoints,

      primitive: 'points'
    });

  const drawPointBodies = drawPoints(
    getNormalPointSizeExtra,
    getNormalNumPoints,
    getNormalPointsIndexBuffer
  );

  const drawHoveredPoint = drawPoints(
    getNormalPointSizeExtra,
    () => 1,
    () => hoveredPointIndexBuffer,
    COLOR_HOVER_IDX
  );

  const drawSelectedPoint = () => {
    const numOutlinedPoints = selection.length;

    // Draw outer outline
    drawPoints(
      () =>
        (pointSizeSelected + pointOutlineWidth * 2) * window.devicePixelRatio,
      () => numOutlinedPoints,
      getSelectedPointsIndexBuffer,
      COLOR_ACTIVE_IDX
    )();

    // Draw inner outline
    drawPoints(
      () => (pointSizeSelected + pointOutlineWidth) * window.devicePixelRatio,
      () => numOutlinedPoints,
      getSelectedPointsIndexBuffer,
      COLOR_BG_IDX
    )();

    // Draw body
    drawPoints(
      () => pointSizeSelected,
      () => numOutlinedPoints,
      getSelectedPointsIndexBuffer,
      COLOR_ACTIVE_IDX
    )();
  };

  const drawBackgroundImage = regl({
    frag: BG_FS,
    vert: BG_VS,

    attributes: {
      position: [0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0]
    },

    uniforms: {
      projection: getProjection,
      model: getModel,
      view: getView,
      texture: getBackgroundImage
    },

    count: 6
  });

  const drawRecticle = () => {
    if (!(hoveredPoint >= 0)) return;

    const [x, y] = searchIndex.points[hoveredPoint].slice(0, 2);

    // Homogeneous coordinates of the point
    const v = [x, y, 0, 1];

    // We have to calculate the model-view-projection matrix outside of the
    // shader as we actually don't want the mode, view, or projection of the
    // line view space to change such that the recticle is visualized across the
    // entire view container and not within the view of the scatterplot
    mat4.multiply(
      scratch,
      projection,
      mat4.multiply(scratch, camera.view, model)
    );

    vec4.transformMat4(v, v, scratch);

    recticleHLine.setPoints([-1, v[1], 1, v[1]]);
    recticleVLine.setPoints([v[0], 1, v[0], -1]);

    recticleHLine.draw();
    recticleVLine.draw();

    // Draw outer outline
    drawPoints(
      () =>
        (pointSizeSelected + pointOutlineWidth * 2) * window.devicePixelRatio,
      () => 1,
      hoveredPointIndexBuffer,
      COLOR_ACTIVE_IDX
    )();

    // Draw inner outline
    drawPoints(
      () => (pointSizeSelected + pointOutlineWidth) * window.devicePixelRatio,
      () => 1,
      hoveredPointIndexBuffer,
      COLOR_BG_IDX
    )();
  };

  const createPointIndex = numNewPoints => {
    const index = new Float32Array(numNewPoints);

    for (let i = 0; i < numNewPoints; ++i) {
      index[i] = i;
    }

    return index;
  };

  const createStateTexture = newPoints => {
    const numNewPoints = newPoints.length;
    stateTexRes = Math.max(2, Math.ceil(Math.sqrt(numNewPoints)));
    const data = new Float32Array(stateTexRes ** 2 * 4);

    for (let i = 0; i < numNewPoints; ++i) {
      data[i * 4] = newPoints[i][0]; // x
      data[i * 4 + 1] = newPoints[i][1]; // y
      data[i * 4 + 2] = newPoints[i][2] || 0; // category
      data[i * 4 + 3] = newPoints[i][3] || 0; // value
    }

    return regl.texture({
      data,
      shape: [stateTexRes, stateTexRes, 4],
      type: 'float'
    });
  };

  const createBBoxTexture = (bboxByCategory) => {
    const numCategories = Math.max(...Object.keys(bboxByCategory)) + 1;
    bboxTexRes = Math.max(2, Math.ceil(Math.sqrt(numCategories)));
    const data = new Float32Array(bboxTexRes ** 2 * 4);
    for (let i = 0; i < numCategories; i += 1) {
      if (_has(bboxByCategory, i)) {
        data[i * 4] = bboxByCategory[i][0];
        data[i * 4 + 1] = bboxByCategory[i][1];
        data[i * 4 + 2] = bboxByCategory[i][2];
        data[i * 4 + 3] = bboxByCategory[i][3];
      } else {
        data[i * 4] = 0;
        data[i * 4 + 1] = 0;
        data[i * 4 + 2] = 0;
        data[i * 4 + 3] = 0;
      }
    }

    return regl.texture({
      data,
      shape: [bboxTexRes, bboxTexRes, 4],
      type: 'float',
    });
  };

  const computeCentroid = (points) => {
    let sumX = 0;
    let sumY = 0;

    points.forEach((point) => {
      sumX += point[0];
      sumY += point[1];
    });

    return [
      sumX / points.length,
      sumY / points.length,
    ];
  };

  const computeBBox = (points) => {
    const centroid = computeCentroid(points);

    let maxSquaredDist = 0;
    points.forEach((point) => {
      const squaredDist = (centroid[0] - point[0]) ** 2 + (centroid[1] - point[1]) ** 2;
      if (squaredDist > maxSquaredDist) maxSquaredDist = squaredDist;
    });

    const maxDist = Math.sqrt(maxSquaredDist);
    
    // returns [xMin, yMin, xMax, yMax]
    return [
      centroid[0] - maxDist,
      centroid[1] - maxDist,
      centroid[0] + maxDist,
      centroid[1] + maxDist,
    ];
  };

  const setPoints = newPoints => {
    isInit = false;

    numPoints = newPoints.length;

    stateTex = createStateTexture(newPoints);
    normalPointsIndexBuffer({
      usage: 'static',
      type: 'float',
      data: createPointIndex(numPoints)
    });

    searchIndex = new KDBush(
      newPoints,
      p => p[0],
      p => p[1],
      16
    );

    const pointsByCategory = _groupBy(newPoints, 2);
    const bboxByCategory = _mapValues(pointsByCategory, (_, category) => computeBBox(pointsByCategory[category]));
    bboxTex = createBBoxTexture(bboxByCategory);

    isInit = true;

    // allows patternManager to partition points so that points of a given category are rendered last
    // uses hoare partitioning scheme
    patternManager.setPartitioningFunc((category) => {
      let left = 0;
      let right = newPoints.length - 1;

      while (true) { // eslint-disable-line no-constant-condition
        while (newPoints[left][2] !== category && left < newPoints.length - 1) {
          left += 1;
        }
        while (newPoints[right][2] === category && right > 0) {
          right -= 1;
        }
        if (left >= right) break;

        const temp = newPoints[left];
        newPoints[left] = newPoints[right];
        newPoints[right] = temp;
      }

      stateTex = createStateTexture(newPoints);
    });
  };

  const draw = (time, showRecticleOnce = false) => {
    if (!isInit) return;

    regl.clear({
      // background color (transparent)
      color: [0, 0, 0, 0],
      depth: 1,
      stencil: 0,
    });
    patternManager.clear();

    isViewChanged = camera.tick();

    if (backgroundImage) {
      drawBackgroundImage();
    }

    patternManager.draw(time, animationMix, useColors, showPatterns);

    // The draw order of the following calls is important!
    drawPointBodies();
    if (!mouseDown && (showRecticle || showRecticleOnce)) drawRecticle();
    if (hoveredPoint >= 0) drawHoveredPoint();
    if (selection.length) drawSelectedPoint();

    lasso.draw();

    // Publish camera change
    if (isViewChanged) pubSub.publish('view', camera.view);
  };

  const drawRaf = withRaf(draw);

  const publicDraw = (newPoints, showRecticleOnce = false) => {
    if (newPoints) setPoints(newPoints);
    //drawRaf(showRecticleOnce);
  };

  const withDraw = f => (...args) => {
    const out = f(...args);
    drawRaf();
    return out;
  };

  const setBackground = newBackground => {
    if (!newBackground) return;

    background = toRgba(newBackground, true);
  };

  const setBackgroundImage = newBackgroundImage => {
    if (!newBackgroundImage) {
      backgroundImage = null;
    } else {
      backgroundImage = newBackgroundImage;
    }
  };

  const setLassoColor = newLassoColor => {
    if (!newLassoColor) return;

    lassoColor = toRgba(newLassoColor, true);

    lasso.setStyle({ color: lassoColor });
  };

  const setLassoMinDelay = newLassoMinDelay => {
    if (!+newLassoMinDelay) return;

    lassoMinDelay = +newLassoMinDelay;
    lassoExtendDb = withThrottle(lassoExtend, lassoMinDelay);
  };

  const setLassoMinDist = newLassoMinDist => {
    if (!+newLassoMinDist) return;

    lassoMinDist = +newLassoMinDist;
  };

  const setShowRecticle = newShowRecticle => {
    if (newShowRecticle === null) return;

    showRecticle = newShowRecticle;
  };

  const setRecticleColor = newRecticleColor => {
    if (!newRecticleColor) return;

    recticleColor = toRgba(newRecticleColor, true);

    recticleHLine.setStyle({ color: recticleColor });
    recticleVLine.setStyle({ color: recticleColor });
  };

  const setAnimationMix = (newAnimationMix) => {
    if (newAnimationMix === null) return;

    animationMix = newAnimationMix;
  }

  const setAnimateDepth = (newAnimateDepth) => {
    if (newAnimateDepth === null) return;

    animateDepth = newAnimateDepth;
  }

  const setShowPatterns = (newShowPatterns) => {
    if (newShowPatterns === null) return;

    showPatterns = newShowPatterns;
  }

  const setUseColors = (newUseColors) => {
    if (newUseColors === null) return;

    useColors = newUseColors;
  }

  const setUseSequence = (newUseSequence) => {
    if (newUseSequence === null) return;

    patternManager.setSequenceOptions({ useSequence: newUseSequence });
  }
  const setSequencePatternDuration = (newSequencePatternDuration) => {
    if (newSequencePatternDuration === null) return;

    patternManager.setSequenceOptions({ sequencePatternDuration: newSequencePatternDuration });
  }
  const setSequenceTransitionDuration = (newSequenceTransitionDuration) => {
    if (newSequenceTransitionDuration === null) return;

    patternManager.setSequenceOptions({ sequenceTransitionDuration: newSequenceTransitionDuration });
  }

  /**
   * Update Regl's viewport, drawingBufferWidth, and drawingBufferHeight
   *
   * @description Call this method after the viewport has changed, e.g., width
   * or height have been altered
   */
  const refresh = () => {
    regl.poll();
    camera.refresh();
  };

  const get = property => {
    if (property === 'background') return background;
    if (property === 'backgroundImage') return backgroundImage;
    if (property === 'colorBy') return colorBy;
    if (property === 'colors') return colors;
    if (property === 'lassoColor') return lassoColor;
    if (property === 'showRecticle') return showRecticle;
    if (property === 'recticleColor') return recticleColor;
    if (property === 'opacity') return opacity;
    if (property === 'pointOutlineWidth') return pointOutlineWidth;
    if (property === 'pointSize') return pointSize;
    if (property === 'pointSizeSelected') return pointSizeSelected;
    if (property === 'width') return width;
    if (property === 'height') return height;
    if (property === 'aspectRatio') return dataAspectRatio;
    if (property === 'canvas') return canvas;
    if (property === 'regl') return regl;
    if (property === 'version') return version;

    return undefined;
  };

  const set = ({
    background: newBackground = null,
    backgroundImage: newBackgroundImage = backgroundImage,
    colorBy: newColorBy = colorBy,
    colors: newColors = null,
    opacity: newOpacity = null,
    lassoColor: newLassoColor = null,
    lassoMinDelay: newLassoMinDelay = null,
    lassoMinDist: newLassoMinDist = null,
    showRecticle: newShowRecticle = null,
    recticleColor: newRecticleColor = null,
    pointOutlineWidth: newPointOutlineWidth = null,
    pointSize: newPointSize = null,
    pointSizeSelected: newPointSizeSelected = null,
    height: newHeight = null,
    width: newWidth = null,
    aspectRatio: newDataAspectRatio = null,
    animationMix: newAnimationMix = null,
    animateDepth: newAnimateDepth = null,
    showPatterns: newShowPatterns = null,
    useColors: newUseColors = null,
    useSequence: newUseSequence = null,
    sequencePatternDuration: newSequencePatternDuration = null,
    sequenceTransitionDuration: newSequenceTransitionDuration = null,
  } = {}) => {
    setBackground(newBackground);
    setBackgroundImage(newBackgroundImage);
    setColorBy(newColorBy);
    setColors(newColors);
    setOpacity(newOpacity);
    setLassoColor(newLassoColor);
    setLassoMinDelay(newLassoMinDelay);
    setLassoMinDist(newLassoMinDist);
    setShowRecticle(newShowRecticle);
    setRecticleColor(newRecticleColor);
    setPointOutlineWidth(newPointOutlineWidth);
    setPointSize(newPointSize);
    setPointSizeSelected(newPointSizeSelected);
    setHeight(newHeight);
    setWidth(newWidth);
    setDataAspectRatio(newDataAspectRatio);
    setAnimationMix(newAnimationMix);
    setAnimateDepth(newAnimateDepth);
    setShowPatterns(newShowPatterns);
    setUseColors(newUseColors);
    setUseSequence(newUseSequence);
    setSequencePatternDuration(newSequencePatternDuration);
    setSequenceTransitionDuration(newSequenceTransitionDuration);

    updateViewAspectRatio();
    camera.refresh();
    refresh();
    //drawRaf();
  };

  const hover = (point, showRecticleOnce = false) => {
    let needsRedraw = false;

    if (point >= 0) {
      needsRedraw = true;
      const newHoveredPoint = point !== hoveredPoint;
      hoveredPoint = point;
      hoveredPointIndexBuffer.subdata([point]);
      if (newHoveredPoint) pubSub.publish('pointover', hoveredPoint);
    } else {
      needsRedraw = hoveredPoint;
      hoveredPoint = undefined;
      if (+needsRedraw >= 0) pubSub.publish('pointout', needsRedraw);
    }

    //if (needsRedraw) drawRaf(null, showRecticleOnce);
  };

  const reset = () => {
    if (initialView) camera.set(mat4.clone(initialView));
    else camera.lookAt([...initialTarget], initialDistance, initialRotation);
    pubSub.publish('view', camera.view);
  };

  const keyUpHandler = ({ key }) => {
    switch (key) {
      case 'Escape':
        deselect();
        break;
      default:
      // Nothing
    }
  };

  const mouseEnterCanvasHandler = () => {
    isMouseInCanvas = true;
  };

  const mouseLeaveCanvasHandler = () => {
    hover();
    isMouseInCanvas = false;
    //drawRaf();
  };

  const initCamera = () => {
    camera = createDom2dCamera(canvas);

    if (initialView) camera.set(mat4.clone(initialView));
    else camera.lookAt([...initialTarget], initialDistance, initialRotation);
  };

  const wheelHandler = () => {
    //drawRaf();
  };

  const clear = () => {
    setPoints([]);
  };

  const init = () => {
    updateViewAspectRatio();
    initCamera();

    lasso = createLine(regl, { color: lassoColor, width: 3, is2d: true });
    recticleHLine = createLine(regl, {
      color: recticleColor,
      width: 1,
      is2d: true
    });
    recticleVLine = createLine(regl, {
      color: recticleColor,
      width: 1,
      is2d: true
    });

    // Event listeners
    canvas.addEventListener('wheel', wheelHandler);

    // Buffers
    normalPointsIndexBuffer = regl.buffer();
    selectedPointsIndexBuffer = regl.buffer();
    hoveredPointIndexBuffer = regl.buffer({
      usage: 'dynamic',
      type: 'float',
      length: FLOAT_BYTES // This buffer is fixed to exactly 1 point
    });

    colorTex = createColorTexture();

    // Set dimensions
    set({ width, height });

    // Setup event handler
    window.addEventListener('keyup', keyUpHandler, false);
    window.addEventListener('blur', blurHandler, false);
    window.addEventListener('mousedown', mouseDownHandler, false);
    window.addEventListener('mouseup', mouseUpHandler, false);
    window.addEventListener('mousemove', mouseMoveHandler, false);
    canvas.addEventListener('mouseenter', mouseEnterCanvasHandler, false);
    canvas.addEventListener('mouseleave', mouseLeaveCanvasHandler, false);
    canvas.addEventListener('click', mouseClickHandler, false);
    canvas.addEventListener('dblclick', mouseDblClickHandler, false);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    glBench = new GLBench(gl);

    regl.frame(({ time }) => {
      glBench.begin();
      draw(time);
      glBench.end();
      glBench.nextFrame(Math.floor(time * 1000));
    });
  };

  const destroy = () => {
    window.removeEventListener('keyup', keyUpHandler, false);
    window.removeEventListener('blur', blurHandler, false);
    window.removeEventListener('mousedown', mouseDownHandler, false);
    window.removeEventListener('mouseup', mouseUpHandler, false);
    window.removeEventListener('mousemove', mouseMoveHandler, false);
    canvas.removeEventListener('mouseenter', mouseEnterCanvasHandler, false);
    canvas.removeEventListener('mouseleave', mouseLeaveCanvasHandler, false);
    canvas.removeEventListener('click', mouseClickHandler, false);
    canvas.removeEventListener('dblclick', mouseDblClickHandler, false);
    canvas = undefined;
    camera = undefined;
    regl = undefined;
    lasso.destroy();
    pubSub.clear();
  };

  init(canvas);

  return {
    clear: withDraw(clear),
    deselect,
    destroy,
    draw: publicDraw,
    get,
    hover,
    refresh,
    reset: withDraw(reset),
    select,
    set,
    subscribe: pubSub.subscribe,
    unsubscribe: pubSub.unsubscribe,
    patternManager,
  };
};

export default createScatterplot;

export { createRegl, createTextureFromUrl };
