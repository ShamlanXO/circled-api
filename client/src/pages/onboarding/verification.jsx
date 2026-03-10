// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
// sections
import { Box, Typography, TextField } from '@mui/material'
import { borderRadius } from '@mui/system'
import { IconButtonAnimate, varFade } from '../../components/animate'
import Iconify from '../../components/Iconify'
import Footer from '../../components/onboarding/footer'
import { useNavigate } from 'react-router'
import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import FooterBase from '../../components/Layout/Footer'
import { useState } from 'react'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import { useLocation } from 'react-router'
import axios from '../../utils/axios'
import api from '../../utils/api'
import { useRef } from 'react'
import { initProfile } from 'src/redux/actions/Profile'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import OtpInput from 'react-otp-input'
import Logo from 'src/assets/figgslogo.png'
import Countdown from 'react-countdown'
import { truncate } from 'lodash'
const RootStyle = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    background: '#fff',
    height: '100vh',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

const InsideBoxStyle = styled(Box)(() => ({
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 52,
    paddingBottom: 24,
    zIndex: 100,
    top: 0,
}))

// ----------------------------------------------------------------------
const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return (
            <Typography
                sx={{ fontWeight: 'bold', ml: 2 }}
                variant='"body2'
                color="primary"
            >
                Resend code
            </Typography>
        )
    } else {
        // Render a countdown
        return (
            <Typography variant='"body2'>
                {minutes}:{seconds}
            </Typography>
        )
    }
}
export default function HomePage({ mode }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const Onboarding = useSelector((s) => s.Onboarding)
    const { state } = useLocation()
    const [verificationCode, setCode] = useState('')
    const [cureentTime, setCurrentTime] = useState(Date.now() + 30000)
    const [completed, setCompleted] = useState(false)
    const inputCode = (otp) => {
        const regexp = /^[0-9]*$/

        let code = otp.toString()

        if (regexp.test(code)) {
            setCode(code)
            if (code.length === 6) {
                handleVerification(code)
            }
        }
        if (code.length == 0) {
            setCode('')
        }
    }
    const ref = useRef(null)
    //const countdown = useCountdown(Date.now() + 12000);
    const handleVerification = (code) => {
        updateFeedback({
            loading: true,
            snackbar: false,
          
        })
        axios
            .post(`${api.protocol}${api.baseUrl}${api.verifyMail}`, {
                email: Onboarding.email,
                token: code || verificationCode,
                phone: Onboarding.phone,
                type:"email",
                authType:state?.authType
            })
            .then((res) => {
                if(state?.authType=="signup")
                {dispatch(updateOnboarding({ token: res.data.token }))
                dispatch(
                    updateFeedback({
                        loading: false,
                        snackbar: true,
                        message: 'Account verification completed',
                        severity: 'success',
                    })
                )
                navigate(`/onboarding/${mode == 'client' ? 'client/info' : 'preview'}`, {
                    replace: true,
                    state: { ...state, email: Onboarding.email,type:"email",phone:Onboarding.phone ,token:res.data.token},
                })
            }
                else{
                    let {
                        _id,
                        category,
                        name,
                        bio,
                        type,
                        DOB,
                        privatePlan,
                        profilePic,
                        location,
                        links,
                        email,
                        phone,
                    } = res.data.userData
                    // if (props.location.state && props.location.state.return) {
                    //   setTimeout(() => {
                    //     props.history.push(props.location.state.return);
                    //     console.log(props.location.state.return);
                    //   }, 1000);
                    // }

                    axios.defaults.headers.common['Authorization'] =
                        res.data.token
                    localStorage.setItem('token', res.data.token)

                    dispatch(
                        initProfile({
                            _id,
                            category,
                            name,
                            bio,
                            type,
                            DOB,
                            privatePlan,
                            profilePic,
                            location,
                            links,
                            email,
                            token: res.data.token,
                            phone,
                            password: '',
                            ...res.data.userData,
                        })
                    )

                    if (state.redirect) {
                        navigate(state.redirect)
                    }
                }
               
               
            })
            .catch((err) => {
                if (err.response.status === 406)
                    dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message:
                                'Acccount with give email address already exists!',
                            severity: 'error',
                        })
                    )
                if (err.response.status === 404)
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message: 'Invalid code!',
                            severity: 'error',
                        })
                    )
            })
    }

    const resedVerification = () => {
        dispatch(
            updateFeedback({
                loading: true,
            })
        )
        setCurrentTime(Date.now() + 30000)
        if(state?.type=="phone"){
            axios
            .get( `${api.protocol}${api.baseUrl}${api.sendOtp}${Onboarding.phone}`)
            .then((response) => {
                setCompleted(false)

                dispatch(
                    updateFeedback({
                        loading: false,
                        snackbar: true,
                        message: 'Verification code sent',
                        severity: 'success',
                    })
                )
            })
        }else{
            axios
            .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
                email: Onboarding.email,
            })
            .then((response) => {
                setCompleted(false)

                dispatch(
                    updateFeedback({
                        loading: false,
                        snackbar: true,
                        message: 'Verification code sent',
                        severity: 'success',
                    })
                )
            })
        }
       
    }

    return (
        <Page title=" Simplified Online Fitness Training ">
            <Container>
                <Header
                    title={state?.authType=="login"?"Login":'Create account'}
                    onClose={() => navigate('/', { state })}
                />
                <Content>
                    <Box
                        display={'flex'}
                        justifyContent="center"
                        alignItems={'center'}
                        mt={4}
                    >
                        <img src={Logo} height={46} />
                    </Box>
                    <Box
                        display={'flex'}
                        height={'100%'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        flexGrow={1}
                        px={2}
                    >
                        <Typography variant="h2" sx={{ my: 6, mb: 3 }}>
                            {state?.type=="phone"?"Verify phone number":"Check your email!"}
                        </Typography>

                        <Typography variant='"body2' color={'grey.600'}>
                            We have sent the verification code to
                        </Typography>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ my: 1, fontWeight: 'bold', mb: 3 }}
                        >
                            {Onboarding.email}
                        </Typography>
                        <Box width={'100%'}>
                            <OtpInput
                                value={verificationCode}
                                onChange={inputCode}
                                numInputs={6}
                                isInputNum={true}
                                shouldAutoFocus={true}
                                separator={<span>&nbsp;</span>}
                                containerStyle={{
                                    border: 'none',
                                    width: '100%',
                                    justifyContent: 'space-around',
                                }}
                                inputStyle={{
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    padding: 10,
                                    width: 48,
                                    height: 64,
                                    border: '1px solid rgba(195, 203, 217, 1)',
                                    backgroundColor: 'rgba(245, 247, 250, 1)',
                                    fontSize: 24,
                                    color: '#2F86EB',
                                    fontWeight: 'bold',
                                    boxShadow: 'none',
                                    borderRadius: 8,
                                    borderBottom:
                                        '1px solid rgba(195, 203, 217, 1)',
                                }}
                                focusStyle={{
                                    outline: 'none',

                                    color: '#2F86EB',
                                }}
                            />
                        </Box>

                        <Box
                            display={'flex'}
                            justifyContent="space-between"
                            sx={{ my: 3 }}
                        >
                            {!completed ? (
                                <Countdown
                                    ref={ref}
                                    date={cureentTime}
                                    onComplete={() => setCompleted(true)}
                                    renderer={({
                                        hours,
                                        minutes,
                                        seconds,
                                        completed,
                                    }) => {
                                        if (completed) {
                                            // Render a completed state
                                            return (
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        ml: 2,
                                                    }}
                                                    variant='"body2'
                                                    color="primary"
                                                    onClick={resedVerification}
                                                >
                                                    Resend code
                                                </Typography>
                                            )
                                        } else {
                                            // Render a countdown
                                            return (
                                                <Typography variant='"body2'>
                                                    Wait until {minutes}:
                                                    {seconds} to resend
                                                </Typography>
                                            )
                                        }
                                    }}
                                />
                            ) : (
                                <Typography
                                    sx={{ fontWeight: 'bold', ml: 2 }}
                                    variant='"body2'
                                    color="primary"
                                    onClick={resedVerification}
                                >
                                    Resend code
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Content>
                {/* <FooterBase>
          <Footer
            back
            next
            disabledNext={verificationCode.length < 6}
            nextClick={handleVerification}
            backClick={() => navigate(-1)}
          />
        </FooterBase> */}
            </Container>
        </Page>
    )
}
