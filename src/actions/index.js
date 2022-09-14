import { TextareaAutosize } from "@mui/material";
import database from "../firebase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Alert from "@material-ui/lab/Alert";

/* Change names to "action" AKA getPostsAction */

export const getPostsAction = () => {
  return (dispatch) => {
    try {
      const result = [];
      dispatch(loadingStartAction());

      database.ref(`users`).once("value", (snapshot) => {
        snapshot.forEach((dataSnapshot) => {
          let { handle, posts, profilePic } = dataSnapshot.val();
          const key = dataSnapshot.key;

          if (posts) {
            const postKeys = Object.keys(posts);
            posts = Object.values(posts);

            posts = posts.map((post, index) => {
              let comments = [],
                likes = [];
              if (post.comments_text) {
                const commentKeys = Object.keys(post.comments_text);
                comments = Object.values(post.comments_text);

                comments = comments.map((comment, comment_Index) => {
                  return {
                    ...comment,
                    comment_like_click: false,
                    key: commentKeys[comment_Index],
                  };
                });
              }

              if (post.like) {
                const likeKeys = Object.keys(post.like);
                likes = Object.values(post.like);
                likes = likes.map((like, like_Index) => {
                  return {
                    ...like,
                    key: likeKeys[like_Index],
                  };
                });
              }

              return {
                ...post,
                comments_text: comments,
                like: likes,
                key: postKeys[index],
                post_like_click: false,
              };
            });
          }
          result.push({
            uid: key,
            handle,
            profilePic,
            posts,
          });
        });
        dispatch(setPostsAction(result));
        dispatch(setUsernameAction());
        dispatch(setProfilePicAction());
        dispatch(loadingEndAction());
      });
    } catch (error) {
      dispatch(loadingEndAction());
    }
  };
};

export const setUsernameAction = () => {
  return (dispatch, getState) => {
    const { userId, users } = getState();
    let username = "";
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === userId) {
        username = users[i].handle;
        break;
      }
    }
    if (username) {
      dispatch(usernameAction(username));
    }
  };
};

export const setProfilePicAction = () => {
  return (dispatch, getState) => {
    const { userId, users } = getState();
    let profilePic = "";
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === userId) {
        profilePic = users[i].profilePic;
        break;
      }
    }
    if (profilePic) {
      dispatch(makeProfilePictureAction(profilePic));
    }
  };
};

export const setPostsAction = (posts) => {
  return {
    type: "SET_POSTS",
    payload: posts,
  };
};

export const makePostAction = (postObject) => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    database
      .ref(`users/${uid}/posts`)
      .push(postObject)
      .then((response) => {
        dispatch(
          postAction({
            uid,
            key: response.key,
            handle: postObject.handle,
            ...postObject,
          })
        );
      });
  };
};

export const postAction = (post) => {
  return {
    type: "POST",
    payload: {
      uid: post.uid,
      handle: post.handle,
      profilePic: post.profilePic,
      post: {
        title: post.title,
        post_date: post.post_date,
        comment: false,
        comments_text: [],
        like: [],
        key: post.key,
      },
    },
  };
};

export const makeUploadImageAction = (postObject) => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    database
      .ref(`users/${uid}/posts`)
      .push(postObject)
      .then((response) => {
        dispatch(
          postUploadImageAction({
            uid,
            key: response.key,
            handle: postObject.handle,
            post_date: postObject.post_date,
            imageURL: postObject.imageURL,
            title: postObject.title,
            ...postObject,
          })
        );
      });
  };
};

export const postUploadImageAction = (post) => {
  const { uid, handle, imageURL, post_date, key, title } = post;

  return {
    type: "POST_IMAGE",
    payload: {
      uid,
      handle,
      post: {
        imageURL,
        post_date,
        comment: false,
        comments_text: [],
        like: [],
        key,
        title,
      },
    },
  };
};

export const makePostCommentAction = ({
  postUserId,
  postId,
  commenter_comment,
  commenter_handle,
  commenter_uid,
  comment_date,
  comment_notification,
  // profilePic,
}) => {
  return (dispatch, getState) => {
    database
      .ref(`users/${postUserId}/posts/${postId}/comments_text`)
      .push({
        postUserId,
        postId,
        commenter_comment,
        commenter_handle,
        commenter_uid,
        comment_date,
        comment_notification,
        // profilePic,
      })
      .then((ref) => {
        dispatch(
          postCommentAction({
            postUserId,
            postId,
            commenter_comment,
            commenter_handle,
            commenter_uid,
            comment_key: ref.key,
            comment_date,
            comment_notification,
            // profilePic,
          })
        );
      });

    // database.ref('posts').once('value', (snapshot) => {

    //     snapshot.map((dataSnapshot) => {
    //         if (dataSnapshot.key === postComment.key){
    //             snapshot.comments_text = postComment.comments_text
    //         }
    //     })
    //     dispatch(postComment(...postComment));
    // })
  };
};

