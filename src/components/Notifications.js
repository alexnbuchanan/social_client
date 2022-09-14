import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import usePrevious from "../hooks/usePrevious";
import NotificationList from "./NotificationList";
import {
  makeNotificationsStateUpdateAction,
  makeNewNotificationsAction,
} from "../actions";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import { IoIosNotificationsOutline } from "react-icons/io";

export default function Notifications(props) {
  const { notificationCount } = props;
  const [newNotifications, setNewNotifications] = useState([]);
  const users = useSelector((state) => state.users);
  const notificationClicked = useSelector((state) => state.notificationClicked);
  const prevUsers = usePrevious(users);
  const dispatch = useDispatch();

  const isEqual = _.isEqual(prevUsers, users);
  const timestamp = !isEqual
    ? new Date().getTime()
    : new Date("1991-09-24").getTime();

  /* useEffect(() => {
    setUsers(users);
  }, users);*/

  useEffect(() => {
    const notifications = [];

    users.forEach((user) => {
      if (user.uid === props.uid && user.posts) {
        user.posts.forEach((postContent) => {
          const likes = postContent.like ? postContent.like : null;
          const comments = postContent.comments_text
            ? Object.values(postContent.comments_text)
            : null;

          // let filtererdLikes
          // let filteredComments

          if (likes) {
            let filtererdLikesEntry = Object.values(likes).filter((post) => {
              return post.like_notification === false;
            });
            let filtererdLikesKey = Object.keys(likes)[0];

            let newFilteredLikes = filtererdLikesEntry.map((entry) => ({
              ...entry,
              likeKey: filtererdLikesKey,
            }));

            notifications.push(newFilteredLikes);
          }

          if (comments) {
            let letfilteredComments = comments.filter((post) => {
              return post.comment_notification === false;
            });
            notifications.push(letfilteredComments);
          }

          // const likeNewNotifications = likes ? likes.filter(post => {
          //   return post.like_notification === false
          // } ) : null

          // // const newLikes = likeNewNotifications.flat(Infinity);

          // const commentNewNotifications = comments ? comments.filter(post => {
          //   return post.comment_notification === false
          // } ) : null

          // const newComments = commentNewNotifications.flat(Infinity);

          // const combineLikesAndComments = likeNewNotifications.concat(commentNewNotifications)

          //  notifications.push([filtererdLikes, filteredComments]);
        });
      }
    });
    const notificationsDataClean = notifications.flat(Infinity);
    setNewNotifications(notificationsDataClean);
    dispatch(makeNewNotificationsAction({ newNotifications }));
  }, [timestamp]);

  useEffect(() => {
    if (notificationClicked === false) {
      console.log("newNotifications", newNotifications);
      dispatch(makeNotificationsStateUpdateAction({ newNotifications }));
    }
  }, [notificationClicked]);

  // useEffect(() => {
  //   if (notificationClicked) {
  //     dispatch(makeNewNotificationsAction({ newNotifications }));
  //   }
  // }, [notificationClicked]);

  // IS IT OKAY TO USE THE BELOW CODE INSTEAD OF USEEFFECT?

  // if (notificationClicked){
  //   dispatch(notificationsStateUpdate({newNotifications}))
  // }

  const useStyles = makeStyles((theme) => ({
    // body: {
    //   margin: "25",
    //   background: "#3f51b5",
    // },
    // iconButton: {
    //   position: "relative",
    //   display: "flex",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   width: 50,
    //   height: 50,
    //   color: "#333333",
    //   background: "#dddddd",
    //   border: "none",
    //   outline: "none",
    //   borderRadius: "50%",
    //   "&:hover": {
    //     cursor: "pointer",
    //   },
    //   "&:active": {
    //     background: "#cccccc",
    //   },
    // },
    iconButton__badge: {
      position: "absolute",
      top: -2,
      right: 1,
      width: 17,
      height: 17,
      background: "red",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
    },
  }));

  const classes = useStyles();
  const theme = useTheme();

  console.log("length", notificationCount);

  return (
    <div>
      <body className={classes.body} style={{ backgroundColor: "transparent" }}>
        <div type="button" className={classes.iconButton}>
          {/* <span className="material-icons">notifications</span> */}
          <IoIosNotificationsOutline style={{ fontSize: 25 }} />
          {newNotifications.length > 0 ? (
            <>
              {notificationCount === "0" ? (
                <span></span>
              ) : (
                <span className={classes.iconButton__badge}>
                  {newNotifications.length}
                </span>
              )}
            </>
          ) : null}
        </div>
      </body>

      {/* {notificationClicked ? (
        <NotificationList notifications={newNotifications} />
      ) : null} */}
    </div>
  );
}
