const profilePicUpdateReducer = (state = false, action) => {
  switch (action.type) {
    case "PROFILE_PIC_UPDATE":
      return !state;
    default:
      return state;
  }
};

export default profilePicUpdateReducer;
