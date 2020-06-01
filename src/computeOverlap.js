import pointInEllipse from './pointInEllipse';

function pointInCluster(px, py, { x: cx, y: cy, sigma, angle, amplitude }) {
  const rx = 2 * sigma * amplitude;
  const ry = 2 * sigma;

  return pointInEllipse(px, py, cx, cy, rx, ry, angle);
}

export default function computeOverlap(clusters) {
  let area = 0;
  let overlap = 0;

  const nSquaredPoints = 100;
  const step = 2 / nSquaredPoints;

  for (let px = -1; px <= 1; px += step) {
    for (let py = -1; py <= 1; py += step) {
      const count = clusters.reduce((acc, cluster) => acc + pointInCluster(px, py, cluster), 0);

      area += count;
      if (count > 1) overlap += count;
    }
  }

  return overlap / area;
}
