// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
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

import { useNavigate, useLocation, useParams } from 'react-router'

import { useDispatch, useSelector } from 'react-redux'

import Iconify from '../../../components/Iconify'

import ProfilePhotoBottomDrawer from 'src/components/client/profilePhotoBottomDrawer'

import 'react-alice-carousel/lib/alice-carousel.css'
import { getBodyImages } from 'src/redux/actions/BodyImages'
import moment from 'moment'
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
    // boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function MyProfilePhotos() {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    const { id } = useParams()
    console.log(search)
    const query = new URLSearchParams(search)
    const [photos, setPhotos] = useState([{}, {}, {}])
    const navigate = useNavigate()
    const Images = useSelector((s) => s.BodyImages.images)

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header>
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
                            position: 'relative',
                        }}
                    >
                       {!Images.length? <Box display={"flex"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
                <Typography color={"text.secondary"}>No photos added yet</Typography>
                </Box>:""}
                        <Grid container spacing={2}>
                            {Images?.map((item) => (
                                <Grid item xs={6}>
                                    <Stack spacing={1}>
                                        <img
                                            onClick={() =>
                                                navigate(
                                                    `/clientProfile/${id}/clientPhoto`,
                                                    {
                                                        state: {
                                                            date: moment(
                                                                item.createdAt
                                                            ).format(
                                                                'DD/MM/YYYY'
                                                            ),
                                                            item: item,
                                                        },
                                                    }
                                                )
                                            }
                                            src={item?.images?.[0]}
                                            style={{
                                                width: '100%',
                                                height: '230px',
                                                objectFit: 'cover',
                                                borderRadius: 16,
                                            }}
                                        />
                                        <Box
                                            display="flex"
                                            flexDirection={'column'}
                                            alignItems="center"
                                        >
                                            <Typography
                                                variant="body1"
                                                color="text.primary"
                                            >
                                                {item.weight} kg
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {moment(item.createdAt).format(
                                                    'DD/MM/YYYY'
                                                )}
                                            </Typography>
                                            <ProfilePhotoBottomDrawer
                                                item={item}
                                            ></ProfilePhotoBottomDrawer>
                                        </Box>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <br />
                        <br />
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
