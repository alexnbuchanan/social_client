const profileClickedReducer = (state = false, action) => {
  switch (action.type) {
    case "PROFILE_CLICK":
      return !state;
    case "CLOSE_PROFILE_MENU":
      return false;

    default:
      return state;
  }
};

export default profileClickedReducer;
