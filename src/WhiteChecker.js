import Checker from './Checker';
import King from './King';
import * as util from './CheckersUtil';

class WhiteChecker extends Checker {

    move(previousLocation, newLocation, checker, previousChecker) {
        let locationDifference = newLocation - previousLocation;

        if(util.isKing(checker)) {
            new King().move(false, previousLocation, newLocation, previousChecker);
        } else if(this.validator.validSingleBlackMove(locationDifference, previousChecker)) {
            util.updateCheckerLocation(false, previousLocation, newLocation).then(
                () => util.checkForKing(false, parseInt(newLocation, 10)))
        } else if(this.validator.validDoubleBlackMove(false, previousLocation, locationDifference, previousChecker)) {
            let jumpedLocation = parseInt(previousLocation, 10) - parseInt(-locationDifference / 2, 10);
            util.updateCheckerLocation(false, previousLocation, newLocation).then(() => {
                util.deleteJumpedCheckerAtIndex(jumpedLocation).then(
                    () => util.canGoAgain(false, false, newLocation).then(
                        () => util.checkForKing(false, parseInt(newLocation, 10))
                    )
                )
            });
        }   
    }
}

export default WhiteChecker;