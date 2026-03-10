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
    Container,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import LabeledInput from '../../components/core/LabeledInput'
import FooterBase from '../../components/Layout/Footer'
import NewProgramForm from 'src/components/instructor/newProgramForm'
import WorkoutCalendar from 'src/components/instructor/workoutCalendarHeader'
const RootStyle = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
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

// ----------------------------------------------------------------------

export default function CreateProgramPage({ steps = 4, active = 1 }) {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)

    const navigate = useNavigate()
    const handelNext = () => {
        navigate(
            '/createProgram?stage=' +
                (query.get('stage') ? Number(query.get('stage')) + 1 : 2)
        )
    }
    const handleBack = () => {
        if (query.get('stage') == 2) {
            return navigate('/createProgram')
        }
        navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1))
    }

    return (
        <Page title=" Simplified Online Fitness Training ">
            <Container maxWidth={'xs'} disableGutters>
                <RootStyle>
                    <Box
                        width={'100%'}
                        sx={{ px: 1 }}
                        display={'flex'}
                        alignItems={'center'}
                        flexDirection={'row'}
                    >
                        <Box>
                            <Iconify
                                icon={'clarity:window-close-line'}
                                width={32}
                                height={32}
                                sx={{ mr: 0.5, mt: 0.5 }}
                            />
                        </Box>
                        {Array(steps)
                            .fill(0)
                            .map((i, index) => {
                                return (
                                    <Box
                                        flex={
                                            index + 1 == active ? undefined : 1
                                        }
                                        flexGrow={
                                            index + 1 == active ? 1 : undefined
                                        }
                                        sx={{
                                            maxWidth:
                                                index + 1 == active
                                                    ? undefined
                                                    : 50,
                                        }}
                                    >
                                        <LinearProgress
                                            variant="determinate"
                                            value={
                                                index + 1 == active ? 100 : 0
                                            }
                                            sx={{ mx: 0.5 }}
                                        />
                                    </Box>
                                )
                            })}
                    </Box>
                    {!query.get('stage') && <NewProgramForm />}
                    {query.get('stage') == 2 && <WorkoutCalendar />}
                </RootStyle>
            </Container>{' '}
            <FooterBase actionButton>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    px={3}
                    py={2}
                >
                    <Button
                        variant=""
                        sx={{ color: 'grey.500' }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            minWidth: 132,
                        }}
                        onClick={handelNext}
                    >
                        Next{' '}
                        <Iconify
                            icon={'akar-icons:circle-chevron-right'}
                            color="white"
                            width={20}
                            height={20}
                        />
                    </Button>
                </Box>
            </FooterBase>
        </Page>
    )
}
