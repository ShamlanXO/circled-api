// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
// sections
import {
    Box,
    Typography,
    Stack,
    ButtonBase,
    Button,
    BottomNavigation,
    BottomNavigationAction,
    Tabs,
    Tab,
    IconButton,
    InputBase,
    InputAdornment,
    TextField,
} from '@mui/material'
import axios from '../../utils/axios'
import api from '../../utils/api'
import Footer from '../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'

import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import Stepper from '../../components/progress'
import Image from '../../components/Image'
import Preview1 from '../../assets/onboarding/overview.svg'
import Preview2 from '../../assets/onboarding/overview2.svg'
import Preview3 from '../../assets/onboarding/overview3.svg'
import Iconify from '../../components/Iconify'
import Container from '../../components/Layout/Container'
import FooterBase from '../../components/Layout/Footer'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import InstructorHeader from 'src/components/home/HomeHeader'
import { useEffect, useState } from 'react'
import InstructorPrograms from 'src/components/instructor/instructorPrograms'
import ClientList from 'src/components/dashboard/client/ClientList'
import { getClients } from 'src/redux/actions/clientExercise'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}))

const BoxStyle = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
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
const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '0 20px',
    justifyContent: 'center',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function ClientsPage() {
    const dispatch = useDispatch()
    const { search } = useLocation()
    const { state } = useLocation()
    const [clients, setClients] = useState([])
    const query = new URLSearchParams(search)

    const navigate = useNavigate()

    const [tabValue, setTabValue] = useState('home')
    const [programs, setprograms] = useState([{}, {}, {}, {}])

    const [current, setCurrent] = useState('Active')
    const handleTabChange = (event, newValue) => {
        console.log(newValue)
        if (newValue == 0) {
            setCurrent('Active')
        } else {
            setCurrent('Inactive')
        }
    }

    useEffect(() => {
        dispatch(getClients())
            .then((clie) => {
                setClients(clie)
            })
            .catch((err) => {
                if (err == 404) {
                    setClients([])
                }
            })
    }, [])

    return (
        <Page title=" Simplified Online Fitness Training ">
            <RootStyle>
                <Container>
                    <Header>
                        <BoxHeader px={2} py={2}>
                            <Box display={'flex'} alignItems={'center'}>
                                {' '}
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <Typography variant="h6" color="text.primary">
                                    Total clients
                                </Typography>{' '}
                            </Box>{' '}
                        </BoxHeader>
                        {programs.length > 0 && (
                            <Box>
                                <BoxStyle>
                                    {/* <TextField
                    fullWidth
                    placeholder="Search"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <Iconify
                              icon={"eva:search-fill"}
                              width={24}
                              height={24}
                              color="text.secondary"
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                                </BoxStyle>
                                <TabContainer>
                                    <Tabs
                                        fullWidth
                                        variant="fullWidth"
                                        value={current == 'Active' ? 0 : 1}
                                        onChange={handleTabChange}
                                        aria-label=""
                                        indicatorColor="none"
                                        sx={{
                                            p: 0.5,
                                            backgroundColor: (theme) =>
                                                theme.palette.background
                                                    .default,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Tab
                                            label={
                                                'Active ' +
                                                clients.filter(
                                                    (i) => i.isActive
                                                ).length
                                            }
                                            style={{
                                                minWidth: '150px',
                                            }}
                                            sx={{
                                                '&.Mui-selected': {
                                                    color: (theme) =>
                                                        theme.palette.primary
                                                            .main,
                                                    backgroundColor: '#fff',
                                                    boxShadow:
                                                        '0px 1px 7px #E1E7F0',
                                                    border: '1px solid #E1E7F0',
                                                    borderRadius: 12,
                                                },
                                            }}
                                        />
                                        <Tab
                                            label={
                                                'Inactive ' +
                                                clients.filter(
                                                    (i) => !i.isActive
                                                ).length
                                            }
                                            style={{
                                                minWidth: '150px',
                                            }}
                                            sx={{
                                                '&.Mui-selected': {
                                                    color: (theme) =>
                                                        theme.palette.primary
                                                            .main,
                                                    backgroundColor: '#fff',
                                                    boxShadow:
                                                        '0px 1px 7px #E1E7F0',
                                                    border: '1px solid #E1E7F0',
                                                    borderRadius: 12,
                                                },
                                            }}
                                        />
                                    </Tabs>
                                </TabContainer>
                            </Box>
                        )}
                    </Header>

                    <Content flex style={{ overflowY: 'auto' }}>
                        <br />
                        <Box position="relative" px={1}>
                            <ClientList
                                clients={
                                    current == 'Active'
                                        ? clients.filter((i) => i.isActive)
                                        : clients.filter((i) => !i.isActive)
                                }
                            />
                        </Box>
                    </Content>
                </Container>
            </RootStyle>
        </Page>
    )
}
