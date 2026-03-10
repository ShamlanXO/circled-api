// @mui
import { styled } from '@mui/material/styles'

// components
import Page from '../../components/Page'
// sections
import { Box, Typography, Stack } from '@mui/material'

import Footer from '../../components/onboarding/footer'
import { useLocation, useNavigate } from 'react-router'
import TextField from '../../components/core/LabeledInput'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import FooterLayout from 'src/components/Layout/Footer'
import Container from 'src/components/Layout/Container'
import HeaderLayout from 'src/components/Layout/Header'
import Content from 'src/components/Layout/Content'
import DropDownSelect from '../../components/core/DropdownSelect'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import Logo from '../../assets/figgslogo.png'
import { InputAdornment } from '@mui/material'

// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
const RootStyle = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    background: '#fff',
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

// ----------------------------------------------------------------------

export default function HomePage({ mode }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    const RegisterSchema = Yup.object().shape({

        trainingExperience: Yup.string(),
        YearsOfTraining: Yup.number()
            .min(0, 'This field is required')
            .max(250, 'Please enter realistic value'),
        // currentJob: Yup.string(),
        // faviroteCardio: Yup.string(),
        activityLevel: Yup.string(),
    })
    let userData = useSelector((s) => s.Onboarding)
    const formik = useFormik({
        initialValues: {
    
            trainingExperience: '',
            YearsOfTraining: 3,
            currentJob: '',
            faviroteCardio: '',
            activityLevel: 'Light',
            ...userData
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch(
                updateOnboarding({
                    ...values,
                })
            )
            navigate(
                `/onboarding/${mode == 'client' ? 'client/' : ''}health-info`,
                {
                    state,
                }
            )
        },
    })
    console.log('state', state)
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik
    return (
        <Page title=" Simplified Online Fitness Training ">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Container>
                        <Header
                            title={'Create profile'}
                            onClose={() => navigate('/', { state })}
                        />
                        <Content withoutPadding>
                            <Box
                                display={'flex'}
                                height={'100%'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                flexGrow={'1'}
                                my={4}
                                px={2}
                            >
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <Typography
                                        variant="h2"
                                        align="left"
                                        sx={{ my: 4 }}
                                    >
                                        Personal fitness 2
                                    </Typography>
                            
                                    <TextField
                                        fullWidth
                                        placeholder="Write here"
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Sport experience
                                            </Typography>
                                        }
                                        {...getFieldProps('trainingExperience')}
                                        error={Boolean(
                                            touched.trainingExperience &&
                                                errors.trainingExperience
                                        )}
                                        helperText={
                                            (touched.trainingExperience &&
                                                errors.trainingExperience) ||
                                            'This helps customize your program, aligning it with your abilities and interests in sports.'
                                        }
                                    />


       
                                    <DropDownSelect
                                        fullWidth
                                        options={[
                                            {
                                                value: 'Light',
                                                label: 'Light: 1-3 times a week',
                                            },
                                            {
                                                value: 'Moderate',
                                                label: 'Moderate: 4-5 times a week',
                                            },
                                            {
                                                value: 'Active',
                                                label: 'Active: intense 4-5 times a week',
                                            },
                                            {
                                                value: 'Very active',
                                                label: 'Very active: intense 6-7 times a week',
                                            },
                                        ]}
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Activity level
                                            </Typography>
                                        }
                                        {...getFieldProps('activityLevel')}
                                        error={Boolean(
                                            touched.activityLevel &&
                                                errors.activityLevel
                                        )}
                                        helperText={
                                            (touched.activityLevel &&
                                                errors.activityLevel) ||
                                            'An indicator of your current physical activity helps to adjust the intensity of the program to your lifestyle.'
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        select
                                        SelectProps={{
                                            native: true,
                                        }}
                                        placeholder="Write here"
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Years of training
                                            </Typography>
                                        }
                                        type="number"
                                        {...getFieldProps('YearsOfTraining')}
                                        error={Boolean(
                                            touched.YearsOfTraining &&
                                                errors.YearsOfTraining
                                        )}
                                        helperText={
                                            (touched.YearsOfTraining &&
                                                errors.YearsOfTraining) ||
                                            'This informs about your trainer of your experience to perform certain exercises, ensuring a safe and effective routine.'
                                        }
                                    >
                                        <option value="" disabled>
                                            Select years of training
                                        </option>
                                        <option value={0}>No experience</option>
                                        <option value={1}>1 year</option>
                                        <option value={2}>2 years</option>
                                        <option value={3}>3 years</option>
                                        <option value={4}>4 years</option>
                                        <option value={5}>5 years</option>
                                        <option value={6}>6 years</option>
                                        <option value={7}>7 years</option>
                                        <option value={8}>8 years</option>
                                        <option value={9}>9 years</option>
                                        <option value={10}>10 years</option>
                                        <option value={11}>More than 10 years</option>
                                    </TextField>

                                    <TextField 
                                    fullWidth
                                    placeholder="Write here"
                                    clabel={
                                        <Typography variant="subtitle1" sx={{display:"flex"}}>
                                            Current job <Typography color={"text.secondary"} sx={{ml:0.5}}>optional</Typography>
                                        </Typography>
                                    }
                                    {...getFieldProps('currentJob')}
                                    error={Boolean(
                                        touched.currentJob && errors.currentJob
                                    )}
                                    helperText={
                                        (touched.currentJob && errors.currentJob) ||
                                        'Knowing your current job helps to tailor the program to fit your daily schedule and physical demands.'
                                    }
/>
                                </Stack>
                            </Box>
                        </Content>
                        <FooterLayout>
                            <Footer next back backClick={() => navigate(-1)} />
                        </FooterLayout>
                    </Container>
                </Form>
            </FormikProvider>
        </Page>
    )
}
