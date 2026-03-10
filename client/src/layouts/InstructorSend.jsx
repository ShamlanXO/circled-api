import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// @mui
import { useParams, useNavigate } from 'react-router'
import { Box, Typography, Stack, Grid, Radio, RadioGroup } from '@mui/material'

import { updateOnboarding } from 'src/redux/actions/Onboarding'
import { updateFeedback } from 'src/redux/actions/feedback'
import { updateProfile } from 'src/redux/actions/Profile'
import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import { useEffect } from 'react'

// components
// ----------------------------------------------------------------------

export default function MainLayout({ mode }) {
    const { pathname, state } = useLocation()
    const navigate = useNavigate()

    const { id, email, token } = useParams()
    let ProfileToken = useSelector((s) => s.Profile.token)
    let type = useSelector((s) => s.Profile.type)
    let dispatch = useDispatch()

    // useEffect(() => {
    //   if (!ProfileToken) {
    //     if (token)
    //       navigate("/onboarding/client", {
    //         state: {
    //           redirect: pathname,
    //           email,
    //           ProfileToken,
    //           token,
    //         },
    //       });
    //     else {
    //       navigate("/login", {
    //         state: {
    //           redirect: pathname,
    //           email,
    //           token,
    //         },
    //       });
    //     }
    //   }
    // }, []);
    const swichAccount = () => {
        dispatch(
            updateFeedback({
                loading: true,
                sAnimate: true,
                message: '',
                profileType: type == 'Athlete' ? 'Instructor' : 'Athlete',
            })
        )
        dispatch(
            updateProfile({
                type: type == 'Athlete' ? 'Instructor' : 'Athlete',
            })
        ).then((res) => {
            setTimeout(() => {
                dispatch(
                    updateFeedback({
                        loading: false,
                        sAnimate: false,
                        profileType: '',
                    })
                )
            }, 4000)
        })
    }
    if (type == 'Instructor' && ProfileToken) {
        return (
            <Container>
                <Content
                    flex
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box justifyContent={'center'} alignItems={'center'}>
                        <Box
                            display={'flex'}
                            justifyContent="center"
                            alignItems={'center'}
                            mt={4}
                        >
                            <Typography variant="h3" sx={{ color: 'grey.700' }}>
                                Circled.fit
                            </Typography>
                            <Box
                                sx={{
                                    ml: 1,
                                    px: 1,
                                    backgroundColor: 'primary.lighter',
                                    borderRadius: '30px',
                                }}
                            >
                                {' '}
                                <Box
                                    sx={{
                                        color: 'primary.main',
                                        fontSize: 10,
                                        py: 0.3,
                                    }}
                                >
                                    Beta
                                </Box>
                            </Box>
                        </Box>
                        <br />
                        <Typography align="center" gutterBottom>
                            You are currently in instructor mode <br />
                            To view the program click here
                        </Typography>
                        <Typography
                            align="center"
                            color={'secondary.main'}
                            sx={{ textDecoration: 'underline' }}
                            onClick={swichAccount}
                        >
                            Switch to Client Mode
                        </Typography>
                    </Box>
                </Content>
            </Container>
        )
    } else
        return (
            <>
                <Outlet />
            </>
        )
}
