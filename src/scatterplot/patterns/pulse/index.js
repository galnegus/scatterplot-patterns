import vert from '../pattern.vert';
import frag from './pulse2.frag';

export default function createPulseDraw(regl, fbo) { 
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
      u_hsvColor: regl.prop('u_hsvColor'),
      u_gaussA: regl.prop('u_gaussA'),
      u_gaussC1: regl.prop('u_gaussC1'),
      u_gaussC2: regl.prop('u_gaussC2'),
      u_minValue: regl.prop('u_minValue'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, { hsvColor = [0.5, 1, 1], a = 1, c1 = 0.1, c2 = 0.1, minValue = 0.2 }) => {
    drawFn({
      u_resolution: [fbo.width, fbo.height],
      u_texAtlasSize: atlasSize,
      u_texAtlasIndex: atlasIndex,
      u_time: (time * 0.5) % 1,
      u_hsvColor: hsvColor,
      u_gaussA: a,
      u_gaussC1: c1,
      u_gaussC2: c2,
      u_minValue: minValue,
    });
  };
}
