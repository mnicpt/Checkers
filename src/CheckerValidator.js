import * as firebase from 'firebase';

class CheckerValidator {

    validKingMove(locationDifference, existingChecker) {
        return (Math.abs(locationDifference) === 9 || Math.abs(locationDifference) === 7) && !existingChecker;
    }

    validDoubleKingMove(isRed, previousLocation, locationDifference, existingChecker, jumpedLocation) {
        return (Math.abs(locationDifference) === 18 || Math.abs(locationDifference) === 14) && !existingChecker && !this.jumpedOwnCheckerAtIndex(isRed, jumpedLocation);
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
        return (locationDifference === -18 || locationDifference === -14) && !existingChecker && !this.jumpedOwnCheckerAtIndex(isRed, jumpedLocation);
    }

    jumpedOwnCheckerAtIndex(isRed, index) {
        let href = location.href.split('/');
        let id = href[href.length - 1];

        firebase.database().ref('games/' +id).once('value').then(function(snapshot) {
            let data = snapshot.val();
            let checkers = data.checkers;

            if(isRed) {
                return checkers[index].color === 'red' ? true : false;
            }

            return checkers[index].color === 'red' ? false : true;
        });
    }
}

export default CheckerValidator;