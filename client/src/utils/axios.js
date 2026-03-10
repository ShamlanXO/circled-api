import axios from "axios";
import { store } from "../redux/store";

// Next we make an 'instance' of it

const instance = axios.create({
  // .. where we make our configurations
  // baseURL: "",
 
});

// Read the token fresh on every request so login/logout is always reflected
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

// Also add/ configure interceptors && all the other cool stuff
const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};

const errorHandler = (error) => {
  if (isHandlerEnabled(error.config)) {
    // Handle errors

    store.dispatch({
      type: "UPDATE_FEED",
      payload: {
        loading: false,
        snackbar: true,
        message: "Oops caught some error! Please try again",
        severity: "error",
      },
    });
  }
  return Promise.reject({ ...error });
};

const errorHandlerResponse = (error) => {
  if (isHandlerEnabled(error.config)) {
    if (!error.response || !error.response.status) {
      store.dispatch({
        type: "UPDATE_FEED",
        payload: {
          loading: false,
          snackbar: true,
          message: "Network error,Please try again",
          severity: "error",
        },
      });
      error.response = { status: "network" };
    }

    // Handle errors
    if (error.response.status == 401) {
      store.dispatch({
        type: "UPDATE_FEED",
        payload: {
          loading: false,
          snackbar: true,
          message: "Please login to continue",
          severity: "info",
        },
      });
      localStorage.removeItem("token");
      store.dispatch({ type: "LOG_OUT" });
      // B-09 fix: use window.location.href for a full redirect so React Router re-initialises
      // This avoids the stale-page bug caused by window.history.pushState skipping React Router
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }

    if (error.response.status == 500) {
      store.dispatch({
        type: "UPDATE_FEED",
        payload: {
          loading: false,
          snackbar: true,
          message: "Server error,Please try again",
          severity: "error",
        },
      });
    }
  }
  return Promise.reject({ ...error });
};

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response;
};

instance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandlerResponse(error)
);

export default instance;
