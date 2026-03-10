const initialState = {
  snackbar: false,
  message: "",
  severity: "info", //success error info warning
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_FEED":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
