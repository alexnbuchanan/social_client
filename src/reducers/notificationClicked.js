const notificationClicked = (state = false, action) => {
  switch (action.type) {
    case "NOTIFICATION_CLICK":
      return !state;
    case "CLOSE_NOTIFICATIONS":
      return false;
    default:
      return state;
  }
};

export default notificationClicked;
