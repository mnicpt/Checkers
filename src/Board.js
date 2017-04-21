import React from 'react';
import Square from './Square';

class Board extends React.Component {
  constructor() {
    super();
    
    this.squares = Array(64).fill(null);
    this.color = 'gray';
    this.primaryColor = 'black';
    
    for(let square in this.squares) {
      this.squares[square] = new Square({
        color:  this.squareColorAtIndex(square),
        value: square
      });
    }
  }
  
  squareColorAtIndex(i) {
    if(i !== 0 && i % 8 === 0) {
      let temp = this.primaryColor;
      this.primaryColor = this.color;
      this.color = temp;
    } 
    
    return i % 2 === 0 ? this.primaryColor : this.color;
  }
  
  render() {
    return (
      <div className="board">
        {this.squares.map((square, index) => (
          <Square key={index} value={index} color={square.props.color} checkers={this.props.checkers}/>
         ))}
      </div>
    );
  }
}

export default Board;
