vec2 normalizeFragCoords(in vec2 resolution, in vec2 posMin, in vec2 posMax) {
  return (gl_FragCoord.xy / (resolution) - posMin) / (posMax - posMin); 
}

#pragma glslify: export(normalizeFragCoords)
