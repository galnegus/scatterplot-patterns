import vert from '../pattern.vert';
import frag from './radar.frag';

export const defaultOptions = {
  hsvColor: [0.8, 1, 1],
  gamma1: 2.0,
  gamma2: 2.0,
  maxValue: 1,
  minValue: 0.2,
  cyclesPerSecond: 1,
  nSpokes: 2,
  direction: 1,
  hueVariation: 0.1,
  hueVariationPeriod: 2,
}

export default function createRadarDraw(regl, fbo) { 
  const drawFn = regl({
    frag: frag,
    vert: vert,
    attributes: {
      position: regl.buffer([
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]),
    },
    uniforms: {
      resolution: regl.prop('resolution'),
      texAtlasIndex: regl.prop('texAtlasIndex'),
      texAtlasSize: regl.prop('texAtlasSize'),
      time: regl.prop('time'),
      animateBy: regl.prop('animateBy'),
      
      hsvColor: regl.prop('hsvColor'),
      gamma1: regl.prop('gamma1'),
      gamma2: regl.prop('gamma2'),
      maxValue: regl.prop('maxValue'),
      minValue: regl.prop('minValue'),
      cyclesPerSecond: regl.prop('cyclesPerSecond'),
      nSpokes: regl.prop('nSpokes'),
      direction: regl.prop('direction'),
      hueVariation: regl.prop('hueVariation'),
      hueVariationPeriod: regl.prop('hueVariationPeriod'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, texAtlasSize, texAtlasIndex, time, animateBy, options) => {
    const { 
      hsvColor, gamma1, gamma2, maxValue, minValue, cyclesPerSecond,
      nSpokes, direction, hueVariation, hueVariationPeriod,
    } = { ...defaultOptions, ...options };

    drawFn({
      resolution: [fbo.width, fbo.height],
      texAtlasSize,
      texAtlasIndex,
      time,
      animateBy,
      hsvColor,
      gamma1,
      gamma2,
      maxValue,
      minValue,
      cyclesPerSecond,
      nSpokes,
      direction,
      hueVariation,
      hueVariationPeriod,
    });
  };
}
