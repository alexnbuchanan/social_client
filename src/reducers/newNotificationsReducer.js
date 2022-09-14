const newNotifications = (state = {}, action) => {
  switch (action.type) {
    case "NEW_NOTIFICATIONS":
      return action.payload;
    default:
      return state;
  }
};

export default newNotifications;
