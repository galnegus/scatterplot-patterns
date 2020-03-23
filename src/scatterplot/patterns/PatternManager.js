import _has from 'lodash-es/has';
import createPlainDraw from './plain';
import createPulseDraw from './pulse';
import createRadarDraw from './radar';
import { defaultOptions as defaultPulseOptions } from './pulse';
import { defaultOptions as defaultRadarOptions } from './radar';

export const PATTERN_TYPES = {
  PLAIN: 0,
  PULSE: 1,
  RADAR: 2,
};

export const defaultOptions = {
  [PATTERN_TYPES.PULSE]: defaultPulseOptions,
  [PATTERN_TYPES.RADAR]: defaultRadarOptions,
};

export const PATTERN_RESOLUTION = [100, 100];

export default class PatternManager {
  #patternDraws;
  #patterns;
  #fbo;
  #regl;
  #maxCategories;
  #atlasSize;

  constructor(regl) {
    if (!regl) throw new Error('PatternManager must have reference to regl object.');

    this.fbo = regl.framebuffer({
      width: PATTERN_RESOLUTION[0], height: PATTERN_RESOLUTION[1],
    });
    this.patternDraws = {
      [PATTERN_TYPES.PLAIN]: createPlainDraw(regl, this.fbo),
      [PATTERN_TYPES.PULSE]: createPulseDraw(regl, this.fbo),
      [PATTERN_TYPES.RADAR]: createRadarDraw(regl, this.fbo),
    };
    this.patterns = {};
    this.regl = regl;
    this.maxCategories = 0;
    this.atlasSize = [0, 0];
  }

  updateSize() {
    this.maxCategories = Math.max(...Object.keys(this.patterns)) + 1;
    this.atlasSize = [this.maxCategories, 1];
    this.fbo.resize(this.maxCategories * PATTERN_RESOLUTION[0], PATTERN_RESOLUTION[1]);
  }

  // Input: array of pattern options with the category as a property
  setAll(patterns) {
    const categoriesToRemove = new Set(Object.keys(this.patterns));

    patterns.forEach((pattern) => {
      categoriesToRemove.delete(pattern.category.toString());
      this.set(pattern.category, pattern);
    });

    categoriesToRemove.forEach((category) => {
      this.destroy(category);
    });

  }

  set(category, options) {
    if (_has(this.patterns, category))
      this.patterns[category] = { ...this.patterns[category], ...options };
    else
      this.patterns[category] = options;

    this.updateSize();
  }

  destroy(category) {
    delete this.patterns[category];
    this.updateSize();
  }

  draw(time, animationMix, useColors, showPatterns) {
    for (let i = 0; i < this.maxCategories; i += 1) {
      if (!_has(this.patterns, i)) continue;

      if (showPatterns)
        this.patternDraws[this.patterns[i].type](this.fbo, this.atlasSize, i, time, animationMix, useColors, this.patterns[i]);
      else
        this.patternDraws[PATTERN_TYPES.PLAIN](this.fbo, this.atlasSize, i, time, useColors, this.patterns[i])
    }
  }

  clear() {
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      framebuffer: this.fbo,
    });
  }

  getTexture() {
    return this.fbo.color[0];
  }

  getAtlasSize() {
    return [...this.atlasSize];
  }
}
