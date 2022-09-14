import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Button,
  CardContent,
  Typography,
  Grid,
  Container,
  Modal,
  Box,
} from "@material-ui/core";
import { MdThumbUp, MdComment, MdDelete } from "react-icons/md";
import {
  post,
  makeDeletePostAction,
  addComment,
  getPostsAction,
  makeLikePostAction,
  displayUsersWhoLikePost,
} from "../actions";
import MakeComment from "./MakeComment";
import Comments from "./Comments";
import Timestamp from "./Timestamp";
import PostUsersLike from "./PostUsersLike";
import ImageEnlarge from "./ImageEnlarge";
import { makeStyles } from "@material-ui/core/styles";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { FiThumbsUp, FiTrash2 } from "react-icons/fi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { BiComment } from "react-icons/bi";

import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PopupModal from "./PopupModal";
import CommentUsersLike from "./CommentUsersLike";

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
  inputForm: {
    padding: "8px 8px 8px 8px",
    borderRadius: "6px",
    backgroundColor: "#F3F3F3",
    border: "none",
    width: "98%",
  },
  thumbStyle: {
    cursor: "pointer",
    fontSize: "18px",
    color: "#757575",
  },
}));

export default function Post(props) {
  // const [postsData, setPostsData] = useState([]);
  const users = useSelector((state) => state.users);
  const uid = useSelector((state) => state.userId);
  const handle = useSelector((state) => state.username);
  const profilePic = useSelector((state) => state.profilePic);
  const dispatch = useDispatch();
  const classes = useStyles();

  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState("");

  const [postModalOpen, setPostModalOpen] = useState(false);
  const handleClose = () => setPostModalOpen(false);

  console.log("props", props);

  const submitPostDelete = (props) => {
    confirmAlert({
      message: "Are you sure you want to delete your post?",
      buttons: [
        {
          label: "Yes",
          onClick: () => dispatch(makeDeletePostAction(props)),
        },
        {
          label: "No",
        },
      ],
    });
  };

  // const likeCount = (props) => {
  //   let obj = posts.find(o => o.key === props);
  //   let likeSum = 0;
  //   for (var key in obj.like) {
  //     likeSum += obj.like[key]
  //   }
  //   return likeSum
  // };

  useEffect(() => {
    dispatch(getPostsAction());
  }, []);

  //   const find1 = {posts}
  // //   var arr1 = Object.values(posts[0].posts).map(function(e) {
  // //     return e.name
  // // })

  // useEffect(() => {
  //   if(posts && posts.length > 0) {
  //     setPostsData(Object.values(posts[0].posts).map(post => post.name));
  //   }
  // }, [])

  // function sortUsers(a, b) {
  //   return a.updated_date < b.updated_date
  //     ? 1
  //     : a.updated_date > b.updated_date
  //     ? -1
  //     : 0;
  // }

  const showPopupModal = (data, type) => {
    console.log("LOOOOOOK", { data });
    console.log("SEEEEEEEE", type);
    setModalData(data);
    setModalType(type);
    setPostModalOpen(true);
  };
  function sortPosts(a, b) {
    return a.post_date < b.post_date ? 1 : a.post_date > b.post_date ? -1 : 0;
  }

  console.log("postModalOpen", postModalOpen);

  // add uid and handle in each of the user post
  const orderedUsers =
    users &&
    users.map((user) => ({
      ...user,
      posts: user?.posts?.map((post) => {
        return {
          ...post,
          uid: user.uid,
          handle: user.handle,
          profilePic: user.profilePic,
        };
      }),
    }));

  // combine all users posts into a single array and sort
  const usersPosts = orderedUsers
    ? orderedUsers
        .map((user) => user?.posts)
        .flat(Infinity)
        .sort(sortPosts)
    : [];

  // const usersPosts = users ? users.map(user => user.posts).flat(Infinity) : [];

  /*const sortedUsers = users
    ? users.map((user) => users.posts.slice().sort(order))
    : [];*/

  const renderSwitch = (param) => {
    switch (param) {
      case "comments":
        return <CommentUsersLike commentLike={modalData} />;
        break;
      case "likes":
        return <PostUsersLike props={modalData} />;
      case "image":
        return <ImageEnlarge props={modalData} />;
        break;
      default:
        return "HI";
    }
  };

  const alreadyLikedCheck = (data) => {
    if (data) {
      let isPostAlreadyLiked;
      for (let entry of data) {
        if (entry.uid === uid) {
          isPostAlreadyLiked = true;
          return isPostAlreadyLiked;
        }
      }
    }
  };

  return (
    <div>
      {usersPosts &&
        usersPosts.map((postItem) => {
          console.log("ASDWEFWEFWE", postItem);
          if (postItem) {
            return (
              <Card key={postItem.key} style={{ marginTop: "20px" }}>
                <CardContent>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {postItem?.profilePic ? (
                      <img
                        src={postItem?.profilePic}
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
                        style={{ borderRadius: "8px" }}
                        alt="profile pic default"
                      />
                    )}
                    <h4
                      style={{
                        marginLeft: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {postItem.handle}
                    </h4>
                    <div
                      style={{
                        marginLeft: "10px",
                        fontSize: "12px",
                        color: "#757575",
                      }}
                    >
                      <Timestamp date={postItem?.post_date} />
                    </div>
                  </div>

                  <div
                    style={{
                      marginLeft: "60px",
                    }}
                  >
                    {postItem?.imageURL ? (
                      <img
                        src={postItem?.imageURL}
                        width="300px"
                        height="300px"
                        alt="post image"
                        style={{ marginBottom: "5px", objectFit: "cover" }}
                        onClick={() => {
                          showPopupModal(postItem.imageURL, "image");
                        }}
                      />
                    ) : null}
                    {postItem.title && (
                      <p className={classes.inputForm}>{postItem.title}</p>
                    )}
                    <div>
                      <Grid container>
                        <Grid item xs={1}>
                          {alreadyLikedCheck(postItem.like) ? (
                            <AiFillLike
                              className={classes.thumbStyle}
                              onClick={() => {
                                let post_notification =
                                  postItem.uid === uid ? null : false;
                                dispatch(
                                  makeLikePostAction({
                                    uid,
                                    postUserId: postItem.uid,
                                    postId: postItem?.key,
                                    userLikeHandle: handle,
                                    like_notification: post_notification,
                                  })
                                );
                              }}
                            />
                          ) : (
                            <AiOutlineLike
                              className={classes.thumbStyle}
                              onClick={() => {
                                let post_notification =
                                  postItem.uid === uid ? null : false;
                                dispatch(
                                  makeLikePostAction({
                                    uid,
                                    postUserId: postItem.uid,
                                    postId: postItem?.key,
                                    userLikeHandle: handle,
                                    like_notification: post_notification,
                                  })
                                );
                              }}
                            />
                          )}

                          {postItem.like &&
                            Object.keys(postItem.like).length > 0 && (
                              <button
                                style={{
                                  margin: "0 0 0 0",
                                  background: "none",
                                  color: "inherit",
                                  border: "none",
                                  outline: "inherit",
                                  verticalAlign: "top",
                                  cursor: "pointer",
                                  color: "#757575",
                                }}
                                onClick={() => {
                                  dispatch(
                                    displayUsersWhoLikePost({
                                      uid,
                                      postUserId: postItem.uid,
                                      postId: postItem?.key,
                                    })
                                  );
                                  //handleOpen();
                                  showPopupModal(postItem.like, "likes");
                                }}
                              >
                                {postItem.like &&
                                Object.keys(postItem.like).length > 0
                                  ? Object.keys(postItem.like).length
                                  : null}
                              </button>
                            )}
                        </Grid>

                        <PopupModal
                          postModalOpen={postModalOpen}
                          handleClose={handleClose}
                          modalType={modalType}
                          modalStyle={classes.modalStyle}
                        >
                          {renderSwitch(modalType)}
                        </PopupModal>

                        <Grid item xs={1}>
                          <BiComment
                            onClick={() =>
                              dispatch(
                                addComment({
                                  uid,
                                  postUserId: postItem.uid,
                                  postId: postItem?.key,
                                })
                              )
                            }
                            style={{
                              cursor: "pointer",
                              fontSize: "18px",
                              color: "#757575",
                            }}
                          />

                          <button
                            style={{
                              margin: "0 0 0 0",
                              background: "none",
                              color: "inherit",
                              border: "none",
                              outline: "inherit",
                              verticalAlign: "top",
                              cursor: "pointer",
                              color: "#757575",
                            }}
                          >
                            {postItem.comments_text &&
                            postItem.comments_text.length > 0
                              ? postItem.comments_text.length
                              : null}
                          </button>
                        </Grid>
                        <Grid item xs={1}>
                          {uid === postItem.uid ? (
                            <FiTrash2
                              onClick={() =>
                                submitPostDelete({
                                  uid,
                                  postUserId: postItem.uid,
                                  postId: postItem?.key,
                                })
                              }
                              style={{
                                cursor: "pointer",
                                fontSize: "17px",
                                margin: "0 0 0 0",
                                padding: "0 0 0 0",
                                verticalAlign: "top",
                                color: "#757575",
                              }}
                            />
                          ) : null}
                        </Grid>
                        <Grid item xs={9} />
                      </Grid>
                    </div>

                    {/* {postItem.post_like_click ? (
                      <PostUsersLike props={postItem.like} />
                    ) : null} */}
                  </div>
                  <Comments
                    post={postItem}
                    postId={postItem.key}
                    postUserId={postItem.uid}
                    uid={uid}
                    showPopupModal={showPopupModal}
                  />

                  {postItem.comment ? (
                    <MakeComment
                      postId={postItem.key}
                      postUserId={postItem.uid}
                      handle={handle}
                      uid={uid}
                      comment_notification={postItem.uid === uid ? null : false}
                      profilePic={profilePic}
                    />
                  ) : null}
                </CardContent>
              </Card>
            );
          }
        })}
    </div>
  );
}
