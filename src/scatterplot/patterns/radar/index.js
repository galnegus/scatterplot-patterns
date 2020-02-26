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
      u_maxValue: regl.prop('u_maxValue'),
      u_minValue: regl.prop('u_minValue'),
      u_cyclesPerSecond: regl.prop('u_cyclesPerSecond'),
      u_nSpokes: regl.prop('u_nSpokes'),
      u_direction: regl.prop('u_direction'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, {
    hsvColor = [0.8, 1, 1],
    gamma1 = 5.0,
    gamma2 = 5.0,
    maxValue = 1,
    minValue = 0.2,
    cyclesPerSecond = 1,
    nSpokes = 2,
    direction = 1,
  }) => {
    drawFn({
      u_resolution: [fbo.width, fbo.height],
      u_texAtlasSize: atlasSize,
      u_texAtlasIndex: atlasIndex,
      u_time: time,
      u_hsvColor: hsvColor,
      u_gamma1: gamma1,
      u_gamma2: gamma2,
      u_maxValue: maxValue,
      u_minValue: minValue,
      u_cyclesPerSecond: cyclesPerSecond,
      u_nSpokes: nSpokes,
      u_direction: direction,
    });
  };
}
