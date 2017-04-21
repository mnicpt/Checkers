import React from 'react';
import * as firebase from 'firebase';
import Checker from './Checker';

class Square extends React.Component {
    handleDrop(e) {
        e.preventDefault();
        let previousLocation = e.dataTransfer.getData("location");
        let newLocation = e.target.dataset.squarelocation;
        let locationDifference = newLocation - previousLocation;

        let query = "[data-location='" +previousLocation+"']";
        let existingQuery = "[data-location='" +newLocation+"']";
        let checker = document.querySelector(query);
        let existingChecker = document.querySelector(existingQuery);
        let isRed = checker.classList.contains('red');
        let playersTurn = document.querySelector('.title').innerHTML === "Player's turn...";
        
        if(isRed && playersTurn) {
            if(this.validSingleRedMove(locationDifference, existingChecker)) {
                this.updateCheckerLocation(isRed, previousLocation, newLocation);
            } else if(this.validDoubleRedMove(isRed, previousLocation, locationDifference, existingChecker)) {
                let jumpedLocation = parseInt(previousLocation, 10) + parseInt(locationDifference / 2, 10);
                this.updateCheckerLocation(isRed, previousLocation, newLocation).then(
                    () => this.deleteJumpedCheckerAtIndex(jumpedLocation)
                );
            }
        } else if(!playersTurn) {
            if(this.validSingleBlackMove(locationDifference, existingChecker)) {
                this.updateCheckerLocation(isRed, previousLocation, newLocation);
            } else if(this.validDoubleBlackMove(isRed, previousLocation, locationDifference, existingChecker)) {
                let jumpedLocation = parseInt(previousLocation, 10) - parseInt(-locationDifference / 2, 10);
                this.updateCheckerLocation(isRed, previousLocation, newLocation).then(
                    () => this.deleteJumpedCheckerAtIndex(jumpedLocation)
                );
            }
        }
    }

    validSingleRedMove(locationDifference, existingChecker) {
        return (locationDifference === 9 || locationDifference === 7) && !existingChecker;
    }

    validDoubleRedMove(isRed, previousLocation, locationDifference, existingChecker) {
        let jumpedLocation = parseInt(previousLocation, 10) + parseInt(locationDifference / 2, 10);
        return (locationDifference === 18 || locationDifference === 14) && !existingChecker && !this.jumpedOwnCheckerAtIndex(isRed, jumpedLocation);
    }

    validSingleBlackMove(locationDifference, existingChecker) {
        return (locationDifference === -9 || locationDifference === -7) && !existingChecker;
    }

     validDoubleBlackMove(isRed, previousLocation, locationDifference, existingChecker) {
        let jumpedLocation = parseInt(previousLocation, 10) - parseInt(-locationDifference / 2, 10);
        console.log(!this.jumpedOwnCheckerAtIndex(isRed, jumpedLocation));
        return (locationDifference === -18 || locationDifference === -14) && !existingChecker && !this.jumpedOwnCheckerAtIndex(isRed, jumpedLocation);
    }

    jumpedOwnCheckerAtIndex(isRed, index) {
        if(isRed) {
            return this.props.checkers[index].color === 'red' ? true : false;
        }

        return this.props.checkers[index].color === 'red' ? false : true;
    }

    deleteJumpedCheckerAtIndex(index) {
        firebase.database().ref().once('value').then(function(snapshot) {
            let data = snapshot.val();
            let checkers = data.checkers;

            delete checkers[index];

            let updates = {};
            updates['checkers/'] = checkers;
            firebase.database().ref().update(updates);
        });
    }

    updateCheckerLocation(isRed, previousLocation, newLocation) {
        return firebase.database().ref().once('value').then(function(snapshot) {
            let data = snapshot.val();
            let checkers = data.checkers;
            let checker = data.checkers[previousLocation];

            checkers[newLocation] = {color: checker.color, location: newLocation};
            delete checkers[previousLocation];

            let updates = {};
            if(isRed) {
                updates['/status'] = "Opponent's turn...";
                updates['turn'] = "Opponent";
            } else {
                updates['/status'] = "Player's turn...";
                updates['turn'] = "Player";
            }
            updates['checkers/'] = checkers;
            firebase.database().ref().update(updates);
        });
    }

    render() {
        let checker = null;
        console.log("square: " +this.props.checkers);
        let checkerOnSquare = this.props.checkers[this.props.value];
        if(checkerOnSquare) {
            checker = <Checker location={this.props.value} color={checkerOnSquare.color}/>;
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