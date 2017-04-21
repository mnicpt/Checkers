import React from 'react';
import * as firebase from 'firebase';
import Board from './Board';

class Checkers extends React.Component {

  joinPlayer(e) {
    if(e.target.innerHTML === 'Join') {
      this.join();

      e.target.innerHTML = 'Leave';
    } else {
      firebase.database().ref().once('value').then(function(snapshot) {
        let data = snapshot.val();
        let currentUser = firebase.auth().currentUser;
        let updates = {};

        if(currentUser) {
          if(currentUser.uid === data.player.uid) {
            updates['player/'] = {uid: null, name: "Player"};
          } else {
            updates['opponent/'] = {uid: null, name: "Opponent"};
          }
        } else if(data.player.uid){
          updates['opponent/'] = {uid: null, name: "Opponent"};
        } else if(data.opponent.uid) {
          updates['player/'] = {uid: null, name: "Player"};
        }

        firebase.database().ref().update(updates);
        firebase.auth().signOut();
      });

      e.target.innerHTML = 'Join';
    }
  }

  join() {
    let user = firebase.auth().currentUser;
    let displayName = prompt("Enter user name: ");

    firebase.database().ref().once('value').then(function(snapshot) {
      let playerId = snapshot.val().player.uid;
      let updates = {};

      if(!playerId) {
        updates['player/'] = {uid: user.uid, name: displayName ? displayName : "Player"};
      } else {
        updates['opponent/'] = {uid: user.uid, name: displayName ? displayName : "Opponent"};
      }

      firebase.database().ref().update(updates);
    });
  }

  render() {
    return (
      <div className='game'>
        <div className='hud'>
          <div className='cell player'>{this.props.player}</div>
          <div className='cell title'>{this.props.status}</div>
          <div className='cell player'>{this.props.opponent}</div>
        </div>
        <Board checkers={this.props.data}/>
        <div className="btn startBtn">
          <button className='btn' onClick={(e) => this.joinPlayer(e)}>Join</button>
        </div>
      </div>
    );
  }
}

export default Checkers;
