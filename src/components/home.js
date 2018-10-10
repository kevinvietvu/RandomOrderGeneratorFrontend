import React from 'react';
import '../styles/index.css';
import Navbar from '../components/navbar.js';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default class Home extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        devFlag : false
      };
  }

  //this is to wake up heroku backend earlier to prevent load times
  componentDidMount() {
    document.title = "Random Order Generator";
    var apiURL = ""
    if (this.state.devFlag === true) {
      //console.log("dev")
      apiURL = "http://localhost:8000/api/"
    }
    else {
      //console.log("prod")
      apiURL = "https://randomordergeneratorbackend.herokuapp.com/api/"
    }
    axios.get(apiURL)
      .then(res => {
        console.log(res)
      }).catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous"/>
        </head>
        <body>
          <Navbar/>
          <div className="container-fluid">
            <div className="container containerWhite">
              <p className="pHeader"> Don't know what to order with the money you have? Use the Random Order Generator!  </p>
              <p> To get started, click on one of the fast food restaurants listed below  </p>
              <div className="row">
                <div className="col"><NavLink to="/Burger-King">Burger King</NavLink></div>
                <div className="col"><NavLink to="/Jack-In-The-Box">Jack In The Box</NavLink></div>
                <div className="col"><NavLink to="/KFC">KFC</NavLink></div>
                <div className="w-100"></div>
                <div className="col"><NavLink to="/McDonalds">McDonalds</NavLink></div>
                <div className="col"><NavLink to="/Taco-Bell">Taco Bell</NavLink></div>
                <div className="col"><NavLink to="/Wendy's">Wendys</NavLink></div>
             </div>

            </div>
          </div>
          <p className="backgroundImgSource">Background Image via www.mcdonalds.com/us/en-us.html </p>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossOrigin="anonymous"></script>
        </body>
      </div>
    );
  }
}
