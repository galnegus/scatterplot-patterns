precision highp float;

uniform sampler2D colorTex;
uniform float colorTexRes;
uniform sampler2D stateTex;
uniform float stateTexRes;
uniform float pointSize;
uniform float pointSizeExtra;
uniform float numPoints;
uniform float globalState;
uniform float isColoredByCategory;
uniform float isColoredByValue;
uniform float maxColor;
uniform float numColorStates;
uniform float scaling;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

attribute float stateIndex;

uniform sampler2D textureAtlas;
uniform vec2 atlasSize;

uniform sampler2D bboxTex;
uniform float bboxTexRes;

// variables to send to the fragment shader
varying vec4 color;
varying vec2 uv;

float modI(float a, float b) {
  float m = a - floor((a + 0.5) / b) * b;
   return floor(m + 0.5);
}

vec4 getFromTexture(in sampler2D texture, in float textureRes, in float index) {
  float eps = 0.5 / textureRes;
  float rowIndex = floor((index + eps) / textureRes);
  vec2 texIndex = vec2(
    (index / textureRes) - rowIndex + eps,
    rowIndex / textureRes + eps
  );
  return texture2D(texture, texIndex);
}

vec2 texAtlasIndex(in float index, in vec2 position) {
  float maxLength = atlasSize.x * atlasSize.y;
  float modIndex = modI(index, maxLength);

  float yIndex = floor((modIndex + 0.5) / atlasSize.x);
  float xIndex = modI(modIndex, atlasSize.x);

  float yStep = 1.0 / atlasSize.y;
  float xStep = 1.0 / atlasSize.x;

  vec2 min = vec2(xIndex * xStep, yIndex * yStep);
  vec2 max = vec2((xIndex + 1.0) * xStep, (yIndex + 1.0) * yStep);

  return position * (max - min) + min;
}

vec4 findColor(in float category) {
  // this should be generalizable
  vec4 bbox = getFromTexture(bboxTex, bboxTexRes, category);

  vec2 min = bbox.xy;
  vec2 max = bbox.zw;
  vec2 normalizedPosition = (uv - min) / (max - min);

  return texture2D(textureAtlas, texAtlasIndex(category, normalizedPosition));
}

void main() {
  // First get the state
  vec4 state = getFromTexture(stateTex, stateTexRes, stateIndex);

  uv = state.xy;

  // Determine color index
  float colorIndexCat = state.z * isColoredByCategory;
  float colorIndexVal = floor(state.w * maxColor) * isColoredByValue;
  float colorIndex = colorIndexCat + colorIndexVal;
  // Multiply by the number of color states per color
  // I.e., normal, active, hover, background, etc.
  colorIndex *= numColorStates;
  // Half a "pixel" or "texel" in texture coordinates
  float eps = 0.5 / colorTexRes;
  float colorLinearIndex = colorIndex + globalState;
  // Need to add cEps here to avoid floating point issue that can lead to
  // dramatic changes in which color is loaded as floor(3/2.9999) = 1 but
  // floor(3/3.0001) = 0!
  float colorRowIndex = floor((colorLinearIndex + eps) / colorTexRes);

  vec2 colorTexIndex = vec2(
    (colorLinearIndex / colorTexRes) - colorRowIndex + eps,
    colorRowIndex / colorTexRes + eps
  );

  //color = texture2D(colorTex, colorTexIndex);
  color = findColor(state.z);

  gl_Position = projection * view * model * vec4(state.x, state.y, color.a * 0.99, 1); // depth gets clipped when z = 1.00, so * 0.99!

  // The final scaling consists of linear scaling in [0, 1] and log scaling
  // in [1, [
  float finalScaling = min(1.0, scaling) + log2(max(1.0, scaling));

  gl_PointSize = pointSize * finalScaling + pointSizeExtra;
}
