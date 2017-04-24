import React, {Component} from 'react';
import Board from './Board';

class Checkers extends Component {

  render() {
    let url = location.href.split("=");
    let isRed = url[1] === "1";
    let playerName = isRed ? "Red" : "White";

    return (
      <div className='game'>
        <div className='hud'>
          <div className='cell player'>{playerName}</div>
          <div className='cell title'>{this.props.data.status}</div>
          <div className='cell player'> </div>
        </div>
        <Board data={this.props.data}/>
      </div>
    );
  }
}

export default Checkers;