export const postCommentAction = ({
  postUserId,
  postId,
  commenter_comment,
  commenter_handle,
  commenter_uid,
  comment_key,
  comment_date,
  comment_notification,
  // profilePic,
}) => {
  return {
    type: "ADD_POST_COMMENT",
    payload: {
      postUserId,
      postId,
      commenter_comment,
      commenter_handle,
      commenter_uid,
      comment_key,
      comment_date,
      comment_notification,
      // profilePic,
    },
  };
};

export const makeDeletePostAction = ({ uid, postUserId, postId }) => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    database
      .ref(`users/${uid}/posts/${postId}`)
      .remove()
      .then(() => {
        dispatch(deletePostAction({ uid, postUserId, postId }));
      });
  };
};

export const deletePostAction = ({ uid, postUserId, postId }) => {
  return {
    type: "DELETE",
    payload: { uid, postUserId, postId },
  };
};

export const makeLikePostAction = ({
  uid,
  postUserId,
  postId,
  userLikeHandle,
  like_notification,
}) => {
  return (dispatch, getState) => {
    const users = getState().users;
    const matchingUser = users.find((user) => user.uid === postUserId);
    const matchingPost =
      matchingUser.posts &&
      matchingUser.posts.find((post) => post.key === postId);
    // const isPostAlreadyLiked = matchingPost.like && Object.entries(matchingPost.like).includes(uid) ? true : false;
    let isPostAlreadyLiked;

    // const isPostAlreadyLikedCheck = matchingPost.like && Object.values(matchingPost.like).map((entry) => {
    //     if (entry.uid === uid){
    //         isPostAlreadyLiked === true
    //         break;
    //     }
    // })

    const isPostAlreadyLikedCheck =
      matchingPost.like && Object.values(matchingPost.like);
    if (isPostAlreadyLikedCheck) {
      for (let entry of isPostAlreadyLikedCheck) {
        if (entry.uid === uid) {
          isPostAlreadyLiked = true;
          break;
        }
      }
    }

    // let stuff = Object.values(matchingPost.like).map((entry) => {
    //     return entry.uid
    // })
    // let checker = stuff.includes(uid)

    if (isPostAlreadyLiked) {
      let unLikeKey;

      // const matchingLike = matchingPost.like.filter((item) => item.uid === uid);
      // unLikeKey = matchingLike.key;

      const entries = Object.values(matchingPost.like);

      entries.map((entryCheck) => {
        if (entryCheck.uid === uid) {
          unLikeKey = entryCheck.key;
        }
      });

      // for (let [key, value] of entries) {
      //     if (value.like === uid) {
      //         unLikeKey = key;
      //         break;
      //     }
      // }

      database
        .ref(`users/${postUserId}/posts/${postId}/like/${unLikeKey}`)
        .remove()
        .then(() => {
          dispatch(unlikePostAction({ postUserId, postId, unLikeKey }));
        });
    } else {
      database
        .ref(`users/${postUserId}/posts/${postId}/like`)
        .push({ uid, postUserId, postId, userLikeHandle, like_notification })
        .then((ref) => {
          dispatch(
            likePostAction({
              uid,
              postUserId,
              postId,
              key: ref.key,
              userLikeHandle,
              like_notification,
            })
          );
        });
    }
  };
};

export const likePostAction = ({
  uid,
  postUserId,
  postId,
  key,
  userLikeHandle,
  like_notification,
}) => {
  return {
    type: "LIKE",
    payload: {
      uid,
      postUserId,
      postId,
      key,
      userLikeHandle,
      like_notification,
    },
  };
};

export const unlikePostAction = ({ postUserId, postId, unLikeKey }) => {
  return {
    type: "UNLIKE",
    payload: { postUserId, postId, unLikeKey },
  };
};

