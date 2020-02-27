precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 

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

varying vec2 posMin;
varying vec2 posMax;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 6.2831853071795864769252867665590;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing 
  return c.z * mix( vec3(1.0), rgb, c.y);
}

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

  float hue = hsvColor.x + (pow(triangleWave(time, hueVariationPeriod), 1.0) * 2.0 - 1.0) * hueVariation;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, hsvColor.y, value * hsvColor.z)), 1.0);
}
