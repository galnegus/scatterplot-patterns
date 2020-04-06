import vert from './radar.vert';
import frag from './radar.frag';

export const defaultOptions = {
  gamma1: 2.0,
  gamma2: 2.0,
  maxValue: 1,
  minValue: 0.5,
  phaseShift: 0,
  cyclesPerSecond: 1,
  nSpokes: 2,
  direction: 1,
  invert: 0,
  curve: 0,
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
      sequenceValue: regl.prop('sequenceValue'),
      animationMix: regl.prop('animationMix'),
      useColors: regl.prop('useColors'),
      
      hsvColor: regl.prop('hsvColor'),
      gamma1: regl.prop('gamma1'),
      gamma2: regl.prop('gamma2'),
      maxValue: regl.prop('maxValue'),
      minValue: regl.prop('minValue'),
      phaseShift: regl.prop('phaseShift'),
      cyclesPerSecond: regl.prop('cyclesPerSecond'),
      nSpokes: regl.prop('nSpokes'),
      direction: regl.prop('direction'),
      invert: regl.prop('invert'),
      curve: regl.prop('curve'),
      hueVariation: regl.prop('hueVariation'),
      hueVariationPeriod: regl.prop('hueVariationPeriod'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, texAtlasSize, texAtlasIndex, time, sequenceValue, animationMix, useColors, options) => {
    const { 
      hsvColor, gamma1, gamma2, maxValue, minValue, phaseShift, cyclesPerSecond,
      nSpokes, direction, invert, curve, hueVariation, hueVariationPeriod,
    } = { ...defaultOptions, ...options };

    drawFn({
      resolution: [fbo.width, fbo.height],
      texAtlasSize,
      texAtlasIndex,
      time,
      sequenceValue,
      animationMix,
      useColors,
      hsvColor,
      gamma1,
      gamma2,
      maxValue,
      minValue,
      phaseShift,
      cyclesPerSecond,
      nSpokes,
      direction,
      invert,
      curve,
      hueVariation,
      hueVariationPeriod,
    });
  };
}
