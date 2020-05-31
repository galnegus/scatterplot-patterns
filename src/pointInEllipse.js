// partially taken from here:
// https://github.com/w8r/point-in-ellipse

/**
 * Determines if the point lies inside or outside of ellipse
 * @param  {Array.<Number>} point
 * @param  {Array.<Number>} c  ellipse center
 * @param  {Number}         rx X radius
 * @param  {Number}         ry Y radius
 * @param  {Number}         rotation Radians
 * @return {Boolean}
 */
function pointInEllipse (px, py, cx, cy, rx, ry, rotation) {
  const maxR = Math.max(rx, ry);
  if (px < cx - maxR || px > cx + maxR || py < cy - maxR || py > cy + maxR) {
    return false;
  }

  rotation = rotation || 0;
  var cos = Math.cos(rotation),
      sin = Math.sin(rotation);
  var dx  = (px - cx),
      dy  = (py - cy);
  var tdx = cos * dx + sin * dy,
      tdy = sin * dx - cos * dy;

  return (tdx * tdx) / (rx * rx) + (tdy * tdy) / (ry * ry) <= 1;
}

export default pointInEllipse;
