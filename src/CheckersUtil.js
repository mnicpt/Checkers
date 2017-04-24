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

export function checkForKing(isRed, newLocation) {
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

export function canGoAgain(isRed, isKing, newLocation) {
    let href = location.href.split('/');
    let id = href[5].split('?')[0];
    let ref = firebase.database().ref('games/' +id);

    return ref.once('value').then(function(snapshot) {
        let data = snapshot.val();
        let checkers = data.checkers;

        if(isKing) {
            //check for opponent at 7, -7, 9 and -9 && empty space double that
            let locations = opponentNearKing(checkers, parseInt(newLocation, 10));
            if(locations.length !== 0 && emptySpaceAfterKing(checkers, locations)) {
                let updates = {};
                updates['status'] = isRed ? "Red's turn..." : "White's turn...";
                updates['turn'] = isRed ? "Red" : "White";
                ref.update(updates);
            }
        } else if(isRed) {
            // check for opponent 7 and 9 && empty space double that
            let locations = opponentNearRed(checkers, parseInt(newLocation, 10));
            if(locations.length !== 0 && emptySpaceAfterRed(checkers, locations)) {
                let updates = {};
                updates['status'] = "Red's turn...";
                updates['turn'] = "Red";
                ref.update(updates);
            }
        } else {
            // check for opponent -7 and -9 && empty space double that
            let locations = opponentNearWhite(checkers, parseInt(newLocation, 10));
            if(locations.length !== 0 && emptySpaceAfterWhite(checkers, locations)) {
                let updates = {};
                updates['status'] = "White's turn...";
                updates['turn'] = "White";
                ref.update(updates);
            }
        }
    });
}

function opponentNearKing(checkers, location) {
    // -7, 7, 9, -9
    let locations = [];
    for(let checker in checkers) {
        let thisChecker = checkers[checker];
        if(thisChecker.location === (location - 7)) {
            locations.push(-7);
        }

        if(thisChecker.location === (location + 7)) {
            locations.push(7);
        }

        if(thisChecker.location === (location - 9)) {
            locations.push(-9);
        }

        if(thisChecker.location === (location + 9)) {
            locations.push(9);
        }
    }

    return locations;
}

function opponentNearRed(checkers, location) {
    // 7, 9
    let locations = [];
    for(let checker in checkers) {
        let thisChecker = checkers[checker];
        if(thisChecker.location === (parseInt(location, 10) + 7)) {
            locations.push(7);
        }

        if(thisChecker.location === (parseInt(location, 10) + 9)) {
            locations.push(9);
        }
    }
    
    return locations;
}

function opponentNearWhite(checkers, location) {
    // -7, -9
    let locations = [];
    for(let checker in checkers) {
        let thisChecker = checkers[checker];
        if(thisChecker.location === (location - 7)) {
            locations.push(-7);
        }

        if(thisChecker.location === (location - 9)) {
            locations.push(-9);
        }
    }

    return locations;
}

function emptySpaceAfterKing(checkers, locations) {
    for(let location in locations) {
        let thisLocation = locations[location];
        for(let checker in checkers) {
            let thisChecker = checkers[checker];
            if(thisChecker.location === Math.abs(thisLocation * 2)) {
                return false;
            }
        }
    }
}

function emptySpaceAfterRed(checkers, locations) {
    // 14, 18
    for(let location in locations) {
        let thisLocation = locations[location];
        for(let checker in checkers) {
            let thisChecker = checkers[checker];
            if(thisChecker.location === (parseInt(thisLocation, 10) + 14) || parseInt(thisChecker.location, 10) === (parseInt(thisLocation, 10) + 18)) {
                return false;
            }
        }
    }
}

function emptySpaceAfterWhite(checkers, locations) {
    // -14, -18
    for(let location in locations) {
        let thisLocation = locations[location];
        for(let checker in checkers) {
            let thisChecker = checkers[checker];
            if(thisChecker.location === (thisLocation - 14) || thisChecker.location === (thisLocation - 18)) {
                return false;
            }
        }
    }
}

export function token() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for ( let i = 0; i < 8; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}