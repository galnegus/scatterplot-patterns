import vert from '../pattern.vert';
import frag from './pulse.frag';

export const defaultOptions = {
  hsvColor: [0.5, 1, 1],
  a: 1,
  c1: 0.1,
  c2: 0.1,
  minValue: 0.2,
  cyclesPerSecond: 1,
  wavesPerCycle: 1,
  direction: 1,
  hueVariation: 0.1,
  hueVariationPeriod: 2,
};

export default function createPulseDraw(regl, fbo) { 
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
      a: regl.prop('a'),
      c1: regl.prop('c1'),
      c2: regl.prop('c2'),
      minValue: regl.prop('minValue'),
      cyclesPerSecond: regl.prop('cyclesPerSecond'),
      wavesPerCycle: regl.prop('wavesPerCycle'),
      direction: regl.prop('direction'),
      hueVariation: regl.prop('hueVariation'),
      hueVariationPeriod: regl.prop('hueVariationPeriod'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, texAtlasSize, texAtlasIndex, time, animateBy, options) => {
    const {
      hsvColor, a, c1, c2, minValue, cyclesPerSecond, wavesPerCycle,
      direction, hueVariation, hueVariationPeriod
    } = { ...defaultOptions, ...options};
    
    drawFn({
      resolution: [fbo.width, fbo.height],
      texAtlasSize,
      texAtlasIndex,
      time,
      animateBy,
      hsvColor,
      a,
      c1,
      c2,
      minValue,
      cyclesPerSecond,
      wavesPerCycle,
      direction,
      hueVariation,
      hueVariationPeriod,
    });
  };
}
