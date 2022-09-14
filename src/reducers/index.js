import postsReducer from "./posts";
import { combineReducers } from "redux";
import postClicked from "./postClicked";
import authReducer from "./authReducer";
import usernameReducer from "./usernameReducer";
import loadingReducer from "./loadingReducer";
import notificationClicked from "./notificationClicked";
import profilePicReducer from "./profilePicReducer";
import profileClicked from "./profileClickedReducer";
import profilePicUpdateReducer from "./profilePicUpdateReducer";
import newNotificationsReducer from "./newNotificationsReducer";
import photoButtonClickedReducer from "./photoButtonClickedReducer";

const allReducers = combineReducers({
  users: postsReducer,
  postClicked: postClicked,
  userId: authReducer,
  username: usernameReducer,
  loading: loadingReducer,
  notificationClicked: notificationClicked,
  profilePic: profilePicReducer,
  profileClicked: profileClicked,
  profilePicUpdate: profilePicUpdateReducer,
  newNotifications: newNotificationsReducer,
  photoButtonClicked: photoButtonClickedReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;
