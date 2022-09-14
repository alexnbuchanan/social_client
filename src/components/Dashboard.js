import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Button,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post";
import Nav from "./Nav";
import MakePost from "./MakePost";
import FullPageLoader from "./FullPageLoader";
import { confirmAlert } from "react-confirm-alert";
import {
  makeDeleteProfile,
  closeProfileMenu,
  closeNotificationsMenu,
} from "../actions";
import Profile from "./Profile";
import NotificationList from "./NotificationList";
import useOutsideClick from "../hooks/useOutsideClick";

const useStyles = makeStyles((theme) => ({
  paper: {
    alignItems: "center",
  },
}));

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, deleteUserProfile } = useAuth();
  const history = useHistory();
  const classes = useStyles();

  const username = useSelector((state) => state.username);
  const postClicked = useSelector((state) => state.postClicked);
  const profileClicked = useSelector((state) => state.profileClicked);

  const loading = useSelector((state) => state.loading);
  const profilePic = useSelector((state) => state.profilePic);
  const newNotifications = useSelector((state) => state.newNotifications);
  const dispatch = useDispatch();
  const [docRef, isVisible, setIsVisible] = useOutsideClick();
  const [notificationRef, isNotificationVisible, setIsNotificationVisible] =
    useOutsideClick();

  const [notificationCount, setNotificationCount] = useState("");
  const [notificationClicked, setNotificationClicked] = useState(false);
  const refProfile = useRef();
  const refNotifications = useRef();

  useEffect(() => {
    if (newNotifications.length > 0 && !isNotificationVisible && !isVisible) {
      if (notificationClicked) {
        newNotifications.length = 0;
        setNotificationCount("0");
      }
    }
  }, [isNotificationVisible]);

  useOutsideClick(refProfile, () => {
    dispatch(closeProfileMenu());
  });

  useOutsideClick(refNotifications, () => {
    dispatch(closeNotificationsMenu());
  });

  // const useOutsideClick = (ref) => {
  //   dispatch(profileClicked());
  // };

  // const submitProfileDelete = () => {
  //   confirmAlert({
  //     message: "Are you sure you want to delete your profile?",
  //     buttons: [
  //       {
  //         label: "Yes",
  //         onClick: async () => {
  //           dispatch(makeDeleteProfile());
  //           handleLogout();
  //           await deleteUserProfile();
  //         },
  //         // onClick: () => dispatch(makeDeleteProfile(), handleLogout),
  //       },
  //       {
  //         label: "No",
  //       },
  //     ],
  //   });
  // };

  // async function handleLogout() {
  //   setError("");

  //   try {
  //     await logout();

  //     dispatch({
  //       type: "RESET_STATE",
  //     });
  //     history.pushState("/login");
  //   } catch {
  //     setError("Failed to log out");
  //   }
  // }

  console.log("before", isNotificationVisible, newNotifications);

  return (
    <div style={{ background: "#F4F5F5", paddingBottom: "20px" }}>
      {loading.isLoading ? <FullPageLoader /> : null}
      <Nav
        setIsVisible={setIsVisible}
        setIsNotificationVisible={setIsNotificationVisible}
        notificationCount={notificationCount}
        setNotificationClicked={setNotificationClicked}
      />

      {profileClicked ? <Profile /> : null}

      <div ref={docRef}>{isVisible ? <Profile /> : null}</div>

      <div ref={notificationRef}>
        {isNotificationVisible ? (
          <NotificationList notifications={newNotifications} />
        ) : null}
      </div>

      <Container component="main" maxWidth="sm">
        <Grid item xs={12}>
          <CssBaseline />

          <div className={classes.paper}>
            <MakePost />

            <Post />
          </div>
        </Grid>
      </Container>
    </div>
  );
}
