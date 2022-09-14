import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";

export default function CommentUsersLike({ commentLike }) {
  const users = useSelector((state) => state.users);
  const [previousCommentLikeClick, setPreviousCommentLikeClick] = useState(5);

  function findTrueLengthOfLikeComments() {
    let commentLikeLength =
      Object.values(commentLike ? commentLike : {}).length -
      previousCommentLikeClick;
    commentLikeLength = commentLikeLength < 0 ? 0 : commentLikeLength;
    debugger;
    return commentLikeLength;
  }

  function findUserName() {
    const uidOfUsersWhoLikedComment = Object.values(
      commentLike ? commentLike : {}
    );
    if (uidOfUsersWhoLikedComment.length > 0) {
      let usersWhoLikedComment = [];

      uidOfUsersWhoLikedComment.map((uid) => {
        var matchingUser = users.find((user) => user.uid === uid);
        return usersWhoLikedComment.push(matchingUser.handle);
      });
      return usersWhoLikedComment
        .slice(findTrueLengthOfLikeComments())
        .map((userWhoLikeComment) => {
          return (
            <div style={{ marginTop: "5px" }}>
              <AiOutlineLike
                style={{ marginRight: "5px", verticalAlign: "middle" }}
              />
              {userWhoLikeComment}
              <br />
            </div>
          );
        });
    }
  }

  return (
    <div>
      <p>{findUserName()}</p>
      {findTrueLengthOfLikeComments() === 0 ? null : (
        <button
          style={{
            marginLeft: "5px",
            background: "none",
            color: "#757575",
            border: "none",
            outline: "inherit",
            verticalAlign: "top",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => {
            setPreviousCommentLikeClick(previousCommentLikeClick + 5);
          }}
        >
          See more likes
        </button>
      )}
      {findTrueLengthOfLikeComments() === 0 && previousCommentLikeClick > 5 ? (
        <button
          style={{
            marginLeft: "5px",
            background: "none",
            color: "#757575",
            border: "none",
            outline: "inherit",
            verticalAlign: "top",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => {
            setPreviousCommentLikeClick(5);
          }}
        >
          Hide likes
        </button>
      ) : null}
    </div>
  );
}
