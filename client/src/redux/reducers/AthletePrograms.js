const initialState = {
  Programs: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "InitAP":
      return {
        Programs: [],
      };

    case "UPDATE_PROGRAMS_LIST":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
