precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 
#pragma glslify: when_eq = require(glsl-conditionals/when_eq) 
#pragma glslify: hsv2rgb_smooth = require(../../glsl/hsv2rgb_smooth)
#pragma glslify: normalizeFragCoords = require(../../glsl/normalizeFragCoords)

uniform vec3 hsvColor;
uniform vec2 resolution;
uniform float time;
uniform float sequenceValue;
uniform bool useColors;

uniform float wavesPerCycle;
uniform float invert;
uniform vec3 animationMix;

uniform float a;
uniform float c1;
uniform float c2;
uniform float minValue;
uniform float curve;

varying float scaledTime;
varying float hue;

varying vec2 posMin;
varying vec2 posMax;

const float PI = 3.1415926535897932384626433832795;

float gauss(in float diff) {
  float c = c1 * when_gt(diff, 0.0) + c2 * when_le(diff, 0.0);
  return a * exp(-pow(diff, 2.0)/(2.0 * c * c));
}

void main() {
  vec2 normalizedFragCoord = normalizeFragCoords(resolution, posMin, posMax);

  vec2 centerDiff = normalizedFragCoord - vec2(0.5, 0.5);
  float fragAngle = atan(centerDiff.x, centerDiff.y);

  float dist = distance(normalizedFragCoord, vec2(0.5, 0.5)) * 2.0 + fragAngle * curve * PI;

  float diff = mod(dist - scaledTime, 1.0 / wavesPerCycle);
  float leftDiff = gauss(diff - 1.0 / wavesPerCycle);
  float middleDiff = gauss(diff);
  float rightDiff = gauss(diff + 1.0 / wavesPerCycle);

  float value = max(leftDiff, max(middleDiff, rightDiff));

  value = when_eq(invert, 1.0) * (value * -1.0 + 1.0) + when_eq(invert, 0.0) * value; 
  value *= sequenceValue;
  value = value * (1.0 - minValue) + minValue;
  
  float animateSaturation = mix(1.0, value, animationMix[0]) * float(useColors);
  float animateValue = mix(1.0, value, animationMix[1]);
  float animateAlpha = mix(1.0, value, animationMix[2]);

  float whenUseColors = when_eq(float(useColors), 1.0);
  float whenNotUseColors = 1.0 - whenUseColors;
  float colorValue = whenUseColors * hsvColor.z + whenNotUseColors * 1.0;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, animateSaturation * hsvColor.y, animateValue * colorValue)), animateAlpha);
}
