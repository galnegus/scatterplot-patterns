#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

varying vec4 color;
varying vec2 uv;

void main() {
  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);

  #ifdef GL_OES_standard_derivatives
    delta = fwidth(r);
    alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
  #endif

  // TODO: Move this out of the shader! It's totally unnecessary
  // this can (should) be computed before, in the javascript, otherwise it has to be recomputed for every single pixel in every single point
  // SOLUTION: make a texture, exactly like with stateTex and colorTex, with three values (min, max, aspectRatio), I think that's all we need
  // for now just change this to send in a vec3 (min, max, aspectRatio).

  // ALSO: If the color is the same for all pixels of the same point => do computation in vertex shader and pass the results as a varying variable.

  // TODO: fix aspect ratio by comparing yDist and xDist and fixing the longer one (or something)


  gl_FragColor = vec4(color.rgb, alpha * color.a);
}
