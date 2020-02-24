precision mediump float;

uniform vec3 u_hsvColor;
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_gaussA;
uniform float u_gaussC1;
uniform float u_gaussC2;
uniform float u_minValue;

varying vec2 v_min;
varying vec2 v_max;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing 
  return c.z * mix( vec3(1.0), rgb, c.y);
}

float gauss(in float x, in float b) {
  float diff = (x-b);

  if (diff > 0.0) {
    return u_gaussA * exp(-pow(diff, 2.0)/(2.0 * u_gaussC1 * u_gaussC1));
  } else {
    return u_gaussA * exp(-pow(diff, 2.0)/(2.0 * u_gaussC2 * u_gaussC2));
  }
}

void main() {

  vec2 normalizedFragCoord = (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min); 

  float dist = length(normalizedFragCoord - vec2(0.5, 0.5));

  float a = 1.0;
  float c2 = 0.1;
  float c1 = 0.05;
  float minValue = 0.2;

  float leftDiff, middleDiff, rightDiff;

  leftDiff = gauss(dist, u_time - 1.0);
  middleDiff = gauss(dist, u_time);
  rightDiff = gauss(dist, u_time + 1.0);

  float maxDiff = max(leftDiff, max(middleDiff, rightDiff));

  float value = maxDiff * (1.0 - u_minValue) + u_minValue;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(u_hsvColor.xy, value)), 1.0);
}
