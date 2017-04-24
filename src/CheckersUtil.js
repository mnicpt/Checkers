import * as firebase from 'firebase';

export function checkForWin() {
    let href = location.href.split('/');
    let id = href[5].split('?')[0];

    return firebase.database().ref('games/' +id).once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;

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
        let updates = {};
        if (winner) {
            if (color === 'red') {
                updates['status'] = "Red is the winner!";
                alert("Red is the winner.");
            } else {
                updates['status'] = "White is the winner!";
                alert("White is the winner.");
            }

            return true;
        }
    });
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
    let href = location.href.split('/');
    let id = href[5].split('?')[0];

    return firebase.database().ref('games/' +id).once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;
        let checker = checkers[index];
    
        checkers[index] = {color: checker.color, location: index, king:true};
        let updates = {};
        updates['checkers/'] = checkers;
        firebase.database().ref('games/' +id).update(updates);
    });
}

export function deleteJumpedCheckerAtIndex(index) {
    let href = location.href.split('/');
    let id = href[5].split('?')[0];

    return firebase.database().ref('games/' +id).once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;

        delete checkers[index];

        let updates = {};
        updates['checkers/'] = checkers;

        firebase.database().ref('games/' +id).update(updates);
    });
}

export function updateCheckerLocation(isRed, previousLocation, newLocation) {
    let href = location.href.split('/');
    let id = href[5].split('?')[0];

    return firebase.database().ref('games/' +id).once('value').then(function(snapshot) {
        let data = snapshot.val();

        let checkers = data.checkers;
        let checker = data.checkers[previousLocation];

        checkers[newLocation] = {color: checker.color, location: newLocation, king: checker.king};
        delete checkers[previousLocation];

        let updates = {};
        if(isRed) {
            updates['status/'] = "White's turn...";
            updates['turn/'] = "Opponent";
        } else {
            updates['status/'] = "Red's turn...";
            updates['turn/'] = "Player";
        }
        updates['checkers/'] = checkers;
        
        firebase.database().ref('games/' +id).update(updates);
    });
}

export function canGoAgain(isRed, isKing, location) {
    let href = location.href.split('/');
    let id = href[5].split('?')[0];
    let ref = firebase.database().ref('games/' +id);

    return ref.once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;

        if(isKing) {
            //check for opponent at 7, -7, 9 and -9 && empty space double that
            if(opponentNearKing(checkers, location) && emptySpaceAfterKing(checkers, location)) {
                let updates = {};
                updates['status'] = isRed ? "Red's turn..." : "White's turn...";
                updates['turn'] = isRed ? "Red" : "White";
                ref.update(updates);
            }
        } else if(isRed) {
            // check for opponent 7 and 9 && empty space double that
            if(opponentNearRed(checkers, location) && emptySpaceAfterRed(checkers, location)) {
                let updates = {};
                updates['status'] = "Red's turn...";
                updates['turn'] = "Red";
                ref.update(updates);
            }
        } else {
            // check for opponent -7 and -9 && empty space double that
            if(opponentNearWhite(checkers, location) && emptySpaceAfterWhite(checkers, location)) {
                let updates = {};
                updates['status'] = "Red's turn...";
                updates['turn'] = "Red";
                ref.update(updates);
            }
        }
    });
}

function opponentNearKing(checkers, location) {
    return false;
}

function opponentNearRed(checkers, location) {
    return false;
}

function opponentNearWhite(checkers, location) {
    return false;
}

function emptySpaceAfterKing(checkers, location) {
    return false;
}

function emptySpaceAfterRed(checkers, location) {
    return false;
}

function emptySpaceAfterWhite(checkers, location) {
    return false;
}

export function token() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for ( let i = 0; i < 8; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}