import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

/*
build complex UIs from small and isolated pieces of code called components (React.Component)
A component takes in parameters, called props (short for “properties”), and returns a hierarchy
of views to display via the render method.
*/
class FetchDemo extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        company : "McDonalds",
        stateName : "CA",
        amount : '',
        menu: {},
        menuTypes : {},
        randomOrders : {},
      };


    this.handleChange = this.handleChange.bind(this);
  }

  // Fetch server data in the componentDidMount lifecycle method, method executed only once
    componentDidMount() {
      axios.get("http://localhost:8000/api/")
        .then(res => {
  		/*
  		  Set initial state with server data
  		*/
          const menuData = res.data
          this.setState({ menu: menuData },
              ()=>{console.log()}
          );

          const types = {}

          //using forEach instead of key => {} prevents return warning
          Object.keys(menuData).forEach(function(menuType) {
            types[menuType] = false
          });

          this.setState( { menuTypes : types  },
              ()=>{console.log()}
          );

        }).catch(function(error) {
          console.log(error);
        });
    }

    displayMenuTypes() {
      const menu = this.state.menu
      const menuTypes = this.state.menuTypes
      return Object.keys(menu).map(menuType => {
        var menuItems = menu[menuType]
        var menuTypeToggle = menuTypes[menuType]
        //https://stackoverflow.com/questions/46520847/using-map-to-access-nested-json-in-react-native
        return (
          <div key={menuType}>
            <button onClick={() => this.toggleMenuItems( menuType )}>
                {menuType}
            </button>

            <ul>
                {menuTypeToggle ? this.displayMenuItemsOnToggle(menuItems) : ""}
            </ul>
          </div>

        );
      });
    }

    //change this to a form later for user input
    displayMenuItemsOnToggle(menuItems) {
      return Object.keys(menuItems).map(key => {
        const item = menuItems[key]
        const itemName = item['name']
        const itemPrice = item['price']
        return (
          <li key={itemName}> {itemName} : ${itemPrice} </li>
        );
      });
    }

    displayRandomOrder() {
      const randomOrder = this.state.randomOrders
      //if empty = true, that means the django call returned an empty random order
      if (randomOrder['empty'] !== true) {
        return Object.keys(randomOrder).map(itemName => {
          const itemPrice = randomOrder[itemName]['price']
          const itemCount = randomOrder[itemName]['count']
          return (
            <li key={itemName}> {itemCount} {itemName} : ${itemPrice} </li>
          );
        });
      }
      else {
        return (
          <li> Could not return a random order for given amount </li>
        );
      }
    }

  getRandomOrder(amountGiven) {
    if (isNaN(amountGiven) || amountGiven == null || amountGiven === "") {
      alert("Enter a value before generating a random order")
    }
    else {
      axios({
        method: 'post',
        url: 'http://localhost:8000/api/test',
        data: {
          'company':'McDonalds',
          'state':'CA',
          'amount' : amountGiven
        },
        headers: {
          "content-type": "application/json"
        }
      }).then(res => {
        // arrow functions (res => {}) automatically binds functions so calling this.setState won't throw an error
        //seen here https://stackoverflow.com/questions/38238512/react-this-is-undefined
        const randomOrder = res.data
        this.setState( { randomOrders : randomOrder } )
      }).catch(function (error) {
        console.log(error)
      });
    }
  }

  //https://stackoverflow.com/questions/42761378/react-create-a-new-html-element-on-click
  toggleMenuItems(menuTypeGiven) {
    var types = this.state.menuTypes
    var toggle = types[menuTypeGiven]
    types[menuTypeGiven] = !toggle
    this.setState( { menuTypes : types } )
  }

  handleChange(event) {
    // pattern="[0-9]+([\.][0-9]+)?" regex for decimal numbers, if I ever want to implement another text input for change
    if (event.target.value === "" || (!isNaN(event.target.value) && parseInt(event.target.value) <= 1000))
      this.setState({amount: event.target.value});
    else
      alert("Input must be a number and under $1000")
  }

  render() {
    const header = this.state.company + ", " + this.state.stateName

    return (
      <div>
        <h1>{header}</h1>
        <div>
          <ul> {this.displayMenuTypes()} </ul>
           <label>
             $ You Want To Spend
             <input type="text"  value={this.state.amount} onChange={this.handleChange}/>
           </label>
          <button onClick={() => this.getRandomOrder(parseFloat(this.state.amount)) }>
            Generate Random Order
          </button>
          {this.displayRandomOrder()}
        </div>
      </div>

    );
  }
}


ReactDOM.render(
  <FetchDemo testApi="reactjs app"/>,
  document.getElementById('root')
);
