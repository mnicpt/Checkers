import React, {Component} from 'react';
import * as firebase from 'firebase';
import Board from './Board';

class Checkers extends Component {

  joinPlayer(e) {
    if(e.target.innerHTML === 'Join') {
      this.join();

      e.target.innerHTML = 'Leave';
    } else {
      let currentUser = firebase.auth().currentUser;
      let updates = {};

      if(currentUser) {
        if(currentUser.uid === this.props.data.player.uid) {
          updates['player/'] = {uid: null, name: "Player"};
        } else {
          updates['opponent/'] = {uid: null, name: "Opponent"};
        }
      } else if(this.props.data.player.uid){
        updates['opponent/'] = {uid: null, name: "Opponent"};
      } else if(this.props.data.opponent.uid) {
        updates['player/'] = {uid: null, name: "Player"};
      }

      firebase.database().ref().update(updates);
      firebase.auth().signOut();

      e.target.innerHTML = 'Join';
    }
  }

  join() {
    let user = firebase.auth().currentUser;
    let displayName = prompt("Enter user name: ");

    let playerId = this.props.data.player.uid;
    let updates = {};

    if(!playerId) {
      updates['player/'] = {uid: user.uid, name: displayName ? displayName : "Player"};
    } else {
      updates['opponent/'] = {uid: user.uid, name: displayName ? displayName : "Opponent"};
    }

    firebase.database().ref().update(updates);
  }

  render() {
    let player = this.props.data.player.name;
    let opponent = this.props.data.opponent.name;

    return (
      <div className='game'>
        <div className='hud'>
          <div className='cell player'>{player}</div>
          <div className='cell title'>{this.props.data.status}</div>
          <div className='cell player'>{opponent}</div>
        </div>
        <Board data={this.props.data}/>
        <div className="btn startBtn">
          <button className='btn' onClick={(e) => this.joinPlayer(e)}>Join</button>
        </div>
      </div>
    );
  }
}

export default Checkers;
