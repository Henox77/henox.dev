
export const SNAKE = {
  grid: 18,
  cell: 20,
  start: { x: 5, y: 9, length: 3 },
  firstStepMs: 140,
  stepMs: 140,
  minStepMs: 60,
  speedUpMs: 3,
  swipeMinPx: 20,
  maxQueuedTurns: 2,
};

export const BUG_SQUASH = {
  cells: 9,
  durationS: 30,
  lifeStartMs: 900,
  lifeMinMs: 450,
  lifeShrinkMsPerS: 15,
  respawnAfterHitMs: 120,
};

export const MEMORY = {
  symbols: ['{ }', '</>', '[ ]', '=>', '&&', '#!'],
  mismatchMs: 750,
};
