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
   
    InputBase,
} from '@mui/material'

import Container from '../../../components/Layout/Container'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import Iconify from '../../../components/Iconify'
import CarouselBasic1 from 'src/pages/overview/extra/carousel/CarouselBasic1'
import { saveProgram, updateProgram } from 'src/redux/actions/clientExercise'
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

export default function ClientProfileNotes() {
    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const allPrograms = [{}, {}, {}]
    const navigate = useNavigate()

    const Notes = useSelector((s) => s.ProgramList.clientData.Program.Notes)
    const dispatch = useDispatch()
    const [current, setCurrent] = useState('About')
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

    const onBlur = (e) => {
        dispatch(
            saveProgram({
                Notes: e.target.value,
            })
        ).then((res) => {
            dispatch(
                updateProgram({
                    Notes: e.target.value,
                })
            )
        })
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
                                        Notes
                                    </Typography>{' '}
                                </Box>{' '}
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        style={{
                            paddingTop: 24,
                            paddingBottom: 24,
                            overflowY: 'auto',
                        }}
                    >
                        <Stack spacing={2}>
                            <InputBase
                                minRows={10}
                                onBlur={onBlur}
                                defaultValue={Notes}
                                multiline
                                placeholder="Write your notes here"
                            />
                            {/* <Typography variant="body1" color="text.secondary">
                Lorem ipsum dolor sit amet sed lectus. Lorem ipsum dolor sit
                amet sed lectus. Lorem ipsum dolor sit amet sed lectus. Lorem
                ipsum dolor sit amet sed lectus. Lorem ipsum dolor sit amet sed
                lectus. Lorem ipsum dolor sit amet sed lectus. Lorem ipsum dolor
                sit amet sed lectus. Lorem ipsum dolor sit amet sed lectus.
                Lorem ipsum dolor sit amet sed lectus. Lorem ipsum dolor sit
                amet sed lectus. Lorem ipsum dolor sit amet sed lectus. Lorem
                ipsum dolor sit amet sed lectus.
              </Typography> */}
                        </Stack>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
