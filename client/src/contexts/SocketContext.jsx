import { createContext, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import { io } from 'socket.io-client';
import { fetchNotification, fetchCount } from 'src/redux/actions/Notifications';
import notificationEvents from 'src/utils/notificationEvents';
import { getClientPrograms, getOrder } from 'src/redux/actions/clientExercise';
// ----------------------------------------------------------------------

const initialState = {
  socket: null,
  isConnected: false,
};

const SocketContext = createContext({
  ...initialState,
});

function SocketProvider({ children }) {
  const [state, setState] = useState({
    socket: null,
    isConnected: false,
  });
  const dispatch = useDispatch();
  const Profile = useSelector((s) => s.Profile);
  const AtheletePlan = useSelector((s) => s.AtheletePlan);
  useEffect(() => {
    if (Profile.token && state.isConnected == false) {
      const socket = io(`${api.protocol}${api.socketurl}`, {
        query: 'token=' + Profile._id,
      });

      socket.on('connect', (error) => {
        setState({ ...state, isConnected: true, socket: socket });
      });

      socket.on('disconnect', (error) => {
        setState({ ...state, isConnected: false });
        console.log('connection done', error);
      });

      socket.onAny((event) => {
        console.log(event);
        if (
          event == notificationEvents.UPDATE_PROGRAM ||
          event == notificationEvents.EDIT_DIET ||
          event == notificationEvents.UPDATE_TODO
        ) {
          if (AtheletePlan.currentPlan) dispatch(getOrder(AtheletePlan.currentPlan));
        }
        fetchNotification();
      });

      // socket.ony((event)=>{
      //  alert("all notification",event)
      //   fetchNotification()
      //   fetchCount()
      // })

      // socket.on(store.getState().Profile._id, (data) => {
      //     if (data.type == 'new-notification') {
      //         console.log("socket recived")
      //         store.dispatch(getClients())

      //         store.dispatch(getAllPrograms())
      //         fetchNotification(0, 30, data.data)
      //     }
      // })

      // socket.on(store.getState().Profile._id, (data) => {
      //     if (data.type == 'new-message') {
      //         hadleNewMessage(data.data)
      //     }
      // })

      // getChatCount()
      // store.dispatch({ type: 'ADD_SOCKET', payload: { socket } })
    }
    return () => {};
  }, []);

  return (
    <SocketContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext, SocketProvider };
