import vert from '../pattern.vert';
import frag from './plain.frag';

export default function createPlainDraw(regl, fbo) { 
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
      hsvColor: regl.prop('hsvColor'),
      useColors: regl.prop('useColors'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, sequenceValue, animationMix, useColors, { hsvColor }) => {
    drawFn({
      resolution: [fbo.width, fbo.height],
      texAtlasSize: atlasSize,
      texAtlasIndex: atlasIndex,
      time: (time * 0.5) % 1,
      useColors,
      hsvColor: hsvColor,
    });
  };
}
