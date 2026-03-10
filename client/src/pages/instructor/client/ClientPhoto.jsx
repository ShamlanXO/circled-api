// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components
import Page from '../../../components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    Avatar,
    ButtonBase,
    InputAdornment,
    IconButton,
    StepLabel,
    StepContent,
    Step,
    Stepper,
    Grid,
} from '@mui/material'

import Container from '../../../components/Layout/Container'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'

import { useDispatch } from 'react-redux'

import Iconify from '../../../components/Iconify'

import CarouselBasic2 from '../../overview/extra/carousel/CarouselBasic2'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#F2F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '16px',
}))
const SocialButton = styled(ButtonBase)(({ theme }) => ({
    height: 45,

    borderRadius: 16,
    background: '#F9FCFD',
    fontFamily: 'Proxima Nova',
    /* Dark primary / 50% */
    color: '#172A44',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 8,
    border: '2px solid rgba(23, 42, 68, 0.5)',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function MyProfilePhotoOne() {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const [photos, setPhotos] = useState([{}, {}, {}])
    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/workoutCalendar')
    }

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header noColor>
                        <BoxHeader px={2} py={2}>
                            <Box
                                width={'100%'}
                                display={'flex'}
                                alignItems={'center'}
                                flexDirection={'row'}
                            >
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <Typography variant="h6" color="text.primary">
                                    Photos
                                    <Typography
                                        component={'span'}
                                        variant="body2"
                                        color="secondary"
                                    ></Typography>
                                </Typography>
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        style={{
                            paddingTop: 24,
                            paddingBottom: 48,
                            overflowY: 'auto',
                        }}
                    >
                        <Stack spacing={1}>
                            <CarouselBasic2 items={state?.item.images} />
                            <br />
                            <Stack direction={'row'} spacing={10}>
                                <Stack spacing={1} px={2}>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {state?.item.weight}kg
                                    </Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Date uploaded
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {state.date}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <br />
                            <Stack direction={'column'} spacing={1} px={2}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Description
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {state?.item.description}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
