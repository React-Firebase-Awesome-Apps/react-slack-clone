import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";

const initalUserState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = initalUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

const initalChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
};

const channel_reducer = (state = initalChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      };
    default:
      return state;
  }
};

const initialColorsState = {
  primaryColor: "",
  secondaryColor: ""
};

const colors_reducer = (state = initialColorsState, action) => {
  
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  colors: colors_reducer
});

export default rootReducer;
