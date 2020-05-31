import _has from 'lodash/has';
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

export const PATTERN_RESOLUTION = [400, 400];

// modulo but with negative numbers too
function mod(m, n) {
    return ((m % n) + n) % n;
}

export default class PatternManager {
  #patternDraws;
  #fbo;
  #regl;

  #patterns = {};
  #maxCategories = 0;
  #atlasSize = [0, 0];

  #useSequence = false;
  #sequencePatternDuration = 2;
  #sequenceTransitionDuration = 0.2;

  #partitioningFunc = null;
  #lastSequence = null;

  constructor(regl) {
    if (!regl) throw new Error('PatternManager must have reference to regl object.');

    this.#fbo = regl.framebuffer({
      width: PATTERN_RESOLUTION[0], height: PATTERN_RESOLUTION[1],
    });
    this.#patternDraws = {
      [PATTERN_TYPES.PLAIN]: createPlainDraw(regl, this.#fbo),
      [PATTERN_TYPES.PULSE]: createPulseDraw(regl, this.#fbo),
      [PATTERN_TYPES.RADAR]: createRadarDraw(regl, this.#fbo),
    };
    this.#regl = regl;
  }

  updateSize() {
    this.#maxCategories = Math.max(...Object.keys(this.#patterns)) + 1;
    this.#atlasSize = [this.#maxCategories, 1];
    this.#fbo.resize(this.#maxCategories * PATTERN_RESOLUTION[0], PATTERN_RESOLUTION[1]);
  }

  // Input: array of pattern options with the category as a property
  setAll(patterns) {
    const categoriesToRemove = new Set(Object.keys(this.#patterns));

    patterns.forEach((pattern) => {
      categoriesToRemove.delete(pattern.category.toString());
      this.set(pattern.category, pattern);
    });

    categoriesToRemove.forEach((category) => {
      this.destroy(category);
    });

  }

  set(category, options) {
    if (_has(this.#patterns, category))
      this.#patterns[category] = { ...this.#patterns[category], ...options };
    else
      this.#patterns[category] = options;

    this.updateSize();
  }

  setSequenceOptions({ useSequence = null, sequencePatternDuration = null, sequenceTransitionDuration = null }) {
    if (useSequence !== null) this.#useSequence = useSequence;
    if (sequencePatternDuration !== null) this.#sequencePatternDuration = sequencePatternDuration;
    if (sequenceTransitionDuration !== null) this.#sequenceTransitionDuration = sequenceTransitionDuration;
  }

  setPartitioningFunc(func) {
    this.#partitioningFunc = func;
  }

  computeSequenceValue(sequenceInit, index, transitionLength) {
    let sequenceValue = sequenceInit - index;
    if (sequenceValue < 0 || sequenceValue >= 1) {
      sequenceValue = 0;
    } else {
      if (sequenceValue < transitionLength)
        sequenceValue /= transitionLength;
      else if (sequenceValue >= 1 - transitionLength)
        sequenceValue = (-sequenceValue + 1) / transitionLength;
      else
        sequenceValue = 1;
    }

    return sequenceValue;
  }

  computeSequenceValueWithOverlap(sequenceInit, index, transitionLength, maxCategories) {
    if (transitionLength <= Number.EPSILON) return this.computeSequenceValue(sequenceInit, index, transitionLength);

    let sequenceValue = 1;
    sequenceValue = mod(sequenceInit - index + (transitionLength / 2), maxCategories) - transitionLength / 2;

    if (sequenceValue + transitionLength / 2 < 0 || sequenceValue - transitionLength / 2 >= 1) {
      sequenceValue = 0;
    } else {
      if (sequenceValue < transitionLength / 2)
        sequenceValue = sequenceValue / transitionLength + 0.5; // (sequenceValue + transitionLength / 2) / transitionLength
      else if (sequenceValue >= 1 - transitionLength / 2)
        sequenceValue = (1 - sequenceValue) / transitionLength + 0.5; // (-(sequenceValue - transitionLength / 2) + 1) / transitionLength
      else
        sequenceValue = 1;
    }

    return sequenceValue;
  }

  destroy(category) {
    delete this.#patterns[category];
    this.updateSize();
  }

  draw(time, animationMix, useColors, showPatterns) {
    let sequenceValue = 1;
    const sequenceInit = (time / this.#sequencePatternDuration) % this.#maxCategories;

    for (let i = 0; i < this.#maxCategories; i += 1) {
      if (!_has(this.#patterns, i)) continue;

      if (this.#useSequence) {
        sequenceValue = this.computeSequenceValueWithOverlap(sequenceInit, i, this.#sequenceTransitionDuration, this.#maxCategories);
        const hardSeqValue = this.computeSequenceValue(sequenceInit, i, 0);
        if (hardSeqValue === 1 && this.#partitioningFunc !== null && this.#lastSequence !== i) {
          this.#partitioningFunc(i);
          this.#lastSequence = i;
        }
      }

      if (showPatterns)
        this.#patternDraws[this.#patterns[i].type](this.#fbo, this.#atlasSize, i, time, sequenceValue, animationMix, useColors, this.#patterns[i]);
      else
        this.#patternDraws[PATTERN_TYPES.PLAIN](this.#fbo, this.#atlasSize, i, time, sequenceValue, animationMix, useColors, this.#patterns[i])
    }
  }

  clear() {
    this.#regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      framebuffer: this.#fbo,
    });
  }

  getTexture() {
    return this.#fbo.color[0];
  }

  getAtlasSize() {
    return [...this.#atlasSize];
  }
}
