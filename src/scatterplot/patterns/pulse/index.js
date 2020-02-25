import vert from '../pattern.vert';
import frag from './pulse.frag';

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
      u_a: regl.prop('u_a'),
      u_c1: regl.prop('u_c1'),
      u_c2: regl.prop('u_c2'),
      u_minValue: regl.prop('u_minValue'),
      u_cyclesPerSecond: regl.prop('u_cyclesPerSecond'),
      u_wavesPerCycle: regl.prop('u_wavesPerCycle'),
      u_direction: regl.prop('u_direction'),
    },
    count: 6,
    framebuffer: fbo,
  });

  return (fbo, atlasSize, atlasIndex, time, {
    hsvColor = [0.5, 1, 1],
    a = 1,
    c1 = 0.1,
    c2 = 0.1,
    minValue = 0.2,
    cyclesPerSecond = 1,
    wavesPerCycle = 1,
    direction = 1,
  }) => {
    drawFn({
      u_resolution: [fbo.width, fbo.height],
      u_texAtlasSize: atlasSize,
      u_texAtlasIndex: atlasIndex,
      u_time: time,
      u_hsvColor: hsvColor,
      u_a: a,
      u_c1: c1,
      u_c2: c2,
      u_minValue: minValue,
      u_cyclesPerSecond: cyclesPerSecond,
      u_wavesPerCycle: wavesPerCycle,
      u_direction: direction,
    });
  };
}
