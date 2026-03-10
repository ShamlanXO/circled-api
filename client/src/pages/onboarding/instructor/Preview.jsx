// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../../components/Page'

import { Box, Typography, Stack, ButtonBase, Button } from '@mui/material'

import Footer from '../../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'

import { useDispatch, useSelector } from 'react-redux'

import Preview1 from '../../../assets/onboarding/overview'
import Preview2 from '../../../assets/onboarding/overview2'
import Preview3 from '../../../assets/onboarding/overview3'

import Container from '../../../components/Layout/Container'
import FooterBase from '../../../components/Layout/Footer'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import Logo from '../../../assets/figgslogo.png'

// ----------------------------------------------------------------------

export default function HomePage({ mode }) {
    const { search } = useLocation()
    const { state } = useLocation()
    const user = useSelector((state) => state.Profile)
    const query = new URLSearchParams(search)

    const slideData = {
        1: {
            image: <Preview1 />,
            title: 'Create your profile',
            sub: 'Show your expertise skills and achievements in your profile.',
        },
        2: {
            image: <Preview2 />,
            title: 'Build a fitness program',
            sub: 'Create a fitness programs for clients to help achieve their goals.',
        },
        3: {
            image: <Preview3 />,
            title: 'Get paid',
            sub: 'Monetize by selling your fitness program diffirent payment models.',
        },
    }

    const navigate = useNavigate()
    if (!user?.token || user.trainerOnboarded) {
        navigate('/', { state, replace: true })
    }
    return (
        <Page title=" Simplified Online Fitness Training ">
            <Container>
                <Header>
                    <Box px={2} py={2}>
                        {/* <Stepper
                  handleClose={() => navigate("/",{state})}
                  steps={3}
                  active={Number(query.get("slide")) || 1}
                /> */}
                    </Box>
                </Header>
                <Content flex>
                    <Box
                        display={'flex'}
                        justifyContent="center"
                        alignItems={'center'}
                        mt={4}
                        mb={4}
                    >
                        <img src={Logo} height={46} />
                    </Box>
                    <Stack
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        px={2}
                        flexGrow={'1'}
                        spacing={4}
                    >
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            flexGrow={1}
                            sx={{ px: 2 }}
                            alignItems={'center'}
                            justifyContent={'center'}
                            width={'100%'}
                        >
                            <Box>
                                {slideData?.[query.get('slide')]?.image || (
                                    <Preview1 />
                                )}
                            </Box>
                            <Box width={'100%'} mt={1}>
                                <Typography variant="h6" textAlign={'center'}>
                                    {slideData[1].title}
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body"
                                        align={'center'}
                                        color={'text.secondary'}
                                    >
                                        <center>{slideData[1].sub}</center>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            flexGrow={1}
                            sx={{ px: 2 }}
                            alignItems={'center'}
                            justifyContent={'center'}
                            width={'100%'}
                        >
                            <Box>
                                {slideData?.[query.get('slide')]?.image || (
                                    <Preview2 />
                                )}
                            </Box>
                            <Box width={'100%'} mt={1}>
                                <Typography variant="h6" textAlign={'center'}>
                                    {slideData[2].title}
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body"
                                        align={'center'}
                                        color={'text.secondary'}
                                    >
                                        <center>{slideData[2].sub}</center>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            flexGrow={1}
                            sx={{ px: 2 }}
                            alignItems={'center'}
                            justifyContent={'center'}
                            width={'100%'}
                        >
                            <Box width={'100%'}>{<Preview3 />}</Box>
                            <Box width={'100%'} mt={1}>
                                <Typography variant="h6" textAlign={'center'}>
                                    {slideData[3].title}
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body"
                                        align={'center'}
                                        color={'text.secondary'}
                                    >
                                        <center>{slideData[3].sub}</center>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Content>

                <FooterBase>
                    <Footer
                        next
                        nextClick={() =>
                            navigate('/instructor-account/profile', {
                                state,
                                replace: true,
                            })
                        }
                    />
                </FooterBase>
            </Container>
        </Page>
    )
}
