#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

varying vec4 color;
varying vec2 uv;
uniform bool animateDepth;

void main() {
  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);

  if (animateDepth) {
    alpha = 1.0 - step(1.0, r);
    if (alpha < 1.0) discard;
    gl_FragColor = vec4(color.rgb, alpha);
  } else {
    #ifdef GL_OES_standard_derivatives
      delta = fwidth(r);
      alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
    #endif

    gl_FragColor = vec4(color.rgb, alpha * color.a);
  }
  //if (alpha < 0.33) discard;
  //gl_FragColor = vec4(color.rgb, alpha);
}
