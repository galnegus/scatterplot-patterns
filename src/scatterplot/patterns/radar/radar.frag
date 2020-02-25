precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 

uniform vec3 u_hsvColor;
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_gamma1;
uniform float u_gamma2;
uniform float u_minValue;
uniform float u_cyclesPerSecond;
uniform float u_nSpokes;
uniform float u_direction;

varying vec2 v_min;
varying vec2 v_max;

const float PI = 3.1415926535897932384626433832795;
const float TAU = 6.2831853071795864769252867665590;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing 
  return c.z * mix( vec3(1.0), rgb, c.y);
}

float angleDistance(in float a, in float b, out float gamma) {
  float diff1 = mod((a - b), TAU);
  float diff2 = mod((b - a), TAU);

  float d1_less_equal_d2 = when_le(diff1, diff2);
  float d1_greater_than_d2 = when_gt(diff1, diff2);

  gamma = d1_less_equal_d2 * u_gamma2 + d1_greater_than_d2 * u_gamma1;
  return d1_less_equal_d2 * diff1 + d1_greater_than_d2 * diff2;
}

void main() {
  vec2 normalizedFragCoord = (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min);

  float scaledTime = u_direction * u_time * u_cyclesPerSecond;

  float timeAngle = scaledTime * TAU;

  vec2 diff = normalizedFragCoord - vec2(0.5, 0.5);
  float fragAngle = atan(diff.x, diff.y) + PI; // from [-pi, pi] to [0, 2pi]
  float gamma;
  float value = clamp(angleDistance(fragAngle, timeAngle, gamma) / PI, 0.0, 1.0);

  value = pow(value, gamma);
  value = value * (1.0 - u_minValue) + u_minValue;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(u_hsvColor.xy, value)), 1.0);
}
