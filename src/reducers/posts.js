import {
  ADD_POST_COMMENT,
  ADD_COMMENT,
  LIKE,
  DELETE,
  POST,
  UNLIKE,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  DELETE_COMMENT,
  POST_IMAGE,
  NOTIFICATION_LIKE,
  NOTIFICATION_COMMENT,
  DISPLAY_COMMENT_USER_LIKE,
  DISPLAY_POST_USER_LIKE,
} from "../utils/constants";

const postsReducer = (state = [], action) => {
  switch (action.type) {
    case POST: {
      const { uid, handle, post } = action.payload;
      if (state.length === 0) {
        return [
          {
            uid,
            handle,
            updated_date: post.post_date,
            posts: [post],
          },
        ];
      } else {
        return state.map((user) => {
          if (user.uid === uid) {
            return {
              ...user,
              handle,
              updated_date: post.post_date,
              posts: user.posts ? [post, ...user.posts] : [post], // check If user does not have any of their own post
            };
          } else {
            return user;
          }
        });
      }
    }

    case POST_IMAGE: {
      const { uid, handle, post } = action.payload;
      if (state.length === 0) {
        return [
          {
            uid,
            handle,
            posts: [post],
          },
        ];
      } else {
        return state.map((user) => {
          if (user.uid === uid) {
            return {
              ...user,
              handle,
              posts: user.posts ? [...user.posts, post] : [post], // check If user does not have any of his own post
            };
          } else {
            return user;
          }
        });
      }
    }

    case DELETE: {
      const { uid, postUserId, postId } = action.payload;

      return state.map((user) => {
        if (uid === user.uid) {
          return {
            ...user,
            posts: user.posts
              ? user.posts.filter((post) => {
                  return post.key != postId;
                })
              : null,
          };
        } else {
          return user;
        }
      });
    }

    case LIKE: {
      const {
        uid,
        postUserId,
        postId,
        key,
        userLikeHandle,
        like_notification,
      } = action.payload;
      /* userId === user Id, postId === post Id, clickId === user Id of the click */

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                // const total_likes = post.like
                //   ? Object.keys(post.like).length
                //   : 0;
                debugger;
                return {
                  ...post,
                  like: [
                    ...post.like,
                    {
                      userLikeHandle,
                      postId,
                      postUserId,
                      uid,
                      like_notification,
                      key,
                      post_like_click: false,
                    },
                  ],

                  /* post.like
                    ? {
                        ...post.like,
                        [total_likes]: {
                          userLikeHandle,
                          postId,
                          postUserId,
                          uid,
                          like_notification,
                          key,
                          post_like_click: false,
                        },
                      }
                    : {
                        [total_likes]: {
                          userLikeHandle,
                          postId,
                          postUserId,
                          uid,
                          like_notification,
                          key,
                          post_like_click: false,
                        },
                      },*/
                };
              } else {
                return post;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    case UNLIKE: {
      const { postUserId, postId, unLikeKey } = action.payload;
      /* userId === user Id, postId === post Id, clickId === user Id of the click */

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              debugger;
              if (post.key === postId) {
                let likePosts = post.like;
                if (likePosts) {
                  let keyToRemove;
                  for (let [key, value] of Object.entries(likePosts)) {
                    debugger;
                    if (value.key === unLikeKey) {
                      keyToRemove = likePosts.indexOf(value);
                    }
                  }
                  const totalLikes = Object.keys(likePosts).length;
                  if (totalLikes === 1) {
                    delete likePosts[keyToRemove];
                    likePosts = [];
                  } else {
                    likePosts.splice(keyToRemove, 1);
                  }

                  return {
                    ...post,
                    like: likePosts,
                  };
                } else {
                  return post;
                }
              } else {
                return post;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }
    case ADD_COMMENT: {
      const { uid, postUserId, postId } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((postComment) => {
              if (postComment.key === postId) {
                return {
                  ...postComment,
                  comment: !postComment.comment,
                };
              } else {
                return postComment;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    // case HOLD_COMMENT_POST:
    //   console.log("CHECKING", action, state);
    //   return state.map((x) => {
    //      if (x.key === action.payload.id){
    //        console.log('MATCHED', x.key, action.payload.id);
    //       return {
    //         ...x, comments_text: [
    //           ...x.comments_text,
    //           action.payload.comments_text
    //         ]
    //       }
    //     } else {
    //         return x
    //       }
    //   });

    case ADD_POST_COMMENT: {
      const {
        postUserId,
        postId,
        commenter_comment,
        commenter_handle,
        commenter_uid,
        comment_key,
        comment_date,
        comment_notification,
        // profilePic,
      } = action.payload;
      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                // const total_comments = post.comments_text
                //   ? Object.keys(post.comments_text).length
                //   : 0;
                return {
                  ...post,
                  comments_text: [
                    ...post.comments_text,
                    {
                      commenter_comment: commenter_comment,
                      commenter_handle: commenter_handle,
                      commenter_uid: commenter_uid,
                      key: comment_key,
                      comment_date: comment_date,
                      comment_notification: comment_notification,
                      comment_like_click: false,
                    },
                  ],

                  // post.comments_text
                  //   ? {
                  //       ...post.comments_text,
                  //       [total_comments]: {
                  //         commenter_comment: commenter_comment,
                  //         commenter_handle: commenter_handle,
                  //         commenter_uid: commenter_uid,
                  //         key: comment_key,
                  //         comment_date: comment_date,
                  //         comment_notification: comment_notification,
                  //         comment_like_click: false,
                  //       },
                  //     }
                  //   : {
                  //       [total_comments]: {
                  //         commenter_comment: commenter_comment,
                  //         commenter_handle: commenter_handle,
                  //         commenter_uid: commenter_uid,
                  //         key: comment_key,
                  //         comment_date: comment_date,
                  //         comment_notification: comment_notification,
                  //         comment_like_click: false,
                  //       },
                  //     },
                };
              } else {
                return post;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    case LIKE_COMMENT: {
      const { uid, postUserId, postId, commentId, commentKey } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                for (let [key, value] of Object.entries(post.comments_text)) {
                  if (value.key === commentId) {
                    //  if (Object.values(value).includes(commentId)) {
                    post.comments_text[key] = {
                      ...post.comments_text[key],
                      comment_like: value.comment_like
                        ? { ...value.comment_like, [commentKey]: uid }
                        : {
                            [commentKey]: uid,
                          },
                    };
                  }
                }

                return { ...post, comments_text: post.comments_text };
              } else return { ...post };
            }),
          };
        } else {
          return user;
        }
      });
    }

    case UNLIKE_COMMENT: {
      const { uid, postUserId, postId, commentId, unLikeCommentKey } =
        action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                for (let [key, value] of Object.entries(post.comments_text)) {
                  if (value.key === commentId) {
                    // if (Object.values(value).includes(commentId)) {

                    const likeComments = post.comments_text[key].comment_like;
                    const likeComments_updated =
                      delete likeComments[unLikeCommentKey];

                    post.comments_text[key] = {
                      ...post.comments_text[key],
                      comment_like: likeComments,
                    };
                  }
                }

                return { ...post };
              } else return { ...post };
            }),
          };
        } else {
          return user;
        }
      });
    }

    case DELETE_COMMENT: {
      const { uid, postUserId, postId, commentId } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                let deleteCommentKey;

                const commentEntries = Object.entries(post.comments_text);

                for (let [key, value] of commentEntries) {
                  if (value.commenter_uid === uid && value.key === commentId) {
                    deleteCommentKey = key;

                    const commentDelete = [...post.comments_text];
                    // delete commentDelete[deleteCommentKey];
                    commentDelete.splice(deleteCommentKey, 1);

                    post.comments_text = commentDelete;
                  }
                }

                return { ...post };
              } else return { ...post };
            }),
          };
        } else {
          return user;
        }
      });
    }

    case NOTIFICATION_LIKE: {
      const {
        key,
        like_notification,
        postId,
        postUserId,
        uid,
        userLikeHandle,
      } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                return {
                  ...post,
                  like: post.like.map((entry) => {
                    if (entry.key === key) {
                      return {
                        ...entry,
                        like_notification: true,
                      };
                    } else {
                      return entry;
                    }
                  }),
                };
              } else {
                return post;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    case NOTIFICATION_COMMENT: {
      const {
        key,
        comment_notification,
        postId,
        postUserId,
        uid,
        commenter_handle,
      } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                return {
                  ...post,
                  comments_text: post.comments_text.map((entry) => {
                    if (entry.key === key) {
                      return {
                        ...entry,
                        comment_notification: true,
                      };
                    } else {
                      return entry;
                    }
                  }),
                };
              } else {
                return post;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    // case ADD_PROFILE_PIC: {
    //   const { imageURL } = action.payload;

    //   return state.map((user) => {
    //     debugger;
    //     return { ...user, profilePic: imageURL };
    //   });

    //   // return state.map((user) => {
    //   //   if (uid === user.uid) {
    //   //     return {
    //   //       ...user,
    //   //       profilePic: imageURL
    //   //     };
    //   //   } else {
    //   //     return user;
    //   //   }
    //   // });
    // }

    case DISPLAY_COMMENT_USER_LIKE: {
      const { uid, postUserId, postId, commentId } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((post) => {
              if (post.key === postId) {
                for (let [key, value] of Object.entries(post.comments_text)) {
                  if (value.key === commentId) {
                    //  if (Object.values(value).includes(commentId)) {
                    let comment_like_click_ref =
                      post.comments_text[key].comment_like_click;
                    post.comments_text[key] = {
                      ...post.comments_text[key],
                      comment_like_click: !comment_like_click_ref,
                    };
                  }
                }

                return { ...post, comments_text: post.comments_text };
              } else return { ...post };
            }),
          };
        } else {
          return user;
        }
      });
    }

    case DISPLAY_POST_USER_LIKE: {
      const { uid, postUserId, postId } = action.payload;

      return state.map((user) => {
        if (user.uid === postUserId) {
          return {
            ...user,
            posts: user.posts.map((postComment) => {
              if (postComment.key === postId) {
                let post_like_click_ref = postComment.post_like_click;
                return {
                  ...postComment,
                  post_like_click: !post_like_click_ref,
                };
              } else {
                return postComment;
              }
            }),
          };
        } else {
          return user;
        }
      });
    }

    case "SET_POSTS":
      // console.log('reducer', action.payload);
      return action.payload; /* Anything returned will become state */
    default:
      return state;
  }
};

export default postsReducer;