export const makeLikeCommentAction = ({
  uid,
  postUserId,
  postId,
  commentId,
}) => {
  return (dispatch, getState) => {
    const users = getState().users;
    const matchingUser = users.find((user) => user.uid === postUserId);
    const matchingUserPostValues = Object.values(matchingUser.posts);
    // const comment = matchingUserPostValues.find(comment => comment.comments_text);

    // const matchingComment = matchingUserPostValues.forEach((post) => {
    //     const returnMatchingObject = matchingUserPostValues.comments_text.find(object => object.key === commentId)
    //     return returnMatchingObject
    // })

    const postToUpdate = matchingUserPostValues.find(
      (post) => post.key === postId
    )?.comments_text;

    let item;
    for (var key in postToUpdate) {
      // if (!postToUpdate.hasOwnProperty(key)) continue;
      var obj = postToUpdate[key];
      if (obj.key === commentId) {
        item = obj;
        break;
      }

      /*  if (Object.values(obj).indexOf(commentId) > -1){
                item = obj
            }

            if (item){
                break;
            }*/
    }

    // let item;
    // for (const post in postToUpdate) {
    //   if (post.comments_text) {
    //     item = Object.values(post.comments_text).find(
    //       (comment) => comment.key === commentId
    //     )
    //   };
    //   debugger
    //   if (item) {
    //     break;
    //   }
    // }

    const isCommentAlreadyLiked =
      item.hasOwnProperty("comment_like") &&
      Object.values(item.comment_like).includes(uid)
        ? true
        : false;

    if (isCommentAlreadyLiked) {
      let unLikeCommentKey;
      const entries = Object.entries(item.comment_like);
      for (let [key, value] of entries) {
        if (value === uid) {
          unLikeCommentKey = key;
          break;
        }
      }
      database
        .ref(
          `users/${postUserId}/posts/${postId}/comments_text/${commentId}/comment_like/${unLikeCommentKey}`
        )
        .remove()
        .then(() => {
          dispatch(
            unlikeCommentAction({
              uid,
              postUserId,
              postId,
              commentId,
              unLikeCommentKey,
            })
          );
        });
    } else {
      database
        .ref(
          `users/${postUserId}/posts/${postId}/comments_text/${commentId}/comment_like`
        )
        .push(uid)
        .then((ref) => {
          dispatch(
            likeCommentAction({
              uid,
              postUserId,
              postId,
              commentId,
              commentKey: ref.key,
            })
          );
        });
    }
  };
};

export const likeCommentAction = ({
  uid,
  postUserId,
  postId,
  commentId,
  commentKey,
}) => {
  return {
    type: "LIKE_COMMENT",
    payload: { uid, postUserId, postId, commentId, commentKey },
  };
};

export const unlikeCommentAction = ({
  uid,
  postUserId,
  postId,
  commentId,
  unLikeCommentKey,
}) => {
  return {
    type: "UNLIKE_COMMENT",
    payload: { uid, postUserId, postId, commentId, unLikeCommentKey },
  };
};

export const makeDeleteCommentAction = ({
  uid,
  postUserId,
  postId,
  commentId,
  commenter_uid,
}) => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    if (uid === commenter_uid) {
      database
        .ref(`users/${postUserId}/posts/${postId}/comments_text/${commentId}`)
        .remove()
        .then(() => {
          dispatch(deleteCommentAction({ uid, postUserId, postId, commentId }));
        });
    }
  };
};

export const deleteCommentAction = ({ uid, postUserId, postId, commentId }) => {
  return {
    type: "DELETE_COMMENT",
    payload: { uid, postUserId, postId, commentId },
  };
};

export const postButtonClicked = () => {
  return {
    type: "POST_CLICK",
  };
};

export const addComment = ({ uid, postUserId, postId }) => {
  return {
    type: "ADD_COMMENT",
    payload: { uid, postUserId, postId },
  };
};

export const makeUsername = (username) => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    database
      .ref(`users/${uid}/handle`)
      .set(username)
      .then((response) => {
        dispatch(usernameAction(username));
      });
  };
};

export const usernameAction = (username) => {
  return {
    type: "SET_USERNAME",
    username,
  };
};

export const loginAction = (uid) => {
  return {
    type: "LOGIN",
    uid,
  };
};

export const logoutAction = () => {
  return {
    type: "LOGOUT",
  };
};

export const loadingStartAction = () => {
  return {
    type: "LOADING_START",
  };
};

export const loadingEndAction = () => {
  return {
    type: "LOADING_DONE",
  };
};

export const notificationsClicked = () => {
  return {
    type: "NOTIFICATION_CLICK",
  };
};

export const closeNotificationsMenu = () => {
  return {
    type: "CLOSE_NOTIFICATIONS",
  };
};

export const makeNotificationsStateUpdateAction = ({ newNotifications }) => {
  return (dispatch, getState) => {
    newNotifications.map((notification) => {
      if (notification.hasOwnProperty("userLikeHandle")) {
        return database
          .ref(
            `users/${notification.postUserId}/posts/${notification.postId}/like/${notification.key}/`
          )
          .update({ like_notification: true })
          .then(() => {
            dispatch(notificationsStateUpdate_Like_Action({ notification }));
          });
      }
      if (notification.hasOwnProperty("commenter_handle")) {
        return database
          .ref(
            `users/${notification.postUserId}/posts/${notification.postId}/comments_text/${notification.key}/`
          )
          .update({ comment_notification: true })
          .then(() => {
            dispatch(notificationsStateUpdate_Comment_Action({ notification }));
          });
      }
    });
  };
};

export const notificationsStateUpdate_Like_Action = ({ notification }) => {
  const { key, like_notification, postId, postUserId, uid, userLikeHandle } =
    notification;

  return {
    type: "NOTIFICATION_LIKE",
    payload: {
      key,
      like_notification,
      postId,
      postUserId,
      uid,
      userLikeHandle,
    },
  };
};

