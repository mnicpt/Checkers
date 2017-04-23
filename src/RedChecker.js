import Checker from './Checker';
import King from './King';
import * as util from './CheckersUtil';

class RedChecker extends Checker {

    move(previousLocation, newLocation, checker, previousChecker) {
        let locationDifference = newLocation - previousLocation;

        if(util.isKing(checker)) {
            new King().move(true, previousLocation, newLocation, previousChecker);
        } else if(this.validator.validSingleRedMove(locationDifference, previousChecker)) {
            util.updateCheckerLocation(true, previousLocation, newLocation).then(
                () => util.checkForKing(true, parseInt(newLocation, 10))
            )
        } else if(this.validator.validDoubleRedMove(true, previousLocation, locationDifference, previousChecker)) {
            let jumpedLocation = parseInt(previousLocation, 10) + parseInt(locationDifference / 2, 10);
            util.updateCheckerLocation(true, previousLocation, newLocation).then(() => {
                util.deleteJumpedCheckerAtIndex(jumpedLocation).then(
                    () => util.checkForKing(true, parseInt(newLocation, 10), true)
                )
            });
        }
    }
}

export default RedChecker;