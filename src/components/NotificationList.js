import React from "react";
import {
  Card,
  Button,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "350px",
    position: "absolute",
    right: "5em",
  },
}));

export default function NotificationList(props) {
  const classes = useStyles();

  console.log("props", props);

  const typeOfNotification = (notification) => {
    if (notification) {
      let notificationType;
      notificationType = notification.hasOwnProperty("like_notification")
        ? "like"
        : "comment";
      return notificationType;
    }
  };

  console.log("notifictions", props.notification?.length);

  return (
    <>
      {props.notifications?.length > 0 && (
        <Card className={`${classes.paper} test-not`}>
          <CardContent>
            {props.notifications.map((notification) => {
              return (
                <div>
                  {typeOfNotification(notification) === "like" ? (
                    <div>
                      <p>{notification.userLikeHandle} likes your post</p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        {notification.commenter_handle} commented on your post
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}
