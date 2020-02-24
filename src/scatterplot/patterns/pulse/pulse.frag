precision mediump float;

uniform vec3 u_hsvColor;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_min;
varying vec2 v_max;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb_smooth( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing 
  return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
  bool smooth = false;

  vec2 normalizedFragCoord = (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min); 

  float dist = length(normalizedFragCoord - vec2(0.5, 0.5));

  float leftDiff, middleDiff, rightDiff;

  if (smooth) {
    leftDiff = abs(dist - (u_time - 1.0));
    middleDiff = abs(dist - (u_time));
    rightDiff = abs(dist - (u_time + 1.0));
  } else {
    leftDiff = mod(dist - (u_time - 1.0), 1.0);
    middleDiff = mod(dist - (u_time), 1.0);
    rightDiff = mod(dist - (u_time + 1.0), 1.0);
  }

  float minDiff = min(leftDiff, min(middleDiff, rightDiff));

  float value = (1.0 - minDiff) / 2.0 + 0.5;

  value = pow(value, 5.0);
  value = value / 2.0 + 0.5;

  float cool = normalizedFragCoord.x * normalizedFragCoord.y;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(u_hsvColor.xy, value)), 1.0);
}
