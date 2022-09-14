import React, { useRef } from "react";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  postButtonClicked,
  notificationsClicked,
  profileClicked,
} from "../actions";
import Notifications from "./Notifications";
import { IoNotificationsOutline } from "react-icons/";

function Nav({
  setIsVisible,
  setIsNotificationVisible,
  notificationCount,
  setNotificationClicked,
}) {
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.userId);
  const profilePic = useSelector((state) => state.profilePic);

  // const closePopup = () => {
  //   dispatch(profileClicked());
  // };

  return (
    <div>
      <CssBaseline />
      <AppBar position="relative" elevation={0} style={{ background: "white" }}>
        <Toolbar>
          <Grid container>
            <Grid item xs={9} />

            <Grid item xs={3} style={{ textAlign: "right" }}>
              <Typography>
                {/* <Button
                  onClick={() => dispatch(postButtonClicked())}
                  style={{ backgroundColor: "yellow" }}
                >
                  Post
                </Button> */}
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsNotificationVisible((prev) => !prev);
                    setNotificationClicked(true);
                    dispatch(
                      notificationsClicked(true)
                    ); /* 12/30/21: HOW CAN YOU DO THIS WITHOUT REDUX STATE */
                  }}
                  style={{
                    padding: 5,
                    minHeight: 5,
                    minWidth: 5,
                    borderRadius: "50%",
                    height: "40px",
                    width: "40px",
                    marginRight: "10px",
                  }}
                >
                  <Notifications
                    uid={uid}
                    notificationCount={notificationCount}
                  />
                </Button>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsVisible((prev) => !prev);
                  }}
                  style={{
                    padding: 0,
                    minHeight: 0,
                    minWidth: 0,
                  }}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      width="50px"
                      height="50px"
                      alt="profile pic"
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src="images/profile_pic_default.jpg" /* DON'T DELETE THIS MESSAGE: keep images in public folder */
                      width="50px"
                      height="50px"
                      alt="profile pic default"
                      style={{ borderRadius: "8px" }}
                    />
                  )}
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Nav;
