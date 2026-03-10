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
    Tabs,
    Tab,
   
    Grid,
} from '@mui/material'

import Container from '../../../components/Layout/Container'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import Iconify from '../../../components/Iconify'
import CarouselBasic1 from 'src/pages/overview/extra/carousel/CarouselBasic1'
import IconHeight from 'src/assets/clientProfile/Icon_Height'
import IconWeight from 'src/assets/clientProfile/Icon_Weight'
import IconPercentage from 'src/assets/clientProfile/Icon_Percentage'
import IconMass from 'src/assets/clientProfile/Icon_Mass'
import { length, mass } from 'units-converter'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#F3F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

const ProgramBox = styled(Box)(({ theme }) => ({
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    margin: '4px 0',
    borderRadius: 16,
    position: 'relative',
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
const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
}))

const PriceContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    padding: '12px',
    justifyContent: 'space-between',
    alignItems: 'center',
}))
// ----------------------------------------------------------------------

export default function ClientProfileBodySystem() {
    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const allPrograms = [{}, {}, {}]
    const navigate = useNavigate()
    const Profile = useSelector((s) => s.ProgramList.clientData.UserId)
    const [current, setCurrent] = useState('About')
    const [unitFormat, setUnitFormat] = useState(1)
    const handleTabChange = (event, newValue) => {
        console.log(newValue)
        if (newValue == 0) {
            setCurrent('About')
        } else if (newValue == 1) {
            setCurrent('Status')
        } else {
            setCurrent('Clients')
        }
    }

    const handelNext = () => {
        navigate(
            '/createProgram?stage=' +
                (query.get('stage') ? Number(query.get('stage')) + 1 : 2)
        )
    }
    const handleBack = () => {
        navigate('/instructor')
    }

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
                                justifyContent={'space-between'}
                            >
                                <Box display={'flex'} alignItems={'center'}>
                                    {' '}
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        Body system
                                    </Typography>{' '}
                                </Box>{' '}
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content style={{ padding: '24px', overflowY: 'auto' }}>
                        <TabContainer sx={{ mb: 4 }}>
                            <Tabs
                                fullWidth
                                variant="fullWidth"
                                value={unitFormat}
                                onChange={(e, n) => setUnitFormat(n)}
                                aria-label=""
                                indicatorColor="none"
                                sx={{
                                    backgroundColor: '#F5F7FA',
                                    borderRadius: 12,
                                    border: '1px solid #E1E7F0',
                                }}
                            >
                                <Tab
                                    label="Metric units"
                                    style={{
                                        minWidth: '100px',
                                    }}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: (theme) =>
                                                theme.palette.common.white,
                                            backgroundColor: (theme) =>
                                                theme.palette.primary.main,
                                            borderRadius: 12,
                                            boxShadow: '0px 1px 7px #E1E7F0',
                                            border: '1px solid #E1E7F0',
                                        },
                                    }}
                                />
                                <Tab
                                    label="US metrics"
                                    style={{
                                        minWidth: '80px',
                                    }}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: (theme) =>
                                                theme.palette.common.white,
                                            backgroundColor: (theme) =>
                                                theme.palette.primary.main,
                                            borderRadius: 12,
                                            boxShadow: '0px 1px 7px #E1E7F0',
                                            border: '1px solid #E1E7F0',
                                        },
                                    }}
                                />
                            </Tabs>
                        </TabContainer>
                        <Stack spacing={2}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Box display={'flex'}>
                                        <Box>
                                            <IconHeight />
                                        </Box>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography
                                                sx={{ fontWeight: 'bold' }}
                                                variant="body1"
                                                color="text.primart"
                                            >
                                                Height
                                            </Typography>
                                            <Typography color="text.primary">
                                                {Profile.healthInfo.height !==
                                                null
                                                    ? Number(
                                                          unitFormat == 0
                                                              ? Profile
                                                                    .healthInfo
                                                                    .height
                                                              : length(
                                                                    Number(
                                                                        Profile
                                                                            .healthInfo
                                                                            .height
                                                                    )
                                                                )
                                                                    .from('cm')
                                                                    .to('ft')
                                                                    .value
                                                      ).toFixed(2)
                                                    : 'N/A'}
                                                {unitFormat == 0
                                                    ? ' cm'
                                                    : ' ft'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box display={'flex'}>
                                        <Box>
                                            <IconWeight />
                                        </Box>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography
                                                sx={{ fontWeight: 'bold' }}
                                                variant="body1"
                                                color="text.primart"
                                            >
                                                Weight
                                            </Typography>
                                            <Typography color="text.primary">
                                                {Profile.healthInfo.weight !==
                                                null
                                                    ? Number(
                                                          unitFormat == 0
                                                              ? Profile
                                                                    .healthInfo
                                                                    .weight
                                                              : mass(
                                                                    Number(
                                                                        Profile
                                                                            .healthInfo
                                                                            .weight
                                                                    )
                                                                )
                                                                    .from('kg')
                                                                    .to('lb')
                                                                    .value
                                                      ).toFixed(2)
                                                    : 'N/A'}
                                                {unitFormat == 0
                                                    ? ' kg'
                                                    : ' lbs'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box display={'flex'}>
                                        <Box>
                                            <IconPercentage />
                                        </Box>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography
                                                sx={{ fontWeight: 'bold' }}
                                                variant="body1"
                                                color="text.primart"
                                            >
                                                Body Fat
                                            </Typography>
                                            <Typography color="text.primary">
                                                {Profile.healthInfo.bodyFat !==
                                                null
                                                    ? Profile.healthInfo
                                                          .bodyFat + ' %'
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box display={'flex'}>
                                        <Box>
                                            <IconMass />
                                        </Box>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography
                                                sx={{ fontWeight: 'bold' }}
                                                variant="body1"
                                                color="text.primart"
                                            >
                                                Lean Mass
                                            </Typography>
                                            <Typography color="text.primary">
                                                {Profile.healthInfo.leanMass !==
                                                null
                                                    ? Number(
                                                          unitFormat == 0
                                                              ? Profile
                                                                    .healthInfo
                                                                    .leanMass
                                                              : mass(
                                                                    Number(
                                                                        Profile
                                                                            .healthInfo
                                                                            .leanMass
                                                                    )
                                                                )
                                                                    .from('kg')
                                                                    .to('lb')
                                                                    .value
                                                      ).toFixed(2)
                                                    : 'N/A'}
                                                {unitFormat == 0
                                                    ? ' kg'
                                                    : ' lbs'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <br />
                            <Stack spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Medical Condition
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {Profile.healthInfo.medicalCondition ||
                                        'N/A'}
                                </Typography>
                            </Stack>
                            <Stack spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Allergies & reactions
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {Profile.healthInfo.allergiesAndReactions ||
                                        'N/A'}
                                </Typography>
                            </Stack>

                            <Stack spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Additional Notes
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {Profile.healthInfo.medicalNotes || 'N/A'}
                                </Typography>
                            </Stack>
                            <Stack spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Documents
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    N/A
                                </Typography>
                            </Stack>
                        </Stack>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
