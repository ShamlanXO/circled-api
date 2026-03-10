// @mui
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
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
    Tab,
    Tabs,
} from '@mui/material'

import Container from '../../../components/Layout/Container'
import Content from '../../../components/Layout/Content'
import Header from '../../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../../redux/actions/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from './../../../components/Iconify'
import LabeledInput from '../../../components/core/LabeledInput'
import FooterBase from '../../../components/Layout/Footer'
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
import { saveProgram, updateProgram } from 'src/redux/actions/clientExercise'
import { dispatch } from 'src/redux/store'
import Slate from 'src/utils/dietEditor'
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
    const DietPlan = useSelector(
        (s) => s.ProgramList.clientData.Program.DietPlan
    )
    const dispatch = useDispatch()

    const RegisterSchema = Yup.object().shape({
        Title: Yup.string().max(50, 'Title too long'),
        Description: Yup.string(),
    })

    const formik = useFormik({
        initialValues: {
            Title: DietPlan.Title || '',
            Description: DietPlan.Description || '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch(
                saveProgram({
                    DietPlan: {
                        Title: values.Title,
                        Description: values.Description,
                    },
                })
            ).then((res) => {
                dispatch(
                    updateProgram({
                        DietPlan: {
                            Title: values.Title,
                            Description: values.Description,
                        },
                    })
                )
            })
        },
    })

    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik

    useEffect(() => {
        return () => {
            handleSubmit()
        }
    }, [])
    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                                withoutPadding
                                flex
                                style={{
                                    background: '#fff',
                                }}
                            >
                                <Slate
                                    onChange={(data) =>
                                        setFieldValue('Description', data)
                                    }
                                    value={
                                        values.Description &&
                                        values.Description[0] == '['
                                            ? JSON.parse(values.Description)
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
                                />
                                {/* <Stack spacing={3} sx={{ width: "100%" }}>
                  <LabeledInput
                    fullWidth
                    placeholder="Example: yoga "
                    clabel="Plan title"
                    {...getFieldProps("Title")}
                    error={Boolean(touched.Title && errors.Title)}
                    helperText={touched.Title && errors.Title}
                  />
                  <LabeledInput
                    fullWidth
                    placeholder="Example: yoga "
                    clabel="Diet Details"
                    {...getFieldProps("Description")}
                    error={Boolean(touched.Description && errors.Description)}
                    helperText={touched.Description && errors.Description}
                    multiline
                    minRows={9}
                    maxRows={9}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            display={"flex"}
                            flexDirection="column"
                            justifyContent={"flex-end"}
                            marginTop={25}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {(formik.values.description + "").length + "/800"}
                            </Typography>
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>{" "} */}
                            </Content>
                        </Container>{' '}
                    </Form>
                </FormikProvider>
            </Page>
        </RootStyle>
    )
}
