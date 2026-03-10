import * as React from 'react'
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getClients } from 'src/redux/actions/clientExercise'
import { useDispatch } from 'react-redux'
function RequireAuth({ children }) {
    const dispatch = useDispatch()
    let location = useLocation()
    let token = useSelector((s) => s.Profile.token)
    let Profile = useSelector((s) => s.Profile)
    React.useEffect(() => {
        dispatch(getClients())
    
    }, [])
    if (!token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/" state={{ from: location,redirect:location.pathname }} replace />
    }
    if (!Profile.trainerOnboarded && Profile.type == 'Instructor') {
        return <Navigate to="/instructor-account" replace />
    }
    return (
        <>
            <Outlet />
        </>
    )
}

export default RequireAuth
