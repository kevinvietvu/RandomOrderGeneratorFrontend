import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class FetchDemo extends React.Component {
  state = {
    company : "McDonalds",
    stateName : "CA",
    menu: {},
  }

// Fetch server data in the componentDidMount lifecycle method, method executed only once
  componentDidMount() {
    axios.get("http://localhost:8000/api/")
      .then(res => {
		/*
		The component’s state is updated by calling this.setState with the new array of posts.
		This triggers a re-render, and then the posts are visible.
		*/
        const menuData = res.data
        this.setState({ menu: menuData },
            ()=>{console.log()}
        );

      }).catch(function(error) {
    console.log(error);
  });


  axios({
    method: 'post',
    url: 'http://localhost:8000/api/test',
    data: {
      'company':'McDonalds',
      'state':'CA'
      'amount' : 20
    },
    headers: {
      "content-type": "application/json"
    }
  }).then(function (response) {
    console.log(response)
  }).catch(function (error) {
    console.log(error)
  });

  }

  /*
  The backticks are an ES6 template string, and it probably does what you think:
  the ${...} part is replaced by the value of that expression, so the URL passed
  to axios.get is actually http://www.reddit.com/r/reactjs.json.
  */
  render() {
    const header = this.state.company + ", " + this.state.stateName
    const menu = this.state.menu
    const menuHTML = Object.keys(menu).map(menuType => {
      //const menuItems = menu[menuType]
      //https://stackoverflow.com/questions/46520847/using-map-to-access-nested-json-in-react-native
      return (
        <ul key={menuType}>
          {menuType}

        </ul>
      );
    });

    return (
      <div>
        <h1>{header}</h1>
        <div>
          <ul> {menuHTML} </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <FetchDemo testApi="reactjs"/>,
  document.getElementById('root')
);
