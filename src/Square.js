import React, {Component} from 'react';
import Checker from './Checker';
import RedChecker from './RedChecker';
import BlackChecker from './BlackChecker';

class Square extends Component {

    handleDrop(e) {
        e.preventDefault();
        let previousLocation = e.dataTransfer.getData("location");
        let newLocation = e.target.dataset.squarelocation;

        let previousQuery = "[data-location='" +previousLocation+"']";
        let newQuery = "[data-location='" +newLocation+"']";

        let previousChecker = document.querySelector(previousQuery);
        let newChecker = document.querySelector(newQuery);

        let isRed = previousChecker.classList.contains('red');
        let playersTurn = document.querySelector('.title').innerHTML === "Player's turn...";
        
        if(isRed && playersTurn) {
            new RedChecker().move(previousLocation, newLocation, previousChecker, newChecker);
        } else if(!playersTurn) {
            new BlackChecker().move(previousLocation, newLocation, previousChecker, newChecker);
        }  
    }

    render() {
        let checker = null;
        let checkers = this.props.data.checkers;
        let checkerOnSquare = checkers[this.props.value];
        if(checkerOnSquare) {
            checker = <Checker data={this.props.data} location={this.props.value} color={checkerOnSquare.color} king={checkerOnSquare.king}/>;
        }

        let onDrop = null;
        let onDragOver = null;
        if(this.props.color === 'black') {
            onDrop = (e) => this.handleDrop(e);
            onDragOver = (e) => e.preventDefault();
        }

        return(
            <div data-squareLocation={this.props.value} className={'square ' + this.props.color} onDrop={onDrop} onDragOver={onDragOver}>
                {checker}
            </div>
        );
    }
}

export default Square;