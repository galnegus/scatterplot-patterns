import vert from '../pattern.vert';
import frag from './radar.frag';

export default function createRadarDraw(regl, fbo) { 
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
      u_gamma1: regl.prop('u_gamma1'),
      u_gamma2: regl.prop('u_gamma2'),
      u_minValue: regl.prop('u_minValue'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, { hsvColor = [0.8, 1, 1], gamma1 = 5.0, gamma2 = 5.0, minValue = 0.2, }) => {
    drawFn({
      u_resolution: [fbo.width, fbo.height],
      u_texAtlasSize: atlasSize,
      u_texAtlasIndex: atlasIndex,
      u_time: (time * 0.5) % 1,
      u_hsvColor: hsvColor,
      u_gamma1: gamma1,
      u_gamma2: gamma2,
      u_minValue: minValue,
    });
  };
}
