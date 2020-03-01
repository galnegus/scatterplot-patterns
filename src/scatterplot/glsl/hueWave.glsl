float hueWave(in float hue, in float time, in float period, in float variation) {
  // https://stackoverflow.com/a/22400799
  float amplitude = 1.0;
  float halfPeriod = period / 2.0;
  float triangleWave = (amplitude / halfPeriod) * (halfPeriod - abs(mod(time, period) - halfPeriod));

  return mod(hue + (triangleWave * 2.0 - 1.0) * variation, 1.0);
}

#pragma glslify: export(hueWave)


