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
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from '@mui/material'

import Container from '../../../components/Layout/Container'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import IconWorkoutCalendar from 'src/assets/clientProfile/Icon_workoutCalendar'
import IconDietPlan from 'src/assets/clientProfile/Icon_DietPlan'
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem'
import IconPhotos from 'src/assets/clientProfile/Icon_Photos'
import IconNotes from 'src/assets/clientProfile/Icon_Notes'
import PhotoProgramHeader from 'src/components/dashboard/client/photoProgramHeader'
import Label from 'src/components/Label'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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

export default function ProfilePhotoProgram() {
    const [headerDependency, setHeaderDependency] = useState(false)
    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)

    const [exercises, setExercises] = useState([{}, {}])
    const navigate = useNavigate()

    const handelNext = () => {
        navigate('/createDietPlan')
    }
    const handleBack = () => {
        if (query.get('stage') == 2) {
            return navigate('/createProgram')
        }
        navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1))
    }

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header
                        style={{ borderRadius: '0px 0px 8px 8px' }}
                        headerDependency={headerDependency}
                    >
                        <PhotoProgramHeader
                            setHeaderDependency={setHeaderDependency}
                        />
                    </Header>{' '}
                    <Content style={{ paddingTop: 30 }}>
                        <Stepper
                            activeStep={false}
                            expanded={true}
                            orientation="vertical"
                        >
                            {exercises.map((step, index) => (
                                <Step key={step.label} expanded>
                                    <StepLabel>
                                        <Label>
                                            <Typography
                                                variant="body2"
                                                color="common.white"
                                            >
                                                24 January
                                            </Typography>
                                        </Label>
                                    </StepLabel>
                                    <StepContent>
                                        <div>
                                            <Box
                                                style={{
                                                    borderRadius: 16,
                                                    position: 'relative',
                                                    background:
                                                        'url(/images/userFitnessPhoto.png)',
                                                    backgroundSize: 'cover',
                                                    height: '425px',
                                                    width: '100%',
                                                }}
                                            >
                                                {/* <img
                        src="/images/userFitnessPhoto.png"
                        style={{
                          borderRadius: 16,
                          width: "100%",
                          height: "425px",
                          objectFit: "cover",
                        }}
                      /> */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        borderRadius: 16,
                                                        display: 'flex',
                                                        alignItems: 'end',
                                                        padding: '20px',
                                                        height: '200px',
                                                        width: '100%',
                                                        backgroundSize: 'cover',
                                                        background:
                                                            'linear-gradient(180deg, rgba(195, 203, 217, 0) 64.1%, #C3CBD9 91.41%)',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        color="common.white"
                                                    >
                                                        Body Fat: 15%
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        color="common.white"
                                                        sx={{ ml: 2 }}
                                                    >
                                                        Weight: 84 Kg
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </div>
                                        {/* <ExerciseCard newCard={step.isNew} /> */}
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
