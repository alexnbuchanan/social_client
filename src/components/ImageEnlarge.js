import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineLike } from "react-icons/ai";

export default function PostUsersLike({ props }) {
  return (
    <div>
      <img src={props} width="100%" />
    </div>
  );
}
