import axios from 'src/utils/axios';
import api from 'src/utils/api';

export const updateLibrary = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateObjects}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res('success');
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
            dispatch({
              type: 'UPDATE_FEED',
              payload: {
                loading: false,
                snackbar: true,
                message: 'Oops caught some error! Please try again',
                severity: 'error',
              },
            });
            return reject('error');
          }
        });
    });
  };
};

export const createObject = (data) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .post(`${api.protocol}${api.baseUrl}${api.createObject}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_LIBRARY',
            payload: {
              children: [...getState().Library.children, response.data.item],
            },
          });
          return res('success');
        })
        .catch((err) => {
          if (err.response && err.response !== 500) {
            dispatch({
              type: 'UPDATE_FEED',
              payload: {
                loading: false,
                snackbar: true,
                message: 'Oops caught some error! Please try again',
                severity: 'error',
              },
            });
            return reject('error');
          }
        });
    });
  };
};

export const fetchLibrary = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      //dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getObjects}${data ? data : ''}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data.parent)
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: {
                children: response.data.items,
                parent: response.data.parent,
                ancestors: [...response.data.parent.ancestors, response.data.parent.parent],
              },
            });
          else
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: {
                children: response.data.items,
                ancestors: [],
                parent: {},
              },
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (err.response.status == 404) {
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: { children: [] },
            });

            return reject('error');
          }
        });
    });
  };
};

export const fetchRecent = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getRecent}${data ? data : ''}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data.parent)
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: {
                children: response.data.items,
                parent: response.data.parent,
                ancestors: [...response.data.parent.ancestors, response.data.parent.parent],
              },
            });
          else
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: {
                children: response.data.items,
                ancestors: [],
                parent: {},
              },
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (err.response.status == 404) {
            dispatch({
              type: 'UPDATE_LIBRARY',
              payload: {
                children: [],
                ancestors: [],
                parent: {},
              },
            });

            return reject('error');
          }
        });
    });
  };
};

export const deleteObject = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.deleteObject}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          dispatch({ type: 'DELETE_ITEM', payload: data });
          return res('success');
        })
        .catch((err) => {
          if (err.response && err.response !== 500) {
            dispatch({
              type: 'UPDATE_FEED',
              payload: {
                loading: false,
                snackbar: true,
                message: 'Oops caught some error! Please try again',
                severity: 'error',
              },
            });
            return reject('error');
          }
        });
    });
  };
};

export const fetchVideoLibrary = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      // dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .get(`${api.protocol}${api.baseUrl}${api.fetchVideoLibrary}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data)
            dispatch({
              type: 'UPDATE_VIDEO_LIBRARY',
              payload: response.data,
            });
          else return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const fetchPublicLibrary = () => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      // dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .get(`${api.protocol}${api.baseUrl}${api.fetchPublicLibrary}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data)
            dispatch({
              type: 'UPDATE_VIDEO_PUBLIC',
              payload: response.data,
            });
          else return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const updateVideo = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .put(`${api.protocol}${api.baseUrl}${api.updateLibraryVideo}`, data)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          if (response.data)
            dispatch({
              type: 'UPDATE_VIDEO',
              payload: data,
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const addVideo = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.addLibraryVideo}`, data)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data)
            dispatch({
              type: 'ADD_VIDEO',
              payload: response.data,
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const addWorkout = (data, Title = '', silent = false) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      if (!silent) dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.addLibraryWorkout}`, {
          Program: Title,
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          if (response.data)
            dispatch({
              type: 'ADD_WORKOUT',
              payload: response.data,
            });

          return res(response.data);
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const updateWorkout = (data, Title = '', silent = false) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      if (!silent) dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.updateLibraryWorkout}`, {
          Program: Title,
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          if (response.data)
            dispatch({
              type: 'ADD_WORKOUT',
              payload: data,
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const deleteVideo = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .put(`${api.protocol}${api.baseUrl}${api.updateLibraryVideo}`, data)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              severity: 'error',
              message: 'Video deleted',
            },
          });

          dispatch({
            type: 'DELETE_VIDEO',
            payload: data._id,
          });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const saveVideoToLib = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.saveVideoToLib}`, data)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          if (response.data)
            dispatch({
              type: 'ADD_VIDEO',
              payload: response.data,
            });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const deleteworkout = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .delete(`${api.protocol}${api.baseUrl}${api.deleteLibraryWorkout}${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              severity: 'error',
              message: 'Workout deleted',
            },
          });

          dispatch({
            type: 'DELETE_WORKOUT',
            payload: id,
          });
          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const fetchWorkoutLibrary = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      //     dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getLibraryWorkouts}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          if (response.data)
            dispatch({
              type: 'UPDATE_WORKOUT_LIBRARY',
              payload: response.data,
            });
          else return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
        });
    });
  };
};

export const fetchWorkout = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getLibraryWorkout}/${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res(response.data);
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          reject(err);
        });
    });
  };
};
