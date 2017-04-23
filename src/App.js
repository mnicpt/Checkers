import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
 
import Home from './Home';
import Game from './Game';
 
export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/:token" component={Game} />
        </div>
      </HashRouter>
    );
  }
}