import Checker from './Checker';
import * as util from './CheckersUtil';

class King extends Checker {

    move(isRed, previousLocation, newLocation, previousChecker) {
        let locationDifference = Math.abs(newLocation - previousLocation);
        let jumpedLocation;

        if(newLocation > previousLocation) {
            jumpedLocation = parseInt(previousLocation, 10) + parseInt(locationDifference / 2, 10);
        } else {
            jumpedLocation = parseInt(previousLocation, 10) - parseInt(locationDifference / 2, 10);
        }

        if(this.validator.validKingMove(locationDifference, previousChecker)) {
            return util.updateCheckerLocation(isRed, previousLocation, newLocation);
        } else if(this.validator.validDoubleKingMove(isRed, previousLocation, locationDifference, previousChecker, jumpedLocation)) {
            return util.updateCheckerLocation(isRed, previousLocation, newLocation).then(
                () => util.deleteJumpedCheckerAtIndex(jumpedLocation).then(
                    () => util.canGoAgain(isRed, true, newLocation)
                )
            );
        }
    }
}

export default King;