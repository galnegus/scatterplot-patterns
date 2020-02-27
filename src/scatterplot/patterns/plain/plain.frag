precision mediump float;

uniform vec2 resolution;
uniform vec4 color;

varying vec2 posMin;
varying vec2 posMax;

vec2 normalizeFragCoords() {
  return (gl_FragCoord.xy / (resolution) - posMin) / (posMax - posMin); 
}

void main () {
  vec2 normalizedFragCoord = normalizeFragCoords();

  vec2 center = vec2(0.5, 0.5);

  float dist = distance(normalizedFragCoord, center) * 2.0;
  dist = pow(dist, 0.5);

  gl_FragColor = vec4((1.0 - dist) * color.rgb, 1);
}
