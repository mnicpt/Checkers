import Color from './Color';

let color = Color.BLACK;
let primaryColor = Color.GRAY;
let checkers = {};

function initCheckers() {
  for(let i = 0; i < 64; i++) {
    if(i < 24 && squareColorAtIndex(i) === Color.BLACK) {
      checkers[i] = {location: i, color: Color.RED, king: false};
    } else if(i > 39 && squareColorAtIndex(i) === Color.BLACK) {
      checkers[i] = {location: i, color: Color.WHITE, king: false};
    }
  }

  return checkers;
}

function squareColorAtIndex(i) {
  if(i !== 0 && i % 8 === 0) {
    let temp = primaryColor;
    primaryColor = color;
    color = temp;
  } 
  
  return i % 2 === 0 ? primaryColor : color;
}

function resetBoard() {
  return initCheckers();
}

export default resetBoard;