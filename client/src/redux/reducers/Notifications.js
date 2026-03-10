const initialState = {
  Notifications: [],
  lastNotifiaction: null,
  count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "RESET_NOTIFICATIONS":
      return {
        Notifications: [],
        lastNotifiaction: null,
        count: 0,
      };

    case "INIT_NOTIFICATION":
      return {
        ...state,
        Notifications: [...action.payload],
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        Notifications: [...state.Notifications, ...action.payload],
      };

    case "SET_COUNT_NOTIFICATION":
      return {
        ...state,
        count: action.payload,
      };

    case "MARK_AS_READ":
      return {
        ...state,
        Notifications: [...state.Notifications, ...action.payload],
      };

    default:
      return state;
  }
};
