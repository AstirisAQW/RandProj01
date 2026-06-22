import spritesheet from '../../assets/Winmine31NT4and2000plus.png'
export { spritesheet }

export interface SpriteFrame {
  x_coordinate: number
  y_coordinate: number
  w: number
  h: number
}

export const CELL_SPRITES = {
  normalCell: { x_coordinate: 0, y_coordinate: 49, w: 16, h: 16 },
  emptyCell:  { x_coordinate: 17, y_coordinate: 49, w: 16, h: 16 },
  mine:      { x_coordinate: 85, y_coordinate: 49, w: 16, h: 16 },
  flag:      { x_coordinate: 34, y_coordinate: 49, w: 16, h: 16 },
  wrongFlag:    { x_coordinate: 119, y_coordinate: 49, w: 16, h: 16 },
  explodedMine: { x_coordinate: 102, y_coordinate: 49, w: 16, h: 16 },
  number1:  { x_coordinate: 0,   y_coordinate: 66, w: 16, h: 16 },
  number2: { x_coordinate: 17,  y_coordinate: 66, w: 16, h: 16 },
  number3: { x_coordinate: 34,  y_coordinate: 66, w: 16, h: 16 },
  number4: { x_coordinate: 51,  y_coordinate: 66, w: 16, h: 16 },
  number5: { x_coordinate: 68,  y_coordinate: 66, w: 16, h: 16 },
  number6: { x_coordinate: 85,  y_coordinate: 66, w: 16, h: 16 },
  number7: { x_coordinate: 102,  y_coordinate: 66, w: 16, h: 16 },
  number8: { x_coordinate: 119, y_coordinate: 66, w: 16, h: 16 },
} satisfies Record<string, SpriteFrame>

export const SMILEY_SPRITES = {
  normal:    { x_coordinate: 0,  y_coordinate: 24, w: 24, h: 24 },
  pressed:   { x_coordinate: 25, y_coordinate: 24, w: 24, h: 24 },
  won:       { x_coordinate: 75, y_coordinate: 24, w: 24, h: 24 },
  lost:      { x_coordinate: 100, y_coordinate: 24, w: 24, h: 24 },
} satisfies Record<string, SpriteFrame>

export const DIGIT_SPRITES = {
  timerNegative: { x_coordinate: 140, y_coordinate: 0, w: 13, h: 23 },
  timerNumber0: { x_coordinate: 126,   y_coordinate: 0, w: 13, h: 23 },
  timerNumber1: { x_coordinate: 0,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber2: { x_coordinate: 14,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber3: { x_coordinate: 28,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber4: { x_coordinate: 42,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber5: { x_coordinate: 56,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber6: { x_coordinate: 70,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber7: { x_coordinate: 84,  y_coordinate: 0, w: 13, h: 23 },
  timerNumber8: { x_coordinate: 98, y_coordinate: 0, w: 13, h: 23 },
  timerNumber9: { x_coordinate: 112, y_coordinate: 0, w: 13, h: 23 },
} satisfies Record<string, SpriteFrame>