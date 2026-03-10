import axios from '../../utils/axios';
import api from '../../utils/api';
import { store } from '../store';
export const createSubscription = (programId) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.createSubscription}`, {
        id: programId,
      })
      .then((response) => {
        resolve(response.data.id);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: { loading: false },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        if (err.response.status == 501)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'You have already purchased this program',
              severity: 'info',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Unauthorized access',
              severity: 'error',
            },
          });
        reject(err);
      });
  });
};

export const approveSubscription = (subscriptionId) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.approveSubscription}`, {
        id: subscriptionId,
      })
      .then((response) => {
        resolve('Approved');

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: { loading: false },
        });
      })
      .catch((err) => {
        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            loading: false,
            snackbar: true,
            message: 'Oops caught some error! Please try again',
            severity: 'error',
          },
        });
        reject(err);
      });
  });
};

export const createOrder = (programId) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.createOrder}`, {
        id: programId,
      })
      .then((response) => {
        resolve(response.data.id);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: { loading: false },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        if (err.response.status == 501)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'You have already purchased this program',
              severity: 'info',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Unauthorized access',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};

export const approveOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.approveOrder}`, {
        id: orderId,
      })
      .then((response) => {
        resolve('Approved');

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: { loading: false },
        });
      })
      .catch((err) => {
        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            loading: false,
            snackbar: true,
            message: 'Oops caught some error! Please try again',
            severity: 'error',
          },
        });
        reject(err);
      });
  });
};

export const addFreeOrder = (programId, id) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.addFreeOrder}`, {
        id: programId,
        programId: id,
      })
      .then((response) => {
        resolve(response.data.id);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: { loading: false },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        if (err.response.status == 501) {
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'You already have this program',
              severity: 'info',
            },
          });

          return reject(err.response.data);
        } else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Unauthorized access',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};

export const checkIfOrderExists = (programId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${api.protocol}${api.baseUrl}${api.checkIfOrderExists}`, {
        id: programId,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const unsubscribe = (programId) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.unsubscribe}`, {
        id: programId,
      })
      .then((response) => {
        resolve(response.data.id);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            loading: false,
            snackbar: true,
            message: 'Unsubscribed successfully',
            severity: 'success',
          },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        if (err.response.status == 501)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Unable to unsubscribe this program',
              severity: 'info',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Server error try again',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};

//----------------------------------------------------------------

export const fetchCustomer = () => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .get(`${api.protocol}${api.baseUrl}${api.getStripeCustomer}`)
      .then((response) => {
        resolve(response.data);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            loading: false,
          },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Server error try again',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};

export const AddPaymentMethod = (id) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.addPymentMethod}`, {
        token: id,
      })
      .then((response) => {
        resolve(response.data.paymentMethods);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            snackbar: true,
            message: 'Payemnt method added successfully',
            loading: false,
            severity: 'success',
          },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Server error try again',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};

export const RemovePaymentMethod = (id) => {
  return new Promise((resolve, reject) => {
    store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    axios
      .post(`${api.protocol}${api.baseUrl}${api.removePaymentMethod}`, {
        token: id,
      })
      .then((response) => {
        resolve(response.data.paymentMethods);

        store.dispatch({
          type: 'UPDATE_FEED',
          payload: {
            snackbar: true,
            message: 'Payemnt method removed successfully',
            loading: false,
            severity: 'success',
          },
        });
      })
      .catch((err) => {
        if (err.response.status == 500)
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Oops caught some error! Please try again',
              severity: 'error',
            },
          });
        else
          store.dispatch({
            type: 'UPDATE_FEED',
            payload: {
              loading: false,
              snackbar: true,
              message: 'Server error try again',
              severity: 'error',
            },
          });

        reject(err);
      });
  });
};
