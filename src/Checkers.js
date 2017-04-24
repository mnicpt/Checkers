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
          <div className='cell'>&nbsp;</div>
          <div className='cell status'>{this.props.data.status}</div>
        </div>
        <Board data={this.props.data}/>
        <br/>
        <div className='note'><b>Note:</b> Continuous jumping if applicable 'in progress'.</div>
      </div>
    );
  }
}

export default Checkers;
