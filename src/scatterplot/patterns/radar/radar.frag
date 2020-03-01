precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 
#pragma glslify: hsv2rgb_smooth = require(../../glsl/hsv2rgb_smooth)

uniform vec3 hsvColor;
uniform float hueVariation;
uniform float hueVariationPeriod;
uniform vec2 resolution;
uniform float time;

uniform float gamma1;
uniform float gamma2;
uniform float maxValue;
uniform float minValue;
uniform float cyclesPerSecond;
uniform float nSpokes;
uniform float direction;
uniform vec3 animateBy;

varying vec2 posMin;
varying vec2 posMax;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 6.2831853071795864769252867665590;

// https://stackoverflow.com/a/22400799
float triangleWave(in float x, in float period) {
  float amplitude = 1.0;
  float halfPeriod = period / 2.0;
  return (amplitude / halfPeriod) * (halfPeriod - abs(mod(x, period) - halfPeriod));
}

float coolAbs(in float x) {
  return -abs(x - 1.0) + 1.0;
} 

float angleDifference(in float a, in float b, out float gamma) {
  float diff1 = mod((a - b), TAU / nSpokes);
  float diff2 = mod((b - a), TAU / nSpokes);

  float d1_less_equal_d2 = when_le(diff1, diff2);
  float d1_greater_than_d2 = when_gt(diff1, diff2);

  gamma = d1_less_equal_d2 * gamma2 + d1_greater_than_d2 * gamma1;
  return d1_less_equal_d2 * diff1 + d1_greater_than_d2 * diff2;
}

void main() {
  vec2 normalizedFragCoord = (gl_FragCoord.xy / resolution - posMin) / (posMax - posMin);

  float scaledTime = direction * time * cyclesPerSecond;

  float timeAngle = scaledTime * TAU;

  vec2 centerDist = normalizedFragCoord - vec2(0.5, 0.5);
  float fragAngle = atan(centerDist.x, centerDist.y) + PI; // from [-pi, pi] to [0, 2pi]
  float gamma;
  float angleDist = angleDifference(fragAngle, timeAngle, gamma) * nSpokes / PI;

  float value = pow(1.0 - angleDist, gamma); // gamma

  value = value * (maxValue - minValue) + minValue;

  float hue = abs(hsvColor.x + (triangleWave(time, hueVariationPeriod) * 2.0 - 1.0) * hueVariation);

  float animateSaturation = animateBy[0] * value - animateBy[0] + 1.0; // linear interpolation
  float animateValue = animateBy[1] * value - animateBy[1] + 1.0; // linear interpolation
  float animateAlpha = animateBy[2] * value - animateBy[2] + 1.0; // linear interpolation

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, animateSaturation * hsvColor.y, animateValue * hsvColor.z)), animateAlpha);
}
