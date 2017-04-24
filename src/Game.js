import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Checkers from './Checkers';
import * as firebase from 'firebase';


class Game extends Component {
    constructor({match: { params: token}}) {
        super();
        this.state = {
            token: token.token,
            game: null
        }; 

        if (!firebase.apps.length) {
            var config = {
            apiKey: "AIzaSyC-yQuFuk4FLGzYqIraSicnJMqUGN6HSd8",
            authDomain: "chessgame-b0838.firebaseapp.com",
            databaseURL: "https://chessgame-b0838.firebaseio.com",
            storageBucket: "chessgame-b0838.appspot.com",
            messagingSenderId: "312705248545"
            };
            firebase.initializeApp(config);
        }

        const db = firebase.database().ref('games/' +token.token);
        db.once('value', (ref) => {
            const game = ref.val();
            this.state = {
                token: token.token,
                game: game
            }; 
        });

    }
    
    render() {
        if(this.state.game && this.state.game.checkers) {
            return (<Checkers data={this.state.game}/>);
        } else {
            return null;
        }
    }

    componentDidMount() {
        listenForUpdates(this.state.token, (game) => {
            if(game.checkers) {
                ReactDOM.render(
                    <Checkers data={game}/>,
                    document.querySelector('#main')
                );
            }
        });
    }
}

function listenForUpdates(token, callback) {
    const db = firebase.database().ref("games/" +token);
    db.on('value', (ref) => {
        const game = ref.val();
        callback(game);
    });
}

export default Game;