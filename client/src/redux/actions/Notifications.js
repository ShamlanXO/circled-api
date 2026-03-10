import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { store } from '../store';
export const fetchCount = () => {
  return new Promise((res, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.GetUnreadCount}`)
      .then((response) => {
        store.dispatch({
          type: 'SET_COUNT_NOTIFICATION',
          payload: response.data.count,
        });
        res(response.data.count);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const fetchNotification = (skip = 0, limit = 30, data = null) => {
  return new Promise((res, reject) => {
    // let message=""
    //             if(data&&data.type=="sent-program")
    // message=`${data.name} sent you a new workout fitness program`
    // else
    // message=`You have a new notification`

    // store.dispatch({ type:"UPDATE_FEED", payload: {loading:false,snackbar:true,message:message,severity:"info"}
    // })

    axios
      .get(`${api.protocol}${api.baseUrl}${api.fetchNotification}skip=${skip}&limit=${limit}`)
      .then((response) => {
        store.dispatch({
          type: 'INIT_NOTIFICATION',
          payload: response.data.ServerResponse,
        });
        fetchCount();
        res(response.data.ServerResponse);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setVisible = (id, index) => {
  return new Promise((res, reject) => {
    axios
      .patch(`${api.protocol}${api.baseUrl}${api.updateNotification}${id}`, {
        IsRead: true,
      })
      .then((response) => {
        res(response.data.count);

        let nots = [...store.getState().Notifications.Notifications];
        nots[index].IsRead = true;

        store.dispatch({ type: 'INIT_NOTIFICATION', payload: nots });

        fetchCount();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
