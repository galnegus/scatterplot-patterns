import vert from '../pattern.vert';
import frag from './plain.frag';

export default function createPlainDraw(regl, fbo) { 
  const drawFn = regl({
    frag: frag,
    vert: vert,
    attributes: {
      a_position: regl.buffer([
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]),
    },
    uniforms: {
      u_resolution: regl.prop('u_resolution'),
      u_texAtlasIndex: regl.prop('u_texAtlasIndex'),
      u_texAtlasSize: regl.prop('u_texAtlasSize'),
      u_time: regl.prop('u_time'),
      u_color: regl.prop('u_color'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, { color }) => {
    drawFn({
      u_resolution: [fbo.width, fbo.height],
      u_texAtlasSize: atlasSize,
      u_texAtlasIndex: atlasIndex,
      u_time: (time * 0.5) % 1,
      u_color: color,
    });
  };
}
