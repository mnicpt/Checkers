import * as firebase from 'firebase';

export function checkForWin(checkers) {
    let color = "";
    let winner = true;

    for (let checker in checkers) {
        let thisChecker = checkers[checker];
        if (color === "") {
            color = thisChecker.color;
        } else if (thisChecker.color !== color) {
            winner = false;
        }
    }
    if (winner) {
        if (color === 'red') {
            alert("Player is the winner.");
        } else {
            alert("Opponent is the winner.");
        }

        return true;
    }
}
export function isKing(checker) {
    return checker.dataset.king === "true";
}

export function checkForKing(isRed, newLocation, jumped) {
    if(isRed) {
        if([56, 58, 60, 62].indexOf(newLocation) !== -1) {
            return this.kingCheckerAtIndex(newLocation);
        }
    } else {
        if([1, 3, 5, 7].indexOf(newLocation) !== -1) {
            return this.kingCheckerAtIndex(newLocation);
        }
    }
}

export function kingCheckerAtIndex(index) {
    return firebase.database().ref().once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;
        let checker = checkers[index];
    
        checkers[index] = {color: checker.color, location: index, king:true};
        let updates = {};
        updates['checkers/'] = checkers;
        firebase.database().ref().update(updates);
    });
}

export function deleteJumpedCheckerAtIndex(index) {
    return firebase.database().ref().once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;

        delete checkers[index];

        let updates = {};
        updates['checkers/'] = checkers;

        firebase.database().ref().update(updates);
    });
}

export function updateCheckerLocation(isRed, previousLocation, newLocation) {
    return firebase.database().ref().once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;
        let checker = data.checkers[previousLocation];

        checkers[newLocation] = {color: checker.color, location: newLocation, king: checker.king};
        delete checkers[previousLocation];

        let updates = {};
        if(isRed) {
            updates['status/'] = "Opponent's turn...";
            updates['turn/'] = "Opponent";
        } else {
            updates['status/'] = "Player's turn...";
            updates['turn/'] = "Player";
        }
        updates['checkers/'] = checkers;
        
        firebase.database().ref().update(updates);
    });
}
export function playerGoesAgain(isRed, location) {
    return firebase.database().ref().once('value').then(function(snapshot) {
        // let updates = {};
        // if((this.state.jumpChecker === null || this.state.jumpChecker === location) && this.canJump(isRed, location)) {
        //     if(isRed) {
        //         updates['/status'] = "Player's turn...";
        //         updates['turn'] = "Player";
        //     } else {
        //         updates['/status'] = "Opponent's turn...";
        //         updates['turn'] = "Opponent";
        //     }

        //     firebase.database().ref().update(updates);
        // } else {
        //     if(isRed) {
        //         updates['/status'] = "Opponent's turn...";
        //         updates['turn'] = "Opponent";
        //     } else {
        //         updates['/status'] = "Player's turn...";
        //         updates['turn'] = "Player";
        //     }

        //     firebase.database().ref().update(updates);

        //     this.setState({jumpChecker:null});
        // }
    });
}

export function canJump(isRed, location) {
    // can jump right
    // can jump left
    // if king can jump forward/backward left or right
    return false;
}