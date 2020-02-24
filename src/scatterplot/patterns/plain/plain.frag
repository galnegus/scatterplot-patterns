precision mediump float;

uniform vec2 u_resolution;
uniform vec4 u_color;

varying vec2 v_min;
varying vec2 v_max;

vec2 normalizeFragCoords() {
  return (gl_FragCoord.xy / u_resolution - v_min) / (v_max - v_min); 
}

void main () {
  vec2 normalizedFragCoord = normalizeFragCoords();

  vec2 center = vec2(0.5, 0.5);

  float dist = distance(normalizedFragCoord, center);
  dist = pow(dist, 0.5);

  gl_FragColor = vec4((1.0 - dist) * u_color.rgb, 1);
}
