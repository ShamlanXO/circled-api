import axios from "src/utils/axios";
import api from "src/utils/api";

export const updateProgram = (data) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_PROGRAM", payload: data });
  };
};

export const updateEditProgram = (data) => {
  return (dispatch) => {
    dispatch({ type: "SET_BUFFER", payload: data });
  };
};

export const createProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      //dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      // let Plan = [];
      // let exist = data.ExercisePlan.map((week, index) => {
      //   let validdays = week.filter((day) => day.Exercise.length > 0);

      //   if (validdays.length == 0) {
      //     return false;
      //   } else {
      //     Plan.push(week);
      //     return true;
      //   }
      // });

      // if (!data.IsDraft) {
      //   data.ExercisePlan = Plan;
      //   data.duration = Plan.length;
      // }

      axios
        .post(`${api.protocol}${api.baseUrl}${api.createProgram}`, { ...data })
        .then((response) => {
          // Optimistically add the new program to the list so it appears instantly
          if (response.data.item) {
            dispatch({
              type: "ADD_PROGRAM",
              payload: response.data.item,
            });
          }
          // Then refresh from the server to get the full populated data
          dispatch(getAllPrograms()).catch(() => {});

          return res(response.data.item);
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.status !== 500 &&
            err.response.status !== 401
          ) {
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

export const getSpecificProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getProgram}${data}`)
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res(response.data.item);
        })
        .catch((err) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          if (
            err.response &&
            err.response.status !== 500 &&
            err.response.status !== 404
          ) {
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

export const getSpecificPublicProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getProgramPublic}${data}`)
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res(response.data.item);
        })
        .catch((err) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
          if (
            err.response &&
            err.response.status !== 500 &&
            err.response.status !== 404
          ) {
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

export const getAllPrograms = () => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      axios
        .get(`${api.protocol}${api.baseUrl}${api.getAllPrograms}`)
        .then((response) => {
          dispatch({
            type: "UPDATE_PROGRAMS_LIST",
            payload: { items: response.data.items },
          });
         
          return res("success");
        })
        .catch((err) => {
          if (err.response && err.response.status == 404) {
            dispatch({ type: "UPDATE_PROGRAMS_LIST", payload: { items: [] } });
          }
          return reject("error");
        });
    });
  };
};

export const duplicateProgram = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.duplicateProgram}${id}`)
        .then((response) => {
          dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Program Duplicated",
              severity: "success",
            },
          });
          dispatch(getAllPrograms()).then(() => {
            return res("success");
          });
        
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


export const deleteProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .delete(`${api.protocol}${api.baseUrl}${api.deleteProgram}${data}`)
        .then((response) => {
          dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Program Deleted",
              severity: "error",
            },
          });
          dispatch({ type: "DELETE_PROGRAM", payload: data });
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

export const archiveProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.archiveProgram}${data}`)
        .then((response) => {
          dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Program Archived",
              severity: "info",
            },
          });
          dispatch({ type: "ARCHIVE_PROGRAM", payload: data });
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

export const unarchiveProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.unarchiveProgram}${data}`)
        .then((response) => {
          dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
              snackbar: true,
              message: "Program Unarchived",
              severity: "info",
            },
          });
          dispatch({ type: "UNARCHIVE_PROGRAM", payload: data });
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

export const saveProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      // dispatch({ type: "UPDATE_FEED", payload: { loading: true } });

      // let Plan=[]
      // let exist=data.ExercisePlan.map((week,index)=>{

      //   let validdays=week.filter(day=>day.Exercise.length>0)

      //   if(validdays.length==0){
      //     return false
      //   }
      //   else
      //  {
      //    Plan.push(week)
      //   return true}
      //   })

      //   data.ExercisePlan=Plan
      //   data.duration=Plan.length
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.updateProgram}`, { ...data })
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res("success");
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
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

export const sendProgram = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.sendProgram}`, { ...data })
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res("success");
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
            dispatch({
              type: "UPDATE_FEED",
              payload: {
                loading: false,
                snackbar: true,
                message: "Oops caught some error! Please try again",
                severity: "error",
              },
            });
          }
          return reject("error");
        });
    });
  };
};

export const sharedProgramData = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      axios
        .post(`${api.protocol}${api.baseUrl}${api.getSharedProgram}${data}`)
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res(response.data);
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
            dispatch({
              type: "UPDATE_FEED",
              payload: {
                loading: false,
                snackbar: true,
                message: "Oops caught some error! Please try again",
                severity: "error",
              },
            });
          }
          return reject("error");
        });
    });
  };
};

export const deleteVideos = (videos) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
      let opp = [];
      videos.map((i) => {
        opp.push(
          axios.delete(`${api.protocol}${api.baseUrl}misc/delete-video/${i}`)
        );
      });

      Promise.all(opp)
        .then((response) => {
          dispatch({ type: "UPDATE_FEED", payload: { loading: false } });

          return res(response.data);
        })
        .catch((err) => {
          dispatch({
            type: "UPDATE_FEED",
            payload: {
              loading: false,
            },
          });
          if (err.response && err.response.status == 500) {
            dispatch({
              type: "UPDATE_FEED",
              payload: {
                loading: false,
                snackbar: true,
                message: "Oops caught some error! Please try again",
                severity: "error",
              },
            });
          }
          return reject(err);
        });
    });
  };
};

export const getRecent = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getRecent}${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {});
  });
};
