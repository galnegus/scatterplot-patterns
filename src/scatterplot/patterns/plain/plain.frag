precision mediump float;

#pragma glslify: normalizeFragCoords = require(../../glsl/normalizeFragCoords)
#pragma glslify: hsv2rgb_smooth = require(../../glsl/hsv2rgb_smooth)
#pragma glslify: when_eq = require(glsl-conditionals/when_eq) 

uniform vec2 resolution;
uniform vec3 hsvColor;
uniform bool useColors;

varying vec2 posMin;
varying vec2 posMax;

void main () {
  vec2 normalizedFragCoord = normalizeFragCoords(resolution, posMin, posMax);

  float whenUseColors = when_eq(float(useColors), 1.0);
  float whenNotUseColors = 1.0 - whenUseColors;

  float value = whenUseColors * hsvColor.z + whenNotUseColors * 1.0;

  gl_FragColor = vec4(hsv2rgb_smooth(vec3(hsvColor.x, hsvColor.y * float(useColors), value)), 1);
}
