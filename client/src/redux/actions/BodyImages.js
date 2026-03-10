import axios from "src/utils/axios";
import api from "src/utils/api";
import socketIOClient from "socket.io-client";
import { store } from "../store";
import { fetchNotification } from "./Notifications";
import { hadleNewMessage, getChatCount } from "./chat";



export const getBodyImages = () => {
  return new Promise((res, reject) => {
    store.dispatch({ type: "UPDATE_FEED", payload: { loading: true } });

    axios
      .get(`${api.protocol}${api.baseUrl}${api.getBodyImages}`)
      .then((response) => {
        store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
        store.dispatch({ type: "SET_IMAGES", payload: { images: response.data.items } });
        return res(response.data.items);
      })
      .catch((err) => {
        store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
        return reject("error");
      });
  });
};

export const createBodyImages = (bodyImage) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
    
        axios
        .post(`${api.protocol}${api.baseUrl}${api.createBodyImages}`, bodyImage)
        .then((response) => {
            store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
            store.dispatch({ type: "SET_IMAGES", payload: { images: [...store.getState().BodyImages.images,response.data.item] } });
            return res(response.data.item);
        })
        .catch((err) => {
            store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
            return reject("error");
        });
    });
}

export const updateBodyImages = (data) => {
    return new Promise((res, reject) => {
      store.dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
  
      axios
        .post(`${api.protocol}${api.baseUrl}${api.updateBodyImages}`,{...data})
        .then((response) => {
          store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          store.dispatch({ type: "UPDATE_IMAGE", payload: { ...data } });
          return res(response.data);
        })
        .catch((err) => {
          store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          return reject("error");
        });
    });
  };

  export const deleteBodyImages = (id) => {
    return new Promise((res, reject) => {
      store.dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
  
      axios
        .post(`${api.protocol}${api.baseUrl}${api.deleteBodyImages}`,{_id:id})
        .then((response) => {
          store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          store.dispatch({ type: "DELETE_IMAGES", payload: { _id:id} });
          return res(response.data.items);
        })
        .catch((err) => {
          store.dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          return reject("error");
        });
    });
  };
