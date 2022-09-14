import React from "react";
import "../App.css";
import Signup from "./Signup";
import CreateUserName from "./CreateUserName";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import UploadProfilePic from "./UploadProfilePic";
import { auth } from "../firebase";
import { store } from "../index";
import { loginAction, logoutAction } from "../actions";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const font = "Inter";

const theme = createMuiTheme({
  typography: {
    fontFamily: font,
  },
});

auth.onAuthStateChanged((user) => {
  console.log({ user });
  if (user) {
    store.dispatch(loginAction(user.uid));
  } else {
    store.dispatch(logoutAction());
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div className="App">
          <Router>
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <Route path="/signup" component={Signup} />
                <Route path="/create-username" component={CreateUserName} />
                <Route
                  path="/profile-pic-upload"
                  component={UploadProfilePic}
                />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
              </Switch>
            </AuthProvider>
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
