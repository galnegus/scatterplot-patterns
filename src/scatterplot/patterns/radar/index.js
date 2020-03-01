import vert from '../pattern.vert';
import frag from './radar.frag';

export const defaultOptions = {
  hsvColor: [0.8, 1, 1],
  gamma1: 2.0,
  gamma2: 2.0,
  maxValue: 1,
  minValue: 0.5,
  cyclesPerSecond: 1,
  nSpokes: 2,
  direction: 1,
  invert: 0,
  hueVariation: 0.05,
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
      animationMix: regl.prop('animationMix'),
      useColors: regl.prop('useColors'),
      
      hsvColor: regl.prop('hsvColor'),
      gamma1: regl.prop('gamma1'),
      gamma2: regl.prop('gamma2'),
      maxValue: regl.prop('maxValue'),
      minValue: regl.prop('minValue'),
      cyclesPerSecond: regl.prop('cyclesPerSecond'),
      nSpokes: regl.prop('nSpokes'),
      direction: regl.prop('direction'),
      invert: regl.prop('invert'),
      hueVariation: regl.prop('hueVariation'),
      hueVariationPeriod: regl.prop('hueVariationPeriod'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, texAtlasSize, texAtlasIndex, time, animationMix, useColors, options) => {
    const { 
      hsvColor, gamma1, gamma2, maxValue, minValue, cyclesPerSecond,
      nSpokes, direction, invert, hueVariation, hueVariationPeriod,
    } = { ...defaultOptions, ...options };

    drawFn({
      resolution: [fbo.width, fbo.height],
      texAtlasSize,
      texAtlasIndex,
      time,
      animationMix,
      useColors,
      hsvColor,
      gamma1,
      gamma2,
      maxValue,
      minValue,
      cyclesPerSecond,
      nSpokes,
      direction,
      invert,
      hueVariation,
      hueVariationPeriod,
    });
  };
}
