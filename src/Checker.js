import React from 'react';

class Checker extends React.Component {
  dragStart(e) {
    let parent = e.target.parentElement;
    let location = e.target.dataset.location;
    e.dataTransfer.setData("parent", parent);
    e.dataTransfer.setData("location", location);
  }

  render() {
    return (
      <div data-location={this.props.location} className={'checker ' + this.props.color} draggable='true' onDragStart={(e) => this.dragStart(e)}></div>
    );
  }
}

export default Checker;