import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineLike } from "react-icons/ai";

export default function PostUsersLike({ props }) {
  const users = useSelector((state) => state.users);

  function findUserName(props) {
    /*let usersWhoLikedPost = [];
    props.map((user) => {
      return usersWhoLikedPost.push(user.userLikeHandle);
    });*/
    return props
      .map((user) => user.userLikeHandle)
      .map((userWhoLikePost) => {
        return (
          <div>
            <AiOutlineLike
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            {userWhoLikePost}
            <br />
          </div>
        );
      });
  }

  return <div>{<p>{findUserName(props)}</p>}</div>;
}
