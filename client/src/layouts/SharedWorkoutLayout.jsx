import * as React from 'react'
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
    useParams,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getClients } from 'src/redux/actions/clientExercise'
import { useDispatch } from 'react-redux'
import { fetchWorkout } from 'src/redux/actions/figgsLibrary'
import MessagesPage from 'src/pages/common/MessagePage'
function RequireAuth({ children }) {
    const dispatch = useDispatch()
    const { id } = useParams()
    const [workoutData, setWorkoutData] = React.useState({
        Title: '',
        Exercise: [],
    })
    const [showError, setError] = React.useState(false)
    let location = useLocation()
    let token = useSelector((s) => s.Profile.token)
    let Profile = useSelector((s) => s.Profile)
    React.useEffect(() => {
        dispatch(fetchWorkout(id))
            .then((data) => {
                setWorkoutData(data)
            })
            .catch((err) => {
                setError(true)
            })
    }, [])

    return (
        <>
            {showError ? (
                <MessagesPage />
            ) : (
                <Outlet context={[workoutData, token]} />
            )}
        </>
    )
}

export default RequireAuth
