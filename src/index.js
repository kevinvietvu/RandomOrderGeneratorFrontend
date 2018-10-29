import React from 'react'
import ReactDOM from 'react-dom';
import './styles/index.css';
import Menu  from './components/menu.js';
import Home from './components/home.js';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
//:restaurant passings a prop to the Menu component
//accessed via this.props.match.params.restaurant
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/:restaurant" component={Menu}/>
      <Route path="/" component={Home}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
