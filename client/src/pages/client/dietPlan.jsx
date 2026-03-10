// @mui
import { styled } from '@mui/material/styles'
import { useState, useMemo } from 'react'
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
    Tab,
    Tabs,
} from '@mui/material'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import LabeledInput from '../../components/core/LabeledInput'
import FooterBase from '../../components/Layout/Footer'
import Progress from 'src/components/progress'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import Footer from 'src/components/onboarding/footer'
import axios from 'axios'
import api from 'src/utils/api'
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import ExerciseCard from 'src/components/instructor/exerciseCard'
import Label from 'src/components/Label'
import { TabContext, TabPanel } from '@mui/lab'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#F5F7FA',
    height: '100%',
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
// ----------------------------------------------------------------------

export default function DietPlanPage() {
    const [exercises, setExercises] = useState([{}, {}])
    const navigate = useNavigate()
    const DietPlan = useSelector((s) => s.AtheletePlan.DietPlan)
    const handleBack = () => {
        navigate('/workoutCalendar')
    }
    const [tabValue, setTabValue] = useState('home')
    const [programs, setprograms] = useState([{}, {}, {}, {}])

    const [current, setCurrent] = useState('Workout Calendar')
    const handleTabChange = (event, newValue) => {
        console.log(newValue)
        if (newValue == 0) {
            setCurrent('Workout Calendar')
        } else {
            setCurrent('Diet Plan')
        }
    }
    const editor = useMemo(() => withReact(createEditor()), [])

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
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Diet Plan
                                </Typography>
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        flex={!DietPlan.Description}
                        style={{ overflowY: 'auto' }}
                    >
                        {' '}
                        <br />
                        {DietPlan.Description ? (
                            <Stack sx={{ px: 0.4 }}>
                                {/* <Stack spacing={1}>
                  <Typography variant="subtitle1" color="text.primary">
                    Plan Name
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {DietPlan.Title || "N/A"}
                  </Typography>
                </Stack> */}

                                <Stack>
                                    {/* <Typography variant="subtitle1" color="text.primary">
                    Plan Information
                  </Typography> */}
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        <Slate
                                            editor={editor}
                                            value={
                                                DietPlan.Description &&
                                                DietPlan.Description[0] == '['
                                                    ? JSON.parse(
                                                          DietPlan.Description
                                                      )
                                                    : [
                                                          {
                                                              type: 'paragraph',
                                                              children: [
                                                                  {
                                                                      text: '',
                                                                  },
                                                              ],
                                                          },
                                                      ]
                                            }
                                        >
                                            <Editable
                                                readOnly
                                                placeholder="Enter some plain text..."
                                            />
                                        </Slate>
                                    </Typography>
                                </Stack>
                            </Stack>
                        ) : (
                            <Box
                                height={'100%'}
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Not available
                                </Typography>
                                <Typography
                                    sx={{ maxWidth: 240 }}
                                    align={'center'}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Your instruct did not include a diet plan to
                                    this program
                                </Typography>
                            </Box>
                        )}
                        <br />
                        <br />
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
