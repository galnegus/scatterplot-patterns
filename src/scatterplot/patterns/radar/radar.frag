precision mediump float;

uniform vec3 u_hsvColor;
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_gamma1;
uniform float u_gamma2;
uniform float u_minValue;

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
  if (diff1 < diff2) {
    gamma = u_gamma2;
    return diff1; // play around with sign to change direction etc
  } else {
    gamma = u_gamma1;
    return diff2; // play around with sign to change direction etc
  }
}

void main() {
  vec2 normalizedFragCoord = (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min);

  float fastTime = pow(u_time, 0.9);

  float timeAngle = fastTime * TAU;

  vec2 diff = normalizedFragCoord - vec2(0.5, 0.5);
  float fragAngle = atan(diff.x, diff.y) + PI; // from [-pi, pi] to [0, 2pi]
  float gamma;
  float value = clamp(angleDistance(fragAngle, timeAngle, gamma) / PI, 0.0, 1.0);

  value = pow(value, gamma);
  value = value * (1.0 - u_minValue) + u_minValue;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(u_hsvColor.xy, value)), 1.0);
}
