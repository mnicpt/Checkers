import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import Checkers from './Checkers';

const config = {
  apiKey: "AIzaSyBL3rCd93m_ThtSqPF0C-l8YFp7Hn7Ssxc",
  authDomain: "checkers-8fac9.firebaseapp.com",
  databaseURL: "https://checkers-8fac9.firebaseio.com",
  projectId: "checkers-8fac9",
  storageBucket: "checkers-8fac9.appspot.com",
  messagingSenderId: "764444064430"
};

firebase.initializeApp(config);

var color = 'black';
var primaryColor = 'gray';
var checkers = {};
initCheckers();

function initCheckers() {
  for(let i = 0; i < 64; i++) {
    if(i < 24 && squareColorAtIndex(i) === 'black') {
      checkers[i] = {location: i, color: 'red'};
    } else if(i > 39 && squareColorAtIndex(i) === 'black') {
      checkers[i] = {location: i, color: 'white'};
    }
  }
}

function squareColorAtIndex(i) {
  if(i !== 0 && i % 8 === 0) {
    let temp = primaryColor;
    primaryColor = color;
    color = temp;
  } 
  
  return i % 2 === 0 ? primaryColor : color;
}

var database = firebase.database().ref();
database.set({
    checkers: checkers,
    turn: "Player",
    status: "Player's turn...",
    player: { uid: null, name: "Player" },
    opponent: { uid: null, name: "Opponent" }
});

database.on('value', snapshot => {
  var data = snapshot.val();
  console.log("data changed: " +JSON.stringify(data));
  ReactDOM.render(
    <Checkers data={data.checkers} player={data.player.name} status={data.status} opponent={data.opponent.name}/>,
    document.querySelector('#main')
  );
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
  } else {
    firebase.auth().signInAnonymously()
        .catch(function(error) {
            alert("Error: " +error.code+ "\nMessage: " +error.message);
        }
    );
  }
});