import axios from 'src/utils/axios'
import api from 'src/utils/api'

import { store } from '../store'
import { fetchNotification } from './Notifications'
import { hadleNewMessage, getChatCount } from './chat'
import { getClients } from 'src/redux/actions/clientExercise'
import { getAllPrograms } from './createProgram'
import { updateFeedback } from './feedback'
export const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('redux-root')
    store.dispatch({ type: 'INIT_NEW_PROGRAM' })

    store.dispatch({ type: 'InitAP' })
    store.dispatch({ type: 'INIT_PROFILE' })
    store.dispatch({ type: 'INIT_NEW_PROGRAM' })
    store.dispatch({ type: 'RESET_NOTIFICATIONS' })
    store.dispatch({ type: 'INIT_PL' })
    store.dispatch({ type: 'INIT_CLIENT_EXERCISE' })
    store.dispatch({ type: 'INITIALIZE_CHAT' })
    localStorage.clear()
    store.dispatch({ type: 'LOG_OUT' })
    setTimeout(() => window.location.reload(), 1000)
}

export const searchUser = (qry) => {
    return new Promise((res, reject) => {
        axios
            .get(`${api.protocol}${api.baseUrl}${api.searchUser}${qry}`)
            .then((response) => {
                return res(response.data)
            })
            .catch((err) => {
                return reject('error')
            })
    })
}

export const checkUserExistance = (body) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${api.protocol}${api.baseUrl}${api.checkExist}`,body)
            .then((response) => {
                return resolve(response.data)
            })
            .catch((err) => {
                return reject('error')
            })
    })
}

export const fetchUser = (id) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

        axios
            .get(`${api.protocol}${api.baseUrl}${api.fetchUsers}_id=${id}`)
            .then((response) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })
                return res(response.data.ServerResponse[0])
            })
            .catch((err) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })
                return reject('error')
            })
    })
}

export const fetchPrograms = (id) => {
    return new Promise((res, reject) => {
        axios
            .get(
                `${api.protocol}${api.baseUrl}${api.allPrograms}createdBy=${id}&ProgramType=Public&sort=-createdAt`
            )
            .then((response) => {
                return res(response.data.ServerResponse)
            })
            .catch((err) => {
                return reject('error')
            })
    })
}

export const createOrder = (data) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

        axios
            .post(`${api.protocol}${api.baseUrl}${api.createOrder}`, {
                ...data,
            })
            .then((response) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })
                return res(response.data.ServerResponse)
            })
            .catch((err) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })
                return reject('error')
            })
    })
}

export const getSentPrograms = (id) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

        axios
            .get(`${api.protocol}${api.baseUrl}${api.getSentPrograms}${id}`)
            .then((response) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })
                return res(response.data)
            })
            .catch((err) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })

                if (err.response && err.response.status == 404) {
                    store.dispatch({
                        type: 'UPDATE_FEED',
                        payload: {
                            loading: false,
                            snackbar: true,
                            message: 'Upable to find requested resource',
                            severity: 'error',
                        },
                    })
                    //window.location = "/";
                }
                return reject(err)
            })
    })
}

export const deleteSentPrograms = (id) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

        axios
            .delete(`${api.protocol}${api.baseUrl}${api.deleteSendProgram}${id}`)
            .then((response) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false ,snackbar:true,message:"Program deleted"},
                })
                store.dispatch({
                    type:'DELETE_SENT_PROGRAM',
                    payload:{}
                })
                return res(response.data)
            })
            .catch((err) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: { loading: false },
                })

                if (err.response && err.response.status == 404) {
                    store.dispatch({
                        type: 'UPDATE_FEED',
                        payload: {
                            loading: false,
                            snackbar: true,
                            message: 'Upable to find requested resource',
                            severity: 'error',
                        },
                    })
                    //window.location = "/";
                }
                return reject(err)
            })
    })
}

export const addProgram = (id) => {
    return new Promise((res, reject) => {
        store.dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

        axios
            .post(`${api.protocol}${api.baseUrl}${api.addOrder}${id}`)
            .then((response) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: {
                        loading: false,
                        snackbar: true,
                        message: 'Program added to your account',
                        severity: 'success',
                    },
                })

                return res(response.data)
            })
            .catch((err) => {
                store.dispatch({
                    type: 'UPDATE_FEED',
                    payload: {
                        loading: false,
                        snackbar: true,
                        message: 'Upable to add requested resource',
                        severity: 'error',
                    },
                })

                if (err.response && err.response.status == 500) {
                    store.dispatch({
                        type: 'UPDATE_FEED',
                        payload: {
                            loading: false,
                            snackbar: true,
                            message: 'Upable to add requested resource',
                            severity: 'error',
                        },
                    })
                }
                return reject(err)
            })
    })
}

export const getStats = (id) => {
    return new Promise((res, reject) => {
        axios
            .get(`${api.protocol}${api.baseUrl}${api.getStats}${id}`)
            .then((response) => {
                return res(response.data)
            })
    })
}

export const socketConnection = () => {
   
}

export const markLogasread = (id) => {
    axios.put(`${api.protocol}${api.baseUrl}${api.markLogAsRead}`, { _id: id })
}

export const getLogUnreadCount = (id) => {
    return axios.get(
        `${api.protocol}${api.baseUrl}${api.getUnreadLogCount}${id}`
    )
}
