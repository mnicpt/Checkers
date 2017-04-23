import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import Checkers from './Checkers';
import newCheckersGame from './Reset';
import * as util from './CheckersUtil';

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );
const config = {
  apiKey: "AIzaSyBL3rCd93m_ThtSqPF0C-l8YFp7Hn7Ssxc",
  authDomain: "checkers-8fac9.firebaseapp.com",
  databaseURL: "https://checkers-8fac9.firebaseio.com",
  projectId: "checkers-8fac9",
  storageBucket: "checkers-8fac9.appspot.com",
  messagingSenderId: "764444064430"
};
firebase.initializeApp(config);

firebase.database().ref().on('value', snapshot => {
  let data = snapshot.val();
  let checkers = data.checkers;

  if(util.checkForWin(checkers)) {
    newCheckersGame();
  } else {
    ReactDOM.render(
      <Checkers data={data}/>,
      document.querySelector('#main')
    );
  }
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

newCheckersGame();