import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import firebase from "../src/firebase";
import rootReducer from "./store/reducers";
import { setUser, clearUser } from "./store/actions/index";
import Spinner from './components/Spinner'

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push("/"); // we can use 'history' because of withRouter.
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    });
  }

  render() {
    return this.props.isLoading ? <Spinner /> : (
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

const RoutWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RoutWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
