precision mediump float;

attribute vec2 position;

uniform float texAtlasIndex;
uniform vec2 texAtlasSize;
uniform float time;

varying vec2 posMin;
varying vec2 posMax;

float modI(float a, float b) {
  float m = a - floor((a + 0.5) / b) * b;
  return floor(m + 0.5);
}

void main () {
  float maxLength = texAtlasSize.x * texAtlasSize.y;
  float modIndex = modI(texAtlasIndex, maxLength);

  float yIndex = floor((modIndex + 0.5) / texAtlasSize.x);
  float xIndex = modI(modIndex, texAtlasSize.x);

  float yStep = 1.0 / float(texAtlasSize.y);
  float xStep = 1.0 / float(texAtlasSize.x);

  posMin = vec2(xIndex * xStep, yIndex * yStep);
  posMax = vec2((xIndex + 1.0) * xStep, (yIndex + 1.0) * yStep);

  vec2 texPos = (position + 1.0) * 0.5;
  texPos = texPos * (posMax - posMin) + posMin;
  texPos = texPos * 2.0 - 1.0; 

  gl_Position = vec4(texPos, 0, 1);
}
