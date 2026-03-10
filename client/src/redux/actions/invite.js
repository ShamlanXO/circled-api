import axios from 'src/utils/axios';
import api from 'src/utils/api';
export const sendinvitation = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      // dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .post(`${api.protocol}${api.baseUrl}${api.sendinvitation}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res(response.data.id);
        })
        .catch((err) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
            },
          });
          if (err.response && err.response.status !== 500) {
            if (err.response.status !== 403) {
              dispatch({
                type: 'UPDATE_FEED',
                payload: {
                  loading: false,
                  snackbar: true,
                  message: 'Oops caught some error! Please try again',
                  severity: 'error',
                },
              });
            }
            return reject(err.response);
          }
        });
    });
  };
};

export const resendinvitation = (data) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      // dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })
      axios
        .post(`${api.protocol}${api.baseUrl}${api.resendinvitation}`, {
          ...data,
        })
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',

            payload: { loading: false, snackbar: true, message: 'Invitaion sent successfully' },
          });

          return res(response.data.id);
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
            if (err.response.status !== 403) {
              dispatch({
                type: 'UPDATE_FEED',
                payload: {
                  loading: false,
                  snackbar: true,
                  message: 'Oops caught some error! Please try again',
                  severity: 'error',
                },
              });
            }
            return reject(err.response);
          }
        });
    });
  };
};

export const fetchInvitations = () => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });

      axios
        .get(`${api.protocol}${api.baseUrl}${api.fetchInvitations}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res(response.data);
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

export const fetchInvitation = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });

      axios
        .get(`${api.protocol}${api.baseUrl}${api.fetchInvitation}${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: { loading: false },
          });

          return res(response.data);
        })
        .catch((err) => {
          if (err.response && err.response.status !== 500) {
            dispatch({
              type: 'UPDATE_FEED',
              payload: { loading: false },
            });
            return reject(err.response);
          }
        });
    });
  };
};

export const acceptInvitation = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.acceptInvitation}/${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Invitation accepted successfully',
              severity: 'success',
            },
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

export const rejectInvitation = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .delete(`${api.protocol}${api.baseUrl}${api.rejectInvitation}/${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Invitation rejected successfully',
              severity: 'success',
            },
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

export const deleteInvitation = (id) => {
  return (dispatch) => {
    return new Promise((res, reject) => {
      dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
      axios
        .delete(`${api.protocol}${api.baseUrl}${api.deleteInvitation}/${id}`)
        .then((response) => {
          dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Invitation deleted successfully',
              severity: 'success',
            },
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
