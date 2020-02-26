precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 

uniform vec3 u_hsvColor;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_cyclesPerSecond;
uniform float u_wavesPerCycle;
uniform float u_direction;

uniform float u_a;
uniform float u_c1;
uniform float u_c2;
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

float gauss(in float diff) {
  float coolDiff = diff / u_wavesPerCycle;
  float c = u_c1 * when_gt(coolDiff, 0.0) + u_c2 * when_le(coolDiff, 0.0);
  return u_a * exp(-pow(coolDiff, 2.0)/(2.0 * c * c));
}

void main() {
  vec2 normalizedFragCoord = (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min); 

  float dist = distance(normalizedFragCoord, vec2(0.5, 0.5)) * 2.0;

  float scaledTime = u_direction * u_cyclesPerSecond * u_time;

  float diff = dist - scaledTime;
  diff = mod(diff, 1.0 / u_wavesPerCycle);

  float newD = diff * u_wavesPerCycle - 0.5;
  float leftTerm = floor(newD) / u_wavesPerCycle;
  float rightTerm = ceil(newD) / u_wavesPerCycle;

  float leftDiff = gauss(newD);
  float rightDiff = gauss(newD);

  float maxDiff = max(leftDiff, rightDiff);

  float value = maxDiff * (1.0 - u_minValue) + u_minValue;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(u_hsvColor.xy, value)), 1.0);
}
