const authReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.uid;
    case "LOGOUT":
      return {};
    default:
      return state;
  }
};

export default authReducer;
