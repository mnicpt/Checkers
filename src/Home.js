import React from 'react';
import * as Utils from './CheckersUtil';
import * as firebase from 'firebase';
import resetBoard from './Reset';

export default function() {
  console.log("home");
  let queryParams = initializeGame();
  if(queryParams) {
    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <h3>Start a New Game</h3>
          <button onClick={() => startGame(queryParams.id)}>Start Game</button>
        </div>
        <div>
          <div className='cell' style={{textAlign: 'center'}}><b>Player 1 URL</b></div>
          <div className='cell' style={{textAlign: 'center'}}><b>Player 2 URL</b></div>
        </div>
        <div>
          <div className='cell' style={{textAlign: 'center',fontSize:'13px'}}>{queryParams.p1_query}</div>
          <div className='cell' style={{textAlign: 'center',fontSize:'13px'}}>{queryParams.p2_query}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

function initializeGame() {
    const newGame = {
        p1_token: Utils.token(),
        p2_token: Utils.token(),
        checkers: resetBoard(),
        turn: "Player",
        status: "Player's turn..."
    };

    var config = {
        apiKey: "AIzaSyC-yQuFuk4FLGzYqIraSicnJMqUGN6HSd8",
        authDomain: "chessgame-b0838.firebaseapp.com",
        databaseURL: "https://chessgame-b0838.firebaseio.com",
        storageBucket: "chessgame-b0838.appspot.com",
        messagingSenderId: "312705248545"
    };
    firebase.initializeApp(config);

    let href = location.href.split('/');
    let id = href[href.length - 1];

    if(id.length === 0 || !firebase.database().ref("games/" +id)) {
      const games = firebase.database().ref("games").push();
      games.set(newGame);
      let gamesArr = games.toString().split('/');

      let id = gamesArr[gamesArr.length - 1];
      let domain = "https://checkers-8fac9.firebaseio.com/";
      let p1_query = `#/games/${id}?p1=${newGame.p1_token}`;
      let p2_query = `#/games/${id}?p2=${newGame.p2_token}`;

      return {id: id, p1_query: domain + p1_query, p2_query: domain + p2_query};
    } else {
      startGame(id);
    }
}

function startGame(id) {
    window.location.hash = `/games/${id}`;
}