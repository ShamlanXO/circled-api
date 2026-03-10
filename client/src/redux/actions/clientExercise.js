import axios from 'src/utils/axios';
import api from 'src/utils/api';

export const getClientPrograms = () => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .get(`${api.protocol}${api.baseUrl}${api.allOrder}`)
        .then((response) => {
          let allPrograms = response.data.Programs.map((item) => {
            return { ...item.Program, ...item };
          });

          let activeProg = allPrograms.find((act) => act.isActive == true);

          if (activeProg) {
            dispatch({
              type: 'UPDATE_FEED',
              payload: { loading: true },
            });
            axios
              .patch(`${api.protocol}${api.baseUrl}${api.switchProgram}`, {
                _id: activeProg._id,
                isActive: activeProg.isActive,
              })
              .then((response) => {
                dispatch({
                  type: 'UPDATE_FEED',
                  payload: { loading: false },
                });

                let data = response.data.data;

                if (activeProg.isActive) {
                  dispatch({
                    type: 'UPDATE_ATHLETE_PLAN',
                    payload: {
                      Instructor: {
                        ...data.Program.createdBy,
                      },
                      DietPlan: {
                        ...data.Program.DietPlan,
                      },
                      Exercises: { ...data.Program },
                      todo: data.todo,
                      currentPlan: data._id,
                      stats: data.stats,
                      currentWeek: data.currentWeek,
                      currentDay: data.currentDay,
                    },
                  });
                } else {
                  dispatch({
                    type: 'UPDATE_ATHLETE_PLAN',
                    payload: {
                      DietPlan: {},
                      Instructor: {},
                      currentPlan: null,
                      stats: {},
                      todo: [],
                      Exercises: { _id: null },
                    },
                  });
                }

                return res('success');
              })
              .catch((err) => {
                console.log(err);
                dispatch({
                  type: 'UPDATE_FEED',
                  payload: { loading: false },
                });
                return reject('error');
              });
          }

          // let activeProgram=response.data.Programs.findIndex(item=>{return item.isActive})

          dispatch({
            type: 'UPDATE_ATHLETE_PLAN',
            payload: { AllPrograms: allPrograms },
          });

          return res('success');
        })
        .catch((err) => {
          if (err.response && err.response.status == 404) {
            dispatch({
              type: 'UPDATE_ATHLETE_PLAN',
              payload: {
                AllPrograms: [],
                DietPlan: {},
                Exercises: {},
              },
            });
          }
          console.log(err);
          return reject('error');
        });
    });
  };
};

export const updateTodo = (id, todo) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateTodo}`, {
          _id: id,
          todo: todo,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_ATHLETE_PLAN',
            payload: {
              todo: todo,
            },
          });

          return res(response.data);
        })
        .catch((err) => {
          if (err.response.status == 404)
            dispatch({
              type: 'UPDATE_ATHLETE_PLAN',
              payload: {},
            });
          console.log(err);
          return reject('error');
        });
    });
  };
};

export const getOrder = (id) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getOrder}${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_ATHLETE_PLAN',
            payload: {
              Instructor: {
                ...response.data.Program.Program.createdBy,
              },
              DietPlan: {
                ...response.data.Program.Program.DietPlan,
              },
              todo: response.data.Program.todo,
              Exercises: {
                ...response.data.Program.Program,
                orderId: response.data._id,
              },
              stats: response.data.Program.stats,
              currentWeek: response.data.Program.currentWeek,
              currentDay: response.data.Program.currentDay,
            },
          });

          return res(response.data);
        })
        .catch((err) => {
          if (err.response.status == 404)
            dispatch({
              type: 'UPDATE_ATHLETE_PLAN',
              payload: { DietPlan: {}, Exercises: {} },
            });
          console.log(err);
          return reject('error');
        });
    });
  };
};

export const switchExercise = (exercise) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.switchProgram}`, {
          _id: exercise._id,
          isActive: exercise.isActive,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          let data = response.data.data;

          if (exercise.isActive) {
            dispatch({
              type: 'UPDATE_ATHLETE_PLAN',
              payload: {
                Instructor: { ...data.Program.createdBy },
                DietPlan: { ...data.Program.DietPlan },
                todo: data.todo,
                Exercises: { ...data.Program },
                currentPlan: data._id,
                stats: data.stats,
                currentWeek: data.currentWeek,
                currentDay: data.currentDay,
              },
            });
          } else {
            dispatch({
              type: 'UPDATE_ATHLETE_PLAN',
              payload: {
                DietPlan: {},
                Instructor: {},
                currentPlan: null,
                stats: {},
                Exercises: { _id: null },
              },
            });
          }

          return res('success');
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          return reject('error');
        });
    });
  };
};

export const saveProgram = (data) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      if(!data.silent)
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateOrder}`, {
          Program: {
            ...getState().ProgramList.clientData.Program,
            ...data,
          },
          _id: getState().ProgramList.clientData._id,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          console.log(err);
          return reject('error');
        });
    });
  };
};
export const saveTodo = (data) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateOrder}`, {
          todo: data.todo,
          _id: getState().ProgramList.clientData._id,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          console.log(err);
          return reject('error');
        });
    });
  };
};

export const updateStatus = (data) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateStatus}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_ATHLETE_PLAN',
            payload: {
              stats: data.stats,
              currentDay: data.currentDay,
              currentWeek: data.currentWeek,
            },
          });

          return res('success');
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          console.log(err);
          return reject('error');
        });
    });
  };
};

export const getClients = () => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getAllClients}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_INSTRUCTOR_CLIENTS',
            payload: { clients: response.data },
          });

          return res(response.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status == 404) {
            dispatch({
              type: 'UPDATE_INSTRUCTOR_CLIENTS',
              payload: { clients: [] },
            });
            return reject(err.response.status);
          } else return reject('error');
        });
    });
  };
};

export const getAllClients = () => {
  return new Promise((res, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getAllClients}`)
      .then((response) => {
        return res(response.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 404) {
          return reject(err.response.status);
        } else return reject('error');
      });
  });
};

export const getClientsSpecific = (id) => {
  return (dispatch, getState) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getSpecificClient}${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });
          dispatch({
            type: 'UPDATE_CLIENT_DATA',
            payload: {
              sentProgram: response.data.sentProgram,
              clientData: response.data.clientData,
              clientDetails: response.data.clientDetails,
            },
          });
          dispatch({
            type: 'SET_IMAGES',
            payload: { images: response.data.bodyImages },
          });

          return res(response.data.clientData);
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return reject('error');
        });
    });
  };
};

export const getClientsSpecificProgram = (id) => {
  return new Promise((res, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getSpecificProgramClient}${id}`)
      .then((response) => {
        return res(response.data.clients);
      })
      .catch((err) => {
        return reject('error');
      });
  });
};

export const updateProgram = (data) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_PROGRAM_CLIENT', payload: data });
  };
};
