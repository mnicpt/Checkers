import React, {Component} from 'react';
import CheckerValidator from './CheckerValidator';

class Checker extends Component {
    constructor() {
        super();
        this.validator = new CheckerValidator();
    }

    dragStart(e) {
        let parent = e.target.parentElement;
        let location = e.target.dataset.location;
        e.dataTransfer.setData("parent", parent);
        e.dataTransfer.setData("location", location);
    }

    render() {
        let kingText = "";
        if(this.props.king) {
            kingText = "K";
        }

        return (
        <div data-location={this.props.location} data-king={this.props.king} className={'checker ' + this.props.color} draggable='true' onDragStart={(e) => this.dragStart(e)}>
            {kingText}
        </div>
        );
    }
}

export default Checker;