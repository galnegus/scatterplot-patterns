precision mediump float;

attribute vec2 a_position;

uniform vec2 u_resolution;
uniform float u_texAtlasIndex;
uniform vec2 u_texAtlasSize;
uniform float u_time;

varying vec2 v_min;
varying vec2 v_max;

float modI(float a, float b) {
  float m = a - floor((a + 0.5) / b) * b;
  return floor(m + 0.5);
}

void main () {
  float maxLength = u_texAtlasSize.x * u_texAtlasSize.y;
  float modIndex = modI(u_texAtlasIndex, maxLength);

  float yIndex = floor((modIndex + 0.5) / u_texAtlasSize.x);
  float xIndex = modI(modIndex, u_texAtlasSize.x);

  float yStep = 1.0 / float(u_texAtlasSize.y);
  float xStep = 1.0 / float(u_texAtlasSize.x);

  v_min = vec2(xIndex * xStep, yIndex * yStep);
  v_max = vec2((xIndex + 1.0) * xStep, (yIndex + 1.0) * yStep);

  vec2 texPos = (a_position + 1.0) * 0.5;
  texPos = texPos * (v_max - v_min) + v_min;
  texPos = texPos * 2.0 - 1.0; 

  gl_Position = vec4(texPos, 0, 1);
}
