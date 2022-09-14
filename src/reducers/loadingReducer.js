const initialState = {
  isLoading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING_START":
      return { isLoading: true };
    case "LOADING_DONE":
      return { isLoading: false };
    default:
      return state;
  }
};

export default loadingReducer;
