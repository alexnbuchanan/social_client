const profilePicReducer = (state = "", action) => {
  switch (action.type) {
    case "ADD_PROFILE_PIC":
      return action.payload;
    default:
      return state;
  }
};

export default profilePicReducer;
