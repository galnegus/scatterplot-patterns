import { PATTERN_TYPES, defaultOptions } from './scatterplot/patterns/PatternManager';

export const defaultValues = {
  showPatterns: true,
  useColors: true,
  pointSize: 5,
  animationMix: [0, 1, 0],
};

export const defaultPatterns = [
  {
    ...defaultOptions[PATTERN_TYPES.RADAR],
    type: PATTERN_TYPES.RADAR,
    category: 0,
  },
  {
    ...defaultOptions[PATTERN_TYPES.PULSE],
    type: PATTERN_TYPES.PULSE,
    category: 1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.RADAR],
    type: PATTERN_TYPES.RADAR,
    category: 2,
    direction: -1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.PULSE],
    type: PATTERN_TYPES.PULSE,
    category: 3,
    direction: -1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.RADAR],
    type: PATTERN_TYPES.RADAR,
    category: 4,
    invert: 1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.PULSE],
    type: PATTERN_TYPES.PULSE,
    category: 5,
    invert: 1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.RADAR],
    type: PATTERN_TYPES.RADAR,
    category: 6,
    direction: -1,
    invert: 1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.PULSE],
    type: PATTERN_TYPES.PULSE,
    category: 7,
    direction: -1,
    invert: 1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.RADAR],
    type: PATTERN_TYPES.RADAR,
    category: 8,
    direction: -1,
  },
  {
    ...defaultOptions[PATTERN_TYPES.PULSE],
    type: PATTERN_TYPES.PULSE,
    category: 9,
    direction: -1,
    invert: 1,
  }
];

export const debounceTime = 100;


