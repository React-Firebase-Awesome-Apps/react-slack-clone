import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css"; // for the style!!!
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import firebase from "../src/firebase";
import rootReducer from "./store/reducers";
import { setUser, clearUser } from "./store/actions/index";
import Spinner from "./components/Spinner";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user); // we can use setUser action because of 'connect'.
        this.props.history.push("/"); // we can use 'history' because of withRouter.
      } else {
        this.props.history.push("/login");
        this.props.clearUser(); // Why do we need that? It sets isLoading to false, while w didn't set it to true anywhere.
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }  
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

/* Use 'connect' to set user data on global state. I allows us to connect 
redux state and actions with a component. */

const RoutWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RoutWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
