// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
// components
import Page from '../../components/Page'
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

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import LabeledInput from '../../components/core/LabeledInput'

import Progress from 'src/components/progress'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import ProfilePhotoBottomDrawer from 'src/components/client/profilePhotoBottomDrawer'
import axios from 'axios'
import api from 'src/utils/api'
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import ExerciseCard from 'src/components/instructor/exerciseCard'
import Label from 'src/components/Label'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import CarouselBasic1 from '../overview/extra/carousel/CarouselBasic1'
import { getBodyImages } from 'src/redux/actions/BodyImages'
import BodyImages from 'src/redux/reducers/BodyImages'
import moment from 'moment'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import More from 'src/assets/IconSet/More'
import Add from 'src/assets/IconSet/Add'
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
    // boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function MyProfilePhotos() {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const [photos, setPhotos] = useState([{}, {}, {}])
    const navigate = useNavigate()
    const Images = useSelector((s) => s.BodyImages.images)
    const handleBack = () => {
        navigate('/workoutCalendar')
    }
    useEffect(() => {
        getBodyImages()
    }, [])

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header boxShadow>
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
                                        color="primary"
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
                            position: 'relative',
                        }}
                    >
                        {/* <Box
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Iconify
                icon={"heroicons-outline:cursor-click"}
                width={20}
                height={20}
                color="text.secondary"
              />
              <Typography variant="body2" color="text.secondary">
                Touch and hold to edit or delete
              </Typography>
            </Box> */}

                        {Images.length ? (
                            <Grid container spacing={2}>
                                {Images?.map((item) => (
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Box
                                                position={'relative'}
                                                display={'flex'}
                                                alignItems={'flex-end'}
                                                justifyContent={'center'}
                                            >
                                                <img
                                                    onClick={() =>
                                                        navigate('photoId', {
                                                            state: {
                                                                date: moment(
                                                                    item.createdAt
                                                                ).format(
                                                                    'DD/MM/YYYY'
                                                                ),
                                                                item: item,
                                                            },
                                                        })
                                                    }
                                                    src={item?.images?.[0]}
                                                    style={{
                                                        width: '100%',
                                                        height: '230px',
                                                        objectFit: 'cover',
                                                        borderRadius: 16,
                                                    }}
                                                />
                                                {/* <Box
                          position={"absolute"}
                          bottom={12}
                          bgcolor={"rgba(0,0,0,0.6)"}
                          px={1.5}
                          borderRadius={2}
                        >
                          <Typography color={"common.white"}>
                            <b> {item.weight} KG</b>
                          </Typography>
                        </Box> */}
                                            </Box>
                                            <Box
                                                display="flex"
                                                flexDirection={'column'}
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="body1"
                                                    color="text.primary"
                                                >
                                                    {item?.weight || ''} Kg
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {moment(
                                                        item.createdAt
                                                    ).format('DD/MM/YYYY')}
                                                </Typography>
                                                <ProfilePhotoBottomDrawer
                                                    item={item}
                                                >
                                                    <IconButton>
                                                        <More
                                                            sx={{
                                                                color: 'text.primary',
                                                            }}
                                                            style={{
                                                                fontSize: 32,
                                                            }}
                                                            color="text.primary"
                                                        />
                                                    </IconButton>
                                                </ProfilePhotoBottomDrawer>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                height={'100%'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Typography mb={2}>
                                    No photos uploaded
                                </Typography>

                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() =>
                                        document
                                            .getElementById('upload-image')
                                            .click()
                                    }
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        multiple
                                        id={'upload-image'}
                                        type="file"
                                        onChange={(e) =>
                                            navigate('uploadNew', {
                                                state: {
                                                    item: {
                                                        images: [
                                                            ...e.target.files,
                                                        ],
                                                    },
                                                },
                                            })
                                        }
                                    />
                                    <Iconify
                                        Iconify
                                        icon="grommet-icons:upload-option"
                                        width={20}
                                        height={20}
                                        color="common.white"
                                    />
                                    &nbsp;&nbsp;
                                    <Typography
                                        sx={{ fontWeight: 'bold' }}
                                        variant="body1"
                                        color="common.white"
                                    >
                                        Upload photos
                                    </Typography>
                                </Button>
                            </Box>
                        )}
                        {Images.length ? (
                            <>
                                <br />
                                <br />
                                <br />
                                <br />
                            </>
                        ) : null}
                    </Content>
                </Container>{' '}
                {Images.length ? (
                    <Box position={'absolute'} bottom={48} right={32}>
                        <Button
                            color="primary"
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',

                                fontSize: 16,
                            }}
                            startIcon={
                                <Iconify
                                    Iconify
                                    icon="grommet-icons:upload-option"
                                    width={20}
                                    height={20}
                                    color="common.white"
                                />
                            }
                            //onClick={() => navigate("uploadNew")}
                        >
                            <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                                onChange={(e) =>
                                    navigate('uploadNew', {
                                        state: {
                                            item: {
                                                images: [...e.target.files],
                                            },
                                        },
                                    })
                                }
                            />

                            <Typography
                                sx={{ fontWeight: 'bold', fontSize: 16 }}
                                color="common.white"
                            >
                                Upload photo
                            </Typography>
                        </Button>
                    </Box>
                ) : null}
            </Page>
        </RootStyle>
    )
}
