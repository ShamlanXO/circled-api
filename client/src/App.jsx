// routes
import Router from './routes'
// theme
import ThemeProvider from './theme'
import GlobalStyles from './theme/globalStyles'
// components
import Settings from './components/settings'
import RtlLayout from './components/RtlLayout'
import { ChartStyle } from './components/chart'
import ScrollToTop from './components/ScrollToTop'
import GoogleAnalytics from './components/GoogleAnalytics'
import { ProgressBarStyle } from './components/ProgressBar'
import NotistackProvider from './components/NotistackProvider'
import ThemeColorPresets from './components/ThemeColorPresets'
import ThemeLocalization from './components/ThemeLocalization'
import MotionLazyContainer from './components/animate/MotionLazyContainer'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { updateFeedback } from './redux/actions/feedback'
import { connect } from 'react-redux'
import ConfirmModal from './utils/Modal'
import SuccessModel from './components/SuccessModel'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchNotification } from 'src/redux/actions/Notifications'
import useSocket from './hooks/useSocket'
import { SocketContext, SocketProvider } from './contexts/SocketContext'
import AddToHomeScreen from './components/AddToHomeScreen'
import VersionDialoge from './components/VersionCheck'

function App(props) {
    const ProfileData = useSelector((state) => state.Profile)
    const { snackbar, message, severity, loading } = props.Feedback
    const handleClose = () => {
        props.updateFeedback({ snackbar: false })
    }
    useEffect(() => {
        if (ProfileData.token) fetchNotification()
           
    }, [ProfileData.token])

    return (
        <ThemeProvider>
            {/* <ThemeColorPresets> */}
            {/* <ThemeLocalization> */}
            <RtlLayout>
                <NotistackProvider>
                    <MotionLazyContainer>
                        <GlobalStyles />
                        <ProgressBarStyle />
                        <ChartStyle />
                        {/* <Settings /> */}
                        <ScrollToTop />
                        <GoogleAnalytics />
                        {/* Hot Reload Test Component - Remove this after testing */}
                      
                        <Snackbar
                            open={snackbar}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Alert
                                onClose={handleClose}
                                severity={severity}
                                elevation={6}
                                variant="filled"
                            >
                                {message}
                            </Alert>
                        </Snackbar>
                        <SuccessModel />
                        <Backdrop
                            sx={{
                                color: '#fff',
                                zIndex: (theme) => theme.zIndex.drawer + 1,
                            }}
                            open={loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <AddToHomeScreen/>
                        <VersionDialoge/>
                        <ConfirmModal>
                            <SocketProvider>
                            <Router />
                            </SocketProvider>
                        </ConfirmModal>
                    </MotionLazyContainer>
                </NotistackProvider>
            </RtlLayout>
            {/* </ThemeLocalization> */}
            {/* </ThemeColorPresets> */}
        </ThemeProvider>
    )
}

const mapStateToProps = (state) => {
    return {
        type: state.Profile.type,
        _id: state.Profile._id,
        token: state.Profile.token,
        Feedback: state.Feedback,
        socket: state.Common.socket,
    }
}

export default connect(mapStateToProps, { updateFeedback })(App)