export const notificationsStateUpdate_Comment_Action = ({ notification }) => {
  const {
    key,
    comment_notification,
    postId,
    postUserId,
    uid,
    commenter_handle,
  } = notification;

  return {
    type: "NOTIFICATION_COMMENT",
    payload: {
      key,
      comment_notification,
      postId,
      postUserId,
      uid,
      commenter_handle,
    },
  };
};

export const makeNewNotificationsAction = ({ newNotifications }) => {
  return {
    type: "NEW_NOTIFICATIONS",
    payload: newNotifications,
  };
};

// export const makeProfilePictureUpload = (imageURL) => {
//   return (dispatch, getState) => {
//     const uid = getState().userId;

//     database
//       .ref(`users/${uid}/profilePic`)
//       .set(imageURL)
//       .then(() => {
//         dispatch(makeProfilePictureAction(imageURL));
//       });
//   };
// };

export const makeProfilePictureUpload = (imageURL) => {
  return (dispatch, getState) => {
    dispatch(loadingStartAction());
    try {
      const uid = getState().userId;
      database.ref(`users`).once("value", (snapshot) => {
        snapshot.forEach((dataSnapshot) => {
          if (dataSnapshot.key === uid) {
            database
              .ref(`users/${uid}/profilePic`)
              .set(imageURL)
              .then(() => {
                dispatch(makeProfilePictureAction(imageURL));
                dispatch(getPostsAction());
              })
              .catch(() => {
                dispatch(loadingEndAction());
              });
          }
        });
      });
    } catch (error) {
    } finally {
      dispatch(loadingEndAction());
    }
  };
};

export const makeProfilePictureAction = (imageURL) => {
  return {
    type: "ADD_PROFILE_PIC",
    payload: imageURL,
  };
};

export const displayUsersWhoLikeComment = ({
  uid,
  postUserId,
  postId,
  commentId,
}) => {
  return {
    type: "DISPLAY_COMMENT_USER_LIKE",
    payload: { uid, postUserId, postId, commentId },
  };
};

export const displayUsersWhoLikePost = ({ uid, postUserId, postId }) => {
  return {
    type: "DISPLAY_POST_USER_LIKE",
    payload: { uid, postUserId, postId },
  };
};

export const makeDeleteProfile = () => {
  return (dispatch, getState) => {
    const uid = getState().userId;
    const users = getState().users;
    // const [error, setError] = useState("");
    // const history = useHistory();
    // const { logout } = useAuth();

    // async function handleLogout() {
    //   setError("");

    //   try {
    //     await logout();
    //     dispatch({
    //       type: "RESET_STATE",
    //     });
    //     history.pushState("/login");
    //   } catch {
    //     setError("Failed to delete profile and log out");
    //   }
    //

    users.map((user) => {
      let user_UID = user.uid;
      if (user.posts) {
        let postKey;
        let comments_text_key;
        let like_key;

        user.posts.map((post) => {
          postKey = post.key;
          if (post.comments_text) {
            post.comments_text.map((comment) => {
              if (comment.commenter_uid === uid) {
                comments_text_key = comment.key;
                database
                  .ref(
                    `users/${user_UID}/posts/${postKey}/comments_text/${comments_text_key}`
                  )
                  .remove();
              } else {
                comments_text_key = comment.key;
              }
              if (comment.comment_like) {
                let comment_like_key;
                for (let [key, value] of Object.entries(comment.comment_like)) {
                  if (value === uid) {
                    comment_like_key = key;
                    database
                      .ref(
                        `users/${user_UID}/posts/${postKey}/comments_text/${comments_text_key}/comment_like/${comment_like_key}`
                      )
                      .remove();
                    break;
                  }
                }
              }
            });
          }

          if (post.like) {
            post.like.map((like) => {
              if (like.uid === uid) {
                debugger;
                like_key = like.key;
                database
                  .ref(`users/${user_UID}/posts/${postKey}/like/${like_key}`)
                  .remove();
              }
            });
          }
        });
      } else {
        return false;
      }
    });
    database.ref(`users/${uid}`).remove();
    // handleLogout();
    // {
    //   error && (
    //     <Alert variant="outlined" severity="error">
    //       {error}
    //     </Alert>
    //   );
    // }
  };
};

export const photoButtonClicked = () => {
  return {
    type: "PHOTO_CLICK",
  };
};

export const profileClicked = () => {
  return {
    type: "PROFILE_CLICK",
  };
};

export const closeProfileMenu = () => {
  return {
    type: "CLOSE_PROFILE_MENU",
  };
};

export const updateProfilePic = () => {
  return {
    type: "PROFILE_PIC_UPDATE",
  };
};
