// @mui
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'

// components
import Page from '../../components/Page'
// sections
import {
    Box,
    IconButton,
    InputAdornment,
    Typography,
    Avatar,
    Stack,
} from '@mui/material'

import Footer from '../../components/onboarding/footer'
import Container from '../../components/Layout/Container'
import Content from 'src/components/Layout/Content'
import { useLocation, useNavigate } from 'react-router'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import axios from '../../utils/axios'
import api from '../../utils/api'
import Input from 'src/components/Labs/Cropper'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import { useSelector } from 'react-redux'
import { initProfile } from 'src/redux/actions/Profile'
import { handleuploadImage } from 'src/utils/uploader'
import icon1 from 'src/assets/onboarding/icon1.png'
import icon2 from 'src/assets/onboarding/icon2.png'
import icon3 from 'src/assets/onboarding/icon3.png'
import icon4 from 'src/assets/onboarding/icon4.png'
import FooterLayout from 'src/components/Layout/Footer'
import Logo from 'src/assets/figgslogo.png'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
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

export default function ProfilePic({ mode }) {
    const navigate = useNavigate()
    const { state } = useLocation()
    const Onboarding = useSelector((s) => s.Onboarding)
    const [profilePic, setPic] = useState(Onboarding.profilePic)
    const [about, setAbout] = useState(Onboarding.about)
    const dispatch = useDispatch()

    const uploadImage = (e) => {
        dispatch(updateFeedback({ loading: true }))

        handleuploadImage(e).then(
            (res) => {
                setPic(res.data.Location)
                dispatch(updateFeedback({ loading: false }))
            },
            (rej) => {
                if (rej == 'size')
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message: 'Image size should be less than 5 mb',
                            severity: 'warning',
                        })
                    )
                else
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message:
                                'Error in uploading image please try again later',
                            severity: 'warning',
                        })
                    )
            }
        )
    }

    useEffect(() => {
        dispatch(updateOnboarding({ profilePic: profilePic }))
    }, [profilePic, about])

    const handleNext = () => {
        dispatch(
            updateFeedback({
                loading: true,
            })
        )
        console.log(state,Onboarding)
        if (state?.token || Onboarding.token||Onboarding.tokenId) 
            axios
                .post(`${api.protocol}${api.baseUrl}${api.userSignup}`, {
                    ...Onboarding,
                   tokenId:Onboarding.tokenId,
                    token: state?.token || Onboarding.token,
                    type: mode == 'client' ? 'Athlete' : 'Instructor',
                    trainerOnboarded: mode != 'client',
                    clientOnboarded: mode == 'client',
                })
                .then((response) => {
                    dispatch(
                        updateFeedback({
                            loading: false,
                            sAnimate: true,
                            message: 'Account Created',
                            severity: 'success',
                        })
                    )
                    dispatch(updateOnboarding({ token: response.data.token }))
                    localStorage.setItem('token', response.data.token)
                    axios.defaults.headers.common['Authorization'] =
                        response.data.token
                    dispatch(
                        initProfile({
                            ...response.data.userData,
                            password: '',
                            ...response.data,
                        })
                    )
                    if (state?.redirect) {
                        navigate(state?.redirect)
                    } else navigate('/', { state })
                })
                .catch((error) => {
                    console.log(error)
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message: 'Unexpected error! Please try again',
                            severity: 'error',
                        })
                    )
                })
    }

    return (
        <Page title=" Simplified Online Fitness Training ">
            <Container>
                <Header
                    title={'Create account'}
                    onClose={() => navigate('/', { state })}
                />
                <Content>
                    <Box
                        display={'flex'}
                        justifyContent="center"
                        alignItems={'center'}
                        my={4}
                    >
                        <img src={Logo} height={46} />
                    </Box>
                    <Stack
                        spacing={4}
                        px={3}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Stack direction={'row'} spacing={2}>
                            <img src={icon1} width={32} height={32} />
                            <Typography>
                                Thank you for choosing us. This product is
                                currently in beta version.
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <img src={icon2} width={32} height={32} />
                            <Typography>
                                Keep in mind it may have bugs or unfinished
                                features.
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <img src={icon3} width={32} height={32} />
                            <Typography>
                                Your feedback is crucial in helping us build a
                                better product for you and the community. We
                                truly appreciate your time and input.
                            </Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <img src={icon4} width={32} height={32} />
                            <Typography>
                                We may charge small fees in the future to
                                maintain the service and provide the best
                                experience.
                            </Typography>
                        </Stack>
                    </Stack>
                </Content>
                <FooterLayout>
                    <Footer next nextClick={handleNext} nextText={'Start'} />
                </FooterLayout>
            </Container>
        </Page>
    )
}
