precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 
#pragma glslify: hsv2rgb_smooth = require(../../glsl/hsv2rgb_smooth)

uniform vec3 hsvColor;
uniform float hueVariation;
uniform float hueVariationPeriod;
uniform vec2 resolution;
uniform float time;
uniform float cyclesPerSecond;
uniform float wavesPerCycle;
uniform float direction;
uniform vec3 animateBy;

uniform float a;
uniform float c1;
uniform float c2;
uniform float minValue;

varying vec2 posMin;
varying vec2 posMax;


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
  float hue = abs(hsvColor.x + (triangleWave(time, hueVariationPeriod) * 2.0 - 1.0) * hueVariation);

  float animateSaturation = animateBy[0] * value - animateBy[0] + 1.0; // linear interpolation
  float animateValue = animateBy[1] * value - animateBy[1] + 1.0; // linear interpolation
  float animateAlpha = animateBy[2] * value - animateBy[2] + 1.0; // linear interpolation

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, animateSaturation * hsvColor.y, animateValue * hsvColor.z)), animateAlpha);
}
