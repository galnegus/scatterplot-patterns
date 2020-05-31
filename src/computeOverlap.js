import pointInEllipse from './pointInEllipse';

function pointInCluster(px, py, { x: cx, y: cy, sigma, angle, amplitude }) {
  const rx = sigma * amplitude;
  const ry = sigma;

  return pointInEllipse(px, py, cx, cy, rx, ry, angle);
}

export default function computeOverlap(clusters) {
  //const clusterArea = new Array(clusters.length).fill(0);
  //const clusterOverlap = new Array(clusters.length).fill(0);
  
  let area = 0;
  let overlap = 0;

  const nSquaredPoints = 100;
  const step = 2 / nSquaredPoints;

  for (let px = -1; px <= 1; px += step) {
    for (let py = -1; py <= 1; py += step) {
      const count = clusters.reduce((acc, cluster) => acc + pointInCluster(px, py, cluster), 0);

      area += count;
      if (count > 1) overlap += count;

      // The code above does the same thing as the commented out code below, just a bit faster
      /*
      const clusterIndicesFound = clusters.reduce((acc, cluster, index) => {
        if (pointInCluster(px, py, cluster)) acc.push(index);
        return acc;
      }, []);

      const hasOverlap = clusterIndicesFound.length > 1;

      clusterIndicesFound.forEach((index) => {
        clusterArea[index] += 1;
        if (hasOverlap) clusterOverlap[index] += 1;
      });
      */
    }
  }

  return overlap / area;
}
