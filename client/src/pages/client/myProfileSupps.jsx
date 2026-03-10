// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
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
    Tabs,
    Tab,
   
    Grid,
} from '@mui/material'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import Iconify from '../../components/Iconify'
import CarouselBasic1 from 'src/pages/overview/extra/carousel/CarouselBasic1'
import IconHeight from 'src/assets/clientProfile/Icon_Height'
import IconWeight from 'src/assets/clientProfile/Icon_Weight'
import IconPercentage from 'src/assets/clientProfile/Icon_Percentage'
import IconMass from 'src/assets/clientProfile/Icon_Mass'
import SuppsForm from 'src/components/client/suplimentForm'
import { InputBase } from '@mui/material'

import { updateProfile } from 'src/redux/actions/Profile'
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

export default function MyProfileBodySystem() {
    const { search } = useLocation()
    const Profile = useSelector((s) => s.Profile)
    let [data, setData] = useState({ ...Profile.supps })

    const query = new URLSearchParams(search)
    const allPrograms = [{}, {}, {}]
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const saveData = (dataNew) => {
        dispatch(updateProfile({ supps: { ...dataNew } }))
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
                                        Supplements
                                    </Typography>{' '}
                                </Box>{' '}
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content style={{ padding: '24px', overflowY: 'auto' }}>
                        <Stack spacing={2}>
                            <SuppsForm
                                data={data}
                                setData={setData}
                                saveData={saveData}
                            />
                        </Stack>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
