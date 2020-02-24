precision mediump float;

uniform vec2 u_resolution;

varying vec2 v_min;
varying vec2 v_max;
uniform vec4 u_color;

void main () {
  vec2 normalizedFragCoord = (gl_FragCoord.xy) / u_resolution;
  normalizedFragCoord = (normalizedFragCoord - v_min) / (v_max.x - v_min.x); 

  vec2 center = vec2(0.5, 0.5);

  float dist = distance(normalizedFragCoord, center);
  dist = pow(dist, 0.5);

  float cool = normalizedFragCoord.x * normalizedFragCoord.y;

  gl_FragColor = vec4((1.0 - dist) * u_color.rgb, 1);
}
