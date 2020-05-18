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

uniform float gamma1;
uniform float gamma2;
uniform float maxValue;
uniform float minValue;
uniform float nSpokes;
uniform float invert;
uniform float curve;

uniform vec3 animationMix;

varying float timeAngle;
varying float hue;

varying vec2 posMin;
varying vec2 posMax;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 6.2831853071795864769252867665590;

float angleDifference(in float a, in float b, out float gamma) {
  float diff1 = mod((a - b), TAU / nSpokes);
  float diff2 = mod((b - a), TAU / nSpokes);

  float d1_less_equal_d2 = when_le(diff1, diff2);
  float d1_greater_than_d2 = when_gt(diff1, diff2);

  gamma = d1_less_equal_d2 * gamma2 + d1_greater_than_d2 * gamma1;
  return d1_less_equal_d2 * diff1 + d1_greater_than_d2 * diff2;
}

void main() {
  vec2 normalizedFragCoord = normalizeFragCoords(resolution, posMin, posMax);

  float centerDist = distance(normalizedFragCoord, vec2(0.5, 0.5)) * 2.0;
  vec2 centerDiff = normalizedFragCoord - vec2(0.5, 0.5);
  
  float fragAngle = atan(centerDiff.x, centerDiff.y) + PI; // from [-pi, pi] to [0, 2pi]
  fragAngle = mod(fragAngle + centerDist * PI * curve, TAU);

  float gamma;
  float angleDist = angleDifference(fragAngle, timeAngle, gamma) * nSpokes / PI;

  // this fixes a bug where some rare pixels are not defined (presumably because of negative value?)
  angleDist = clamp(angleDist, 0.0, 1.0);

  float value = pow(1.0 - angleDist, gamma); // gamma
  value = when_eq(invert, 1.0) * (value * -1.0 + 1.0) + when_eq(invert, 0.0) * value; 
  value *= sequenceValue;
  value = value * (maxValue - minValue) + minValue;

  float animateSaturation = mix(1.0, value, animationMix[0]) * float(useColors);
  float animateValue = mix(1.0, value, animationMix[1]);
  float animateAlpha = mix(1.0, value, animationMix[2]);

  float whenUseColors = when_eq(float(useColors), 1.0);
  float whenNotUseColors = 1.0 - whenUseColors;
  float colorValue = whenUseColors * hsvColor.z + whenNotUseColors * 1.0;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, animateSaturation * hsvColor.y, animateValue * colorValue)), animateAlpha);
}
