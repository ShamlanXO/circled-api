import axios from "src/utils/axios";
import api from "src/utils/api";

import { store } from "../store";

export const hadleNewMessage = (data) => {
  if (
    window.location.pathname !== `/chat/dt/${data.SenderId}` &&
    window.location.pathname !== `/chat/dt/${data.SenderId}/`
  ) {
    store.dispatch({
      type: "UPDATE_FEED",
      payload: {
        loading: false,
        snackbar: true,
        message: `${data.name} send you a message`,
        severity: "info",
      },
    });
    store.dispatch({
      type: "ADD_CHAT",
      payload: { id: data.SenderId, data: data },
    });

    getChatCount();
  } else {
    store.dispatch({
      type: "ADD_CHAT",
      payload: { id: data.SenderId, data: data },
    });
    store.getState().Chat.scrollRef &&
      (store.getState().Chat.scrollRef.current.scrollTop =
        store.getState().Chat.scrollRef.current.scrollHeight + 500);
  }
};

export const createChat = (message, to) => {
  let uid = new Date().getTime();
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      //store.dispatch({ type:"UPDATE_FEED", payload: {loading:true}})
      dispatch({
        type: "ADD_CHAT",
        payload: {
          id: to,
          data: {
            _id: uid,
            ReceiverId: to,
            Message: message,
            SenderId: getState().Profile._id,
            createdAt: new Date(),
          },
        },
      });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.createMessage}`, {
          ReceiverId: to,
          Message: message,
        })
        .then((response) => {
          // store.dispatch({ type:"UPDATE_FEED", payload: {loading:false}})

          return res(response.data);
        })
        .catch((err) => {
          dispatch({ type: "REMOVE_CHAT", payload: { id: to, uid: uid } });
          store.dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Oops caught some error! Please try again",
              severity: "error",
            },
          });
          return reject("error");
        });
    });
  };
};

export const createAttachment = (data, to) => {
  return (dispatch, getState) => {
    dispatch({
      type: "ADD_CHAT",
      payload: {
        id: to,
        data: {
          ...data,
          _id: new Date().getTime(),
          ReceiverId: to,

          SenderId: getState().Profile._id,
        },
      },
    });
  };
};

export const AddChatData = (data, to) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      //store.dispatch({ type:"UPDATE_FEED", payload: {loading:true}})

      axios
        .post(`${api.protocol}${api.baseUrl}${api.createMessage}`, {
          ReceiverId: to,
          Message: data.Message,
          Images: data.Images ? data.Images : [],
          Video: data.Video ? data.Video : null,
          Audio: data.Audio ? data.Audio : null,
        })
        .then((response) => {
          dispatch({
            type: "UPDATE_CHAT",
            payload: {
              id: to,
              data: {
                ...data,
                UploadFile: null,
              },
            },
          });
          return res(response.data);
        })
        .catch((err) => {
          dispatch({ type: "REMOVE_CHAT", payload: { id: to, uid: data._id } });
          store.dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Oops caught some error! Please try again",
              severity: "error",
            },
          });
          return reject("error");
        });
    });
  };
};

export const RequestProgram = (data, to) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });

      axios
        .post(`${api.protocol}${api.baseUrl}${api.RequestProgram}`, {
          first: {
            ReceiverId: to,
            Message: data.Title,
            Images: [data.img],
            requestProgram: data._id,
          },
          second: {
            ReceiverId: to,
            Message: data.message,
          },
        })
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          return res(response.data);
        })
        .catch((err) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          return reject("error");
        });
    });
  };
};

export const updateChat = (data, to) => {
  return (dispatch, getState) => {
    dispatch({
      type: "UPDATE_CHAT",
      payload: {
        id: to,
        data: {
          ...data,
          _id: data._id,
        },
      },
    });
  };
};

export const getChatUsers = () => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      //store.dispatch({ type:"UPDATE_FEED", payload: {loading:true}})

      axios
        .get(`${api.protocol}${api.baseUrl}${api.getChatUsers}`)
        .then((response) => {
          dispatch({ type: "UPDATE_CHAT_USERS", payload: response.data });
          return res(response.data);
        })
        .catch((err) => {
          if (err.response.status !== 404)
            store.dispatch({
              type: "UPDATE_FEED",
              payload: {
                loading: false,
                snackbar: true,
                message: "Oops caught some error! Please try again",
                severity: "error",
              },
            });
          return reject("error");
        });
    });
  };
};

export const setUserChatDetails = (data) => {
  return (dispatch, getState) => {
    dispatch({ type: "SET_CHAT_CLIENT", payload: data });
  };
};

export const getChats = (id, limit = 50, skip = 0) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      //store.dispatch({ type:"UPDATE_FEED", payload: {loading:true}})
      let skip = getState().Chat.chatUsers[id]
        ? getState().Chat.chatUsers[id].messages.length
        : 0;
      axios
        .get(
          `${api.protocol}${api.baseUrl}${api.getChats}limit=${limit}&skip=${skip}&id=${id}`
        )
        .then((response) => {
          //dispatch({ type:"INIT_CHAT", payload: {id:id,data:response.data}})
          dispatch({
            type: "PUSH_CHAT",
            payload: { id: id, data: response.data },
          });
          return res(response.data);
        })
        .catch((err) => {
          if (err.response && err.response.status == 404) {
            return reject(404);
          }
          console.log(err);
          store.dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Oops caught some error! Please try again",
              severity: "error",
            },
          });
          return reject("error");
        });
    });
  };
};

export const getChatCount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getChatCount}`)
      .then((res) => {
        store.dispatch({ type: "UPDATE_CHAT_COUNT", payload: res.data.count });
        resolve(res.data.count);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateChatRead = (userId, id) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateChat}${id}`)
        .then((res) => {
          dispatch({ type: "MARK_READ", payload: { userId, id } });
          resolve(res.data.count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};
