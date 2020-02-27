precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 

uniform vec3 hsvColor;
uniform float hueVariation;
uniform float hueVariationPeriod;
uniform vec2 resolution;
uniform float time;
uniform float cyclesPerSecond;
uniform float wavesPerCycle;
uniform float direction;

uniform float a;
uniform float c1;
uniform float c2;
uniform float minValue;

varying vec2 posMin;
varying vec2 posMax;

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

float gauss(in float diff) {
  float coolDiff = diff / wavesPerCycle;
  float c = c1 * when_gt(coolDiff, 0.0) + c2 * when_le(coolDiff, 0.0);
  return a * exp(-pow(coolDiff, 2.0)/(2.0 * c * c));
}

void main() {
  vec2 normalizedFragCoord = (gl_FragCoord.xy / resolution - posMin) / (posMax - posMin); 

  float dist = distance(normalizedFragCoord, vec2(0.5, 0.5)) * 2.0;

  float scaledTime = direction * cyclesPerSecond * time;

  float diff = dist - scaledTime;
  diff = mod(diff, 1.0 / wavesPerCycle);

  float newD = diff * wavesPerCycle - 0.5;
  float leftTerm = floor(newD) / wavesPerCycle;
  float rightTerm = ceil(newD) / wavesPerCycle;

  float leftDiff = gauss(newD);
  float rightDiff = gauss(newD);

  float value = max(leftDiff, rightDiff);

  value = value * (1.0 - minValue) + minValue;
  float hue = hsvColor.x + (pow(triangleWave(time, hueVariationPeriod), 1.0) * 2.0 - 1.0) * hueVariation;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, hsvColor.y, value * hsvColor.z)), 1.0);
}
