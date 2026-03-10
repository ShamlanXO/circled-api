import axios from "../../utils/axios";
import api from "../../utils/api";
export const updateProfile = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateUser}`, { ...data })
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          dispatch({ type: "UPDATE_PROFILE", payload: data });
          return res("success");
        })
        .catch((err) => {
          if (err.response && err.response !== 500) {
            dispatch({
              type: "UPDATE_FEED",
              payload: {
                loading: false,
                snackbar: true,
                message: "Oops caught some error! Please try again",
                severity: "error",
              },
            });
            return reject("error");
          }
        });
    });
  };
};

export const updateInfo = (data) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
  };
};

export const initProfile = (data) => {
  return (dispatch) => {
    dispatch({ type: "INIT_NEW_PROFILE", payload: data });
  };
};
