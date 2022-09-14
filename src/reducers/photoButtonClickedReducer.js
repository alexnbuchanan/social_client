const photoButtonClickedReducer = (state = false, action) => {
  switch (action.type) {
    case "PHOTO_CLICK":
      return !state;
    default:
      return state;
  }
};

export default photoButtonClickedReducer;
