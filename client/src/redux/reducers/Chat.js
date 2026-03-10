const initialState = {
  chatUsers: {},
  count: 0,
  recentChatUsers: [],
  scrollRef: null,
};

export default (state = initialState, action) => {
  let dataUsers = { ...state.chatUsers };
  switch (action.type) {
    case "INITIALIZE_CHAT":
      return {
        ...initialState,
      };

    case "UPDATE_CHAT_COUNT":
      return {
        ...state,
        count: action.payload,
      };

    case "MARK_READ":
      if (dataUsers[action.payload.userId]) {
        let indexToUpdate = dataUsers[action.payload.userId].messages.findIndex(
          (message) => message._id == action.payload.id
        );
        dataUsers[action.payload.userId].messages[indexToUpdate].IsRead = true;
      }
      let upcount = state.count - 1;
      return {
        ...state,
        chatUsers: dataUsers,
        count: upcount,
      };

    case "UPDATE_CHAT_USERS":
      action.payload.map((user) => {
        dataUsers[user._id] = {
          details: { ...user },
          InitialMessages: [{ ...user }],
          messages: [],
        };
      });

      return {
        ...state,
        chatUsers: dataUsers,
        recentChatUsers: action.payload,
      };

    case "INIT_CHAT":
      dataUsers[action.payload.id] = {
        details: dataUsers[action.payload.id].details
          ? dataUsers[action.payload.id].details
          : {},
        messages: [...action.payload.data],
      };
      return {
        ...state,
        chatUsers: dataUsers,
      };

    case "PUSH_CHAT":
      if (dataUsers[action.payload.id])
        dataUsers[action.payload.id] = {
          details: dataUsers[action.payload.id].details,
          messages: [
            ...action.payload.data.reverse(),
            ...dataUsers[action.payload.id].messages,
          ],
        };
      else
        dataUsers[action.payload.id] = {
          details: dataUsers[action.payload.id].details,
          messages: [...action.payload.data.reverse()],
        };

      return {
        ...state,
        chatUsers: dataUsers,
      };

    case "SET_CHAT_CLIENT":
      dataUsers[action.payload._id] = {
        details: { ...action.payload },
        messages: dataUsers[action.payload._id]
          ? dataUsers[action.payload._id].messages
          : [],
      };
      return {
        ...state,
        chatUsers: dataUsers,
      };

    case "ADD_CHAT":
      if (dataUsers[action.payload.id]) {
        dataUsers[action.payload.id] = {
          details: dataUsers[action.payload.id].details
            ? dataUsers[action.payload.id].details
            : {},
          messages: [
            ...dataUsers[action.payload.id].messages,
            action.payload.data,
          ],
        };
      } else
        dataUsers[action.payload.id] = {
          details: dataUsers[action.payload.id]
            ? dataUsers[action.payload.id].details
            : {},
          messages: [action.payload.data],
        };

      return {
        ...state,
        chatUsers: dataUsers,
      };

    case "REMOVE_CHAT":
      let ind = dataUsers[action.payload.id].messages.findIndex(
        (message) => message._id == action.payload.uid
      );
      dataUsers[action.payload.id].messages.splice(ind, 1);

      return {
        ...state,
        chatUsers: dataUsers,
      };

    case "UPDATE_CHAT":
      let indUC = dataUsers[action.payload.id].messages.findIndex(
        (message) => message._id == action.payload.data._id
      );
      dataUsers[action.payload.id].messages[indUC] = {
        ...dataUsers[action.payload.id].messages[indUC],
        ...action.payload.data,
      };

      return {
        ...state,
        chatUsers: dataUsers,
      };

    default:
      return state;
  }
};
