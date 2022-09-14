import React, { useState, useEffect } from "react";
import { MdThumbUp, MdComment, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  makeLikeCommentAction,
  makeDeleteCommentAction,
  displayUsersWhoLikeComment,
} from "../actions";
import { confirmAlert } from "react-confirm-alert";
import Timestamp from "./Timestamp";
import CommentUsersLike from "./CommentUsersLike";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { Modal, Button, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PopupModal from "./PopupModal";

const useStyles = makeStyles((theme) => ({
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    backgroundColor: "white",
    borderRadius: "10px",
  },
  thumbStyle: {
    cursor: "pointer",
    fontSize: "18px",
    color: "#757575",
  },
}));

export default function Comments(props) {
  const { showPopupModal } = props;
  const users = useSelector((state) => state.users);
  const comments = props.post?.comments_text;
  const dispatch = useDispatch();
  const [previousCommentsClick, setPreviousCommentsClick] = useState(1);
  const uid = useSelector((state) => state.userId);
  const [modalData, setModalData] = useState({});
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submitCommentDelete = (props) => {
    confirmAlert({
      message: "Are you sure you want to delete your comment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => dispatch(makeDeleteCommentAction(props)),
        },
        {
          label: "No",
        },
      ],
    });
  };

  function order(a, b) {
    return a.comment_date > b.comment_date
      ? 1
      : a.comment_date < b.comment_date
      ? -1
      : 0;
  }

  // function findCommentImage(commentPostId) {
  //   return users.map((user) => {
  //     if (user.uid === commentPostId) {
  //       debugger;
  //       return user.profilePic;
  //     }
  //   });
  // }

  function findCommentImage(commentPostId) {
    const matchingUser = users.filter((user) => user.uid === commentPostId);
    return matchingUser[0] && matchingUser[0].profilePic;
  }

  // var findLengthOfComments = comments.length - previousCommentsClick;

  function findTrueLengthOfComments() {
    let commentLength = comments.length - previousCommentsClick;
    commentLength = commentLength < 0 ? 0 : commentLength;
    return commentLength;
  }

  // console.log("length of comments", findLengthOfComments);

  // console.log("clicks on comments", previousCommentsClick);

  // console.log("T/F", findLengthOfComments < 0);

  const alreadyLikedCheck = (data) => {
    if (data) {
      const commentLikeUid = Object.values(data);
      if (commentLikeUid.includes(uid)) {
        return true;
      }
    }
  };

  return !comments ? null : (
    <div>
      {findTrueLengthOfComments() === 0 ? null : (
        <button
          style={{
            marginLeft: "60px",
            background: "none",
            color: "#757575",
            border: "none",
            outline: "inherit",
            verticalAlign: "top",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => {
            setPreviousCommentsClick(previousCommentsClick + 3);
          }}
        >
          See previous replies
        </button>
      )}
      {findTrueLengthOfComments() === 0 && previousCommentsClick > 1 ? (
        <button
          style={{
            marginLeft: "60px",
            background: "none",
            color: "#757575",
            border: "none",
            outline: "inherit",
            verticalAlign: "top",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => {
            setPreviousCommentsClick(1);
          }}
        >
          Hide comments
        </button>
      ) : null}

      {Object.values(comments)
        .slice()
        .sort(order)
        .slice(findTrueLengthOfComments())
        .map((comment) => (
          <div
            style={{
              borderTop: "solid",
              borderWidth: ".1px",
              marginLeft: "60px",
              marginTop: "8px",
              borderColor: "#dcdcdc",
            }}
            key={comment.key}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              {findCommentImage(comment.commenter_uid) ? (
                <img
                  src={findCommentImage(comment.commenter_uid)}
                  width="50px"
                  height="50px"
                  alt="profile pic"
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
              ) : (
                <img
                  src="/images/profile_pic_default.jpg"
                  width="50px"
                  height="50px"
                  alt="profile pic default"
                  style={{ borderRadius: "8px" }}
                />
              )}

              <p style={{ marginLeft: "10px", fontWeight: "600" }}>
                {comment.commenter_handle}
              </p>

              <div
                style={{
                  marginLeft: "10px",
                  fontSize: "12px",
                  color: "#757575",
                }}
              >
                <Timestamp date={comment.comment_date} />
              </div>
            </div>

            <div style={{ marginLeft: "60px" }}>
              <p>{comment.commenter_comment}</p>

              {alreadyLikedCheck(comment.comment_like) ? (
                <AiFillLike
                  className={classes.thumbStyle}
                  onClick={() => {
                    dispatch(
                      makeLikeCommentAction({
                        uid: props.uid,
                        postUserId: props.postUserId,
                        postId: props.postId,
                        commentId: comment.key,
                      })
                    );
                  }}
                />
              ) : (
                <AiOutlineLike
                  className={classes.thumbStyle}
                  onClick={() => {
                    dispatch(
                      makeLikeCommentAction({
                        uid: props.uid,
                        postUserId: props.postUserId,
                        postId: props.postId,
                        commentId: comment.key,
                      })
                    );
                  }}
                />
              )}

              <button
                onClick={() => {
                  dispatch(
                    displayUsersWhoLikeComment({
                      uid: props.uid,
                      postUserId: props.postUserId,
                      postId: props.postId,
                      commentId: comment.key,
                    })
                  );
                  // handleOpen();
                  console.log("comment_daa", comment.comment_like);
                  showPopupModal(comment.comment_like, "comments");
                  //  setModalData(comment.comment_like);
                }}
                style={{
                  margin: "0 0 0 0",
                  // padding: "0 0 0 0",
                  background: "none",
                  color: "#757575",
                  border: "none",
                  outline: "inherit",
                  verticalAlign: "top",
                  cursor: "pointer",
                }}
              >
                {comment.comment_like &&
                Object.keys(comment.comment_like).length > 0
                  ? Object.keys(comment.comment_like).length
                  : null}
              </button>

              {uid === comment.commenter_uid ? (
                <FiTrash2
                  onClick={() =>
                    submitCommentDelete({
                      uid: props.uid,
                      postUserId: props.postUserId,
                      postId: props.postId,
                      commentId: comment.key,
                      commenter_uid: comment.commenter_uid,
                    })
                  }
                  style={{
                    cursor: "pointer",
                    color: "#757575",
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                />
              ) : null}
            </div>
          </div>
        ))}
    </div>
  );

  // .sort(function(a, b) { return a.comment_date - b.comment_date })
}
