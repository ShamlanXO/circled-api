import axios from '../../utils/axios';
import api from '../../utils/api';
import { dispatch, store } from '../store';
export const addNewLog = (data) => {
  return new Promise((res, reject) => {
    axios
      .post(`${api.protocol}${api.baseUrl}${api.addNewLog}`, { ...data })
      .then((response) => {
        let state = store.getState();
        let profile = state.Profile;

        if (profile?.type == 'Athlete') {
          let AtheletePlan = state.AtheletePlan;
          AtheletePlan.Exercises.ExercisePlan.weeks[data.week].days[data.day].Exercise[data.exercise].latestLog = {
            ...response.data.latestLog,
          };
          store.dispatch({
            type: 'UPDATE_ATHLETE_PLAN',
            payload: AtheletePlan,
          });
        } else {
          let Program = state.NewProgram;
          Program.ExercisePlan.weeks[data.week].days[data.day].Exercise[data.exercise].latestLog = {
            ...response.data.latestLog,
          };
          setTimeout(() => {
            store.dispatch({
              type: 'UPDATE_PROGRAM_CLIENT',
              payload: Program,
            });
            store.dispatch({
              type: 'UPDATE_PROGRAM',
              payload: Program,
            });
          }, 1000);
        }

        return res(response.data.latestLog);
      })
      .catch((err) => {
        if (err.response && err.response !== 500) {
          return reject('error');
        }
      });
  });
};

export const fetchLogs = (data) => {
  return new Promise((res, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.fetchLogs}${data.id}/${data.week}/${data.day}/${data.exercise}`)
      .then((response) => {
        return res(response.data);
      })
      .catch((err) => {
        if (err.response && err.response !== 404) {
          return res([]);
        }
        if (err.response && err.response !== 500) {
          return reject('error');
        }
      });
  });
};

export const getAllLogs = (data) => {
  return new Promise((res, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getAllLogs}${data.id}`)
      .then((response) => {
        return res(response.data);
      })
      .catch((err) => {
        if (err.response && err.response !== 500) {
          return reject('error');
        }
      });
  });
};

export const deleteLog = (id) => {
  return new Promise((resolve, reject) => {
    //store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
    axios
      .delete(`${api.protocol}${api.baseUrl}progresslog/${id}`)
      .then((response) => {
        // store.dispatch({
        //     type: 'UPDATE_FEED',
        //     payload: {
        //         loading: false,
        //         snackbar: true,
        //         message: 'Log message deleted',
        //         severity: 'error',
        //     },
        // })
        // return resolve(id)
      })
      .catch((err) => {
        // store.dispatch({
        //     type: 'UPDATE_FEED',
        //     payload: {
        //         loading: false,
        //         snackbar: true,
        //         message: 'Unable to delete message',
        //         severity: 'error',
        //     },
        // })
        return reject('error');
      });
  });
};

export const newUpload = (data) => {
  let state = store.getState();
  let dataCurrent = [...state.ProgressLogs.logs];

  store.dispatch({
    type: 'UPDATE_PROGRESS_LOGS',
    payload: [...dataCurrent, data],
  });
};
export const addMediaToLog = (id, media) => {
  let state = store.getState();
  let dataCurrent = [...state.ProgressLogs.logs];
  let index = dataCurrent.findIndex((i) => i._id == id);
  dataCurrent[index] = { ...dataCurrent[index], media: [...dataCurrent[index].media, media] };
  store.dispatch({
    type: 'UPDATE_PROGRESS_LOGS',
    payload: dataCurrent,
  });
};

export const updateProgressLog = (id, data) => {
  let state = store.getState();
  let dataCurrent = [...state.ProgressLogs.logs];
  dataCurrent[dataCurrent.findIndex((i) => i._id === id)] = data;
  store.dispatch({
    type: 'UPDATE_PROGRESS_LOGS',
    payload: dataCurrent,
  });
};

export const deleteProgressLog = (id) => {
  let state = store.getState();
  let dataCurrent = [...state.ProgressLogs.logs];
  store.dispatch({
    type: 'UPDATE_PROGRESS_LOGS',
    payload: dataCurrent.filter((i) => i._id != id),
  });
};
