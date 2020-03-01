precision mediump float;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)
#pragma glslify: when_le = require(glsl-conditionals/when_le) 
#pragma glslify: when_eq = require(glsl-conditionals/when_eq) 
#pragma glslify: hsv2rgb_smooth = require(../../glsl/hsv2rgb_smooth)
#pragma glslify: normalizeFragCoords = require(../../glsl/normalizeFragCoords)
#pragma glslify: hueWave = require(../../glsl/hueWave)

uniform vec3 hsvColor;
uniform float hueVariation;
uniform float hueVariationPeriod;
uniform vec2 resolution;
uniform float time;
uniform bool useColors;

uniform float cyclesPerSecond;
uniform float wavesPerCycle;
uniform float direction;
uniform float invert;
uniform vec3 animationMix;

uniform float a;
uniform float c1;
uniform float c2;
uniform float minValue;

varying vec2 posMin;
varying vec2 posMax;

float gauss(in float diff) {
  float coolDiff = diff / wavesPerCycle;
  float c = c1 * when_gt(coolDiff, 0.0) + c2 * when_le(coolDiff, 0.0);
  return a * exp(-pow(coolDiff, 2.0)/(2.0 * c * c));
}

void main() {
  vec2 normalizedFragCoord = normalizeFragCoords(resolution, posMin, posMax);

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

  value = when_eq(invert, 1.0) * (value * -1.0 + 1.0) + when_eq(invert, 0.0) * value; 
  value = value * (1.0 - minValue) + minValue;
  
  float hue = hueWave(hsvColor.x, time, hueVariationPeriod, hueVariation);
  float animateSaturation = mix(1.0, value, animationMix[0]) * float(useColors);
  float animateValue = mix(1.0, value, animationMix[1]);
  float animateAlpha = mix(1.0, value, animationMix[2]);

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hue, animateSaturation * hsvColor.y, animateValue * hsvColor.z)), animateAlpha);
}
