const initialState = {
  socket: null,
  view: "v",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SOCKET":
      return {
        ...state,
        socket: action.payload.socket,
      };

    case "SET_E_VIEW":
      return {
        ...state,
        view: action.payload.view,
      };

    default:
      return state;
  }
};
