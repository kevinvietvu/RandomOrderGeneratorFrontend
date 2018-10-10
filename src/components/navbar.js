import React from 'react';
import '../styles/index.css';
import { NavLink } from 'react-router-dom'

export default class Navbar extends React.Component {
  constructor(props) {
      super(props)
      this.state = {

      };
  }

  render() {
    return (
        <ul id="navbar">
        <li>
          <NavLink to="/" activeStyle={
            {
              textDecoration: 'none',
              textAlign:"center",
              color:"white",
              fontSize:"23px",
              display:"inline-block",
              marginTop:"10px"
            }
          }>Random Order Generator</NavLink>
        </li>
        <li>
          <div className="dropdown">
           <button className="dropbtn">Fast Food Restaurants</button>
           <div className="dropdown-content">
               <NavLink to="/Burger-King">Burger King</NavLink>
               <NavLink to="/Jack-In-The-Box">Jack In The Box</NavLink>
               <NavLink to="/KFC">KFC</NavLink>
               <NavLink to="/McDonalds">McDonalds</NavLink>
               <NavLink to="/Taco-Bell">Taco Bell</NavLink>
               <NavLink to="/Wendy's">Wendys</NavLink>
           </div>
          </div>
        </li>
        </ul>
    );
  }
}
