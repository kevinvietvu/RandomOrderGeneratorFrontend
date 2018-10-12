import React from 'react';
import '../styles/menu.css';
import loading from '../Loading_Spinner.gif';
import Navbar from '../components/navbar.js';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

/*
build complex UIs from small and isolated pieces of code called components (React.Component)
A component takes in parameters, called props (short for “properties”), and returns a hierarchy
of views to display via the render method.
*/
export default class Menu extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        company : this.props.match.params.restaurant,
        stateName : "CA",
        amount : '',
        menu: {},
        menuTypes : {},
        randomOrders : {},
        loadingMenu : true,
        devFlag : false,
      };

    this.handleChange = this.handleChange.bind(this);
  }

  resetComponentState(menuData) {
    const types = {}

    Object.keys(menuData).forEach(function(menuType) {
      types[menuType] = false
    });

    this.setState( { menuTypes : types  } )

    this.setState( { randomOrders : {} })

    this.setState( { loadingMenu : false } )
  }

  /*
    we use this.props.match.params.restaurant in fetchMenuData() because sometimes calling
    this.setState( { company : this.props.match.params.restaurant} ) within the componentDidUpdate()
    doesn't update quickly enough to reflect the new values in order to fetch the menu data
    test by using console.log("STATE : " + this.state.company + " | PROP : " + this.props.match.params.restaurant)
  */
  fetchMenuData(apiURL) {
    this.setState( { loadingMenu : true } )
    if (localStorage.getItem(this.props.match.params.restaurant)) {
      const menuData = JSON.parse(localStorage.getItem(this.props.match.params.restaurant))
      this.setState( { menu: menuData } )
      this.resetComponentState(menuData)
    }
    else {
      axios.get(apiURL)
        .then(res => {
          /* Set initial state with server data */
          const menuData = res.data
          this.setState( { menu: menuData } )

          localStorage.setItem(this.props.match.params.restaurant, JSON.stringify(menuData))

          this.resetComponentState(menuData)

        }).catch(function(error) {
          console.log(error);
        });
    }

  }

  /*
     Fetch server data in the componentDidMount lifecycle method, method executed only once.
     Reason we use this.state.company once throughout the component is because when the component
     is first mounted, the initial state is set by the prop given by the router url (/:restaurant)
  */
    componentDidMount() {
      document.title = "Random Order Generator";
      var apiURL = ""
      if (this.state.devFlag === true) {
        //console.log("dev")
        apiURL = "http://localhost:8000/api/" + this.state.company + "/" + this.state.stateName + "/"
      }
      else {
        //console.log("prod")
        apiURL = "https://randomordergeneratorbackend.herokuapp.com/api/" + this.state.company + "/" + this.state.stateName + "/"
      }
      this.fetchMenuData(apiURL)
    }

    /*
      used to update this menu component when props change from clicking a different restaurant route
      compare current prop to the new prop when routing and retrieve new menu data
    */
    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.match.params.restaurant !== prevProps.match.params.restaurant) {
        this.setState( { company : this.props.match.params.restaurant } )
        var apiURL = ""
        if (this.state.devFlag === true) {
          //console.log("dev")
          apiURL = "http://localhost:8000/api/" + this.props.match.params.restaurant + "/" + this.state.stateName + "/"
        }
        else {
          //console.log("prod")
          apiURL = "https://randomordergeneratorbackend.herokuapp.com/api/" + this.props.match.params.restaurant + "/" + this.state.stateName + "/"
        }
        this.fetchMenuData(apiURL)
      }
    }

    displayMenuTypes() {
      const menu = this.state.menu
      const menuTypes = this.state.menuTypes
      return Object.keys(menu).map(menuType => {
        var menuItems = menu[menuType]
        var menuTypeToggle = menuTypes[menuType]
        var loadImages = false;
        var menuTypeImage = ""
        menuTypeImage=menuType.replace(/\s+/g,"+");
        const imgLink = "https://s3-us-west-1.amazonaws.com/elasticbeanstalk-us-west-1-699070318617/" + this.state.company + "/" + menuTypeImage + ".jpg"
        //https://stackoverflow.com/questions/46520847/using-map-to-access-nested-json-in-react-native
        return (
          <li key={menuType} className="menutype">
            <button className="largebtn btn-block" onClick={() => this.toggleMenuItems( menuType )}>
              {loadImages ? <img src={imgLink} alt="https://s3-us-west-1.amazonaws.com/elasticbeanstalk-us-west-1-699070318617/Loading+Spinner.gif" height="50" width="50"/> : ""}
              {menuType}
            </button>
            <ul className="ulborder">
                {menuTypeToggle ? this.displayMenuItemsOnToggle(menuItems) : ""}
            </ul>
          </li>
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
          <li key={itemName}>
            {itemName} : ${itemPrice}
          </li>
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
      var apiURL = ""
      if (this.state.devFlag === true) {
        //console.log("dev")
        apiURL = "http://localhost:8000/api/randomOrder"
      }
      else {
        //console.log("prod")
        apiURL = "https://randomordergeneratorbackend.herokuapp.com/api/randomOrder"
      }
      axios({
        method: 'post',
        url: apiURL,
        data: {
          'company': this.state.company,
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

  loadingScreen() {
    return (
      <div className="loadingMenu">
      <p className="loadingText"> Loading Menu </p>
      <p>Sorry for the long wait time, currently fetching menu data</p>
      <img src={loading} alt="https://s3-us-west-1.amazonaws.com/elasticbeanstalk-us-west-1-699070318617/Loading+Spinner.gif" height="250" width="250"/>
      </div>
    );
  }

  //https://stackoverflow.com/questions/42761378/react-create-a-new-html-element-on-click
  toggleMenuItems(menuTypeGiven) {
    var types = this.state.menuTypes
    var toggle = types[menuTypeGiven]
    types[menuTypeGiven] = !toggle
    this.setState( { menuTypes : types } )
  }

  handleChange(event) {
    //pattern="[0-9]+([\.][0-9]+)?" regex for decimal numbers, if I ever want to implement another text input for change
    if (event.target.value === "" || (!isNaN(event.target.value) && parseInt(event.target.value,10) <= 1000))
      this.setState({amount: event.target.value});
    else
      alert("Input must be a number and under $1000")
  }

  render() {
    const header = this.state.company + ", " + this.state.stateName

    return (
      <html lang="en">
        <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous"/>
        </head>
        <body>
          <Navbar/>
          <div className="container-fluid">
          { this.state.loadingMenu ? this.loadingScreen() :
            <div className="container">
              <h1> <p className="pWhite"> {header} </p> </h1>
              <ul>
                { this.displayMenuTypes() }
              </ul>
              <label>
                <p className="pWhite">Money you want to spend</p>
                <input type="text"  value={this.state.amount} onChange={this.handleChange}/>
              </label>
              <button className="btn shadowbtn" onClick={() => this.getRandomOrder(parseFloat(this.state.amount)) }>
                Generate Random Order
              </button>
              <ul className="ulborder"> {this.displayRandomOrder()} </ul>
            </div>
          }
          </div>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossOrigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossOrigin="anonymous"></script>
        <p className="backgroundImgSource">Background Image via www.mcdonalds.com/us/en-us.html </p>
        </body>
      </html>
    );
  }
}
/*
ReactDOM.render(
  <RandomOrderGenerator devFlag="false" company="McDonalds" state ="CA"/>,
  document.getElementById('root')
); */
