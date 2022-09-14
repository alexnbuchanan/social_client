import React, { useState } from "react";
import { makePostCommentAction } from "../actions";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputForm: {
    padding: "8px 8px 8px 8px",
    marginTop: "5px",
    borderRadius: "6px",
    backgroundColor: "#F3F3F3",
    border: "none",
    width: "98%",
  },
}));

export default function MakeComment(props) {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const profilePic = useSelector((state) => state.profilePic);
  const classes = useStyles();

  const onInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!comment) return;

    dispatch(
      makePostCommentAction({
        postUserId: props.postUserId,
        postId: props.postId,
        commenter_uid: props.uid,
        commenter_comment: comment,
        commenter_handle: props.handle,
        comment_date: new Date().getTime(),
        comment_notification: props.comment_notification,
        // profilePic: props.profilePic,
      })
    );

    setComment("");
  };

  return (
    <div style={{ marginLeft: "60px", marginTop: "20px" }}>
      <Grid container>
        <Grid item xs={1}>
          {profilePic ? (
            <img
              src={profilePic}
              width="40"
              height="40px"
              alt="profile pic"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          ) : (
            <img
              src="images/profile_pic_default.jpg" /* DON'T DELETE THIS MESSAGE: keep images in public folder */
              width="40px"
              height="40px"
              alt="profile pic default"
              style={{ borderRadius: "8px" }}
            />
          )}
        </Grid>
        <Grid item xs={11}>
          <form onSubmit={handleSubmit} style={{ marginLeft: "10px" }}>
            <input
              className={classes.inputForm}
              type="text"
              value={comment}
              onChange={onInputChange}
              placeholder="Make a comment..."
            />
          </form>
        </Grid>
      </Grid>
    </div>
  );
}
