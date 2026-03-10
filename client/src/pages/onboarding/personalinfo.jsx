// @mui
import { styled } from '@mui/material/styles'

// components
import Page from '../../components/Page'
// sections
import { Box, Typography, Stack, Grid, Radio, RadioGroup } from '@mui/material'

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
import DatePicker from '@mui/lab/DatePicker'
import { DesktopDatePicker } from '@mui/lab'
import Container from '../../components/Layout/Container'
import Content from 'src/components/Layout/Content'
import FooterBase from '../../components/Layout/Footer'
import CountrySelect from 'src/components/core/CountryInput'
import Logo from '../../assets/figgslogo.png'
import './dropdown.css'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import { checkUserExistance } from 'src/redux/actions/common'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns as MuiAdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
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
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        dob: Yup.string().required('Birthday is required'),
      
        gender: Yup.string(),
        country: Yup.string().required("Please select your location")
    })
    let userData = useSelector((s) => s.Onboarding)
    const formik = useFormik({
        initialValues: {
            firstName: userData.name?.split(' ')?.[0],
            lastName: userData.name.split(' ')?.[1],
            dob: new Date(),
            gender:userData.gender,
            DOB: userData.dob,
            country:userData.country,
            email: userData.email
        },
        validationSchema: RegisterSchema,
        
        onSubmit: async (values, { setErrors, setSubmitting  }) => {
            dispatch(updateOnboarding({loading:true}))
            updateOnboarding({
                name: values.firstName + ' ' + values.lastName,
                DOB: values.dob,
                email:values.email,
                gender:values.gender,
                country:values.country
            })
            checkUserExistance({email: values.email}).then(()=>{
                dispatch(updateOnboarding({loading:false}))
                return setErrors({
                    email: 'This email is already registered with us',
                })

            }).catch(err=>{
                dispatch(updateOnboarding({loading:false}))
                dispatch(
                    updateOnboarding({
                        name: values.firstName + ' ' + values.lastName,
                        DOB: values.dob,
                        email:values.email,
                        gender:values.gender,
                        country:values.country
                    })
                )
                navigate(
                    `/onboarding/${
                        mode == 'client' ? 'client/client-info' : 'profile-pic'
                    }`,
                    { state }
                )
            })
            
        },
    })
    console.log(state)
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik

    console.log(errors,"all errors",values)
    return (
        <Page title=" Simplified Online Fitness Training ">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Container>
                        <Header
                            title={'Create profile'}
                            onClose={() => navigate('/', { state })}
                        />
                        <Content
                            display={'flex'}
                            height={'100%'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            flexGrow={'1'}
                            px={2}
                        >
                          
                            <Typography
                                variant="h2"
                                align="left"
                                sx={{ my: 4 }}
                            >
                                Personal information
                            </Typography>

                            <Stack spacing={2} sx={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    clabel={
                                        <Typography variant="subtitle1">
                                            First name
                                           
                                        </Typography>
                                    }
                                    {...getFieldProps('firstName')}
                                    placeholder={"Write your first name"}
                                    error={Boolean(
                                        touched.firstName && errors.firstName
                                    )}
                                    helperText={
                                        touched.firstName && errors.firstName
                                    }
                                />

                                <TextField
                                    fullWidth
                                    placeholder={"Write your last name"}
                                    clabel={
                                        <Typography variant="subtitle1">
                                            Last name
                                            {/* <Typography component={"span"} color={"error"}>
                        *
                      </Typography> */}
                                        </Typography>
                                    }
                                    {...getFieldProps('lastName')}
                                    error={Boolean(
                                        touched.lastName && errors.lastName
                                    )}
                                    helperText={
                                        touched.lastName && errors.lastName||"Make sure your name matches government ID for verifications and credibility"
                                    }
                                />
                                   <Grid container>
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1">
                                            Your Birthday
                                            {/* <Typography component={"span"} color={"error"}>
                        *
                      </Typography> */}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ pr: 1 }}>
                                        <MuiLocalizationProvider dateAdapter={MuiAdapterDateFns}>
                                            <MuiDatePicker
                                                label="Date of Birth"
                                                value={values.dob}
                                                onChange={(newValue) => {
                                                    setFieldValue('dob', newValue)
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </MuiLocalizationProvider>
                                    </Grid>
                                </Grid>
                            
                            <Box>
                                <Typography variant="subtitle1" color="text.primary">
                                    Gender
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    {...getFieldProps('gender')}
                                    value={values?.gender}
                                    onChange={(event) => setFieldValue('gender', event.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    error={Boolean(touched.gender && errors.gender)}
                                    helperText={touched.gender && errors.gender}
                                >
                                    <option value="" disabled>
                                        Select your gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                 
                                </TextField>
                            </Box>
                             
                                {<CountrySelect
                                    fullWidth
                                    clabel={
                                        <Typography variant="subtitle1">
                                           Location
                                            {/* <Typography component={"span"} color={"error"}>
                        *
                      </Typography> */}
                                        </Typography>
                                    }
                                    {...getFieldProps('country')}
                                    value={values.country}
                                    setFieldValue={(val)=>setFieldValue('country',val)}
                                    error={Boolean(
                                        errors.country
                                    )}
                                    helperText={
                                         errors.country
                                    }
                                />}
                                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    // label="For mobile"
                    disableOpenPicker
                    {...getFieldProps("dob")}
                    inputFormat="dd/MM/yyyy"
                    error={Boolean(touched.dob && errors.dob)}
                    helperText={touched.dob && errors.dob}
                    onChange={(newValue) => {
                      setFieldValue("dob", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        placeholder=""
                        clabel={
                          <Typography variant="subtitle1">
                            Your Birthday
                          
                          </Typography>
                        }
                      />
                    )}
                  />
                </LocalizationProvider> */}
                                <br />
                            </Stack>
                        </Content>
                        <FooterBase>
                            <Footer next back backClick={() => navigate(-1)} />
                        </FooterBase>
                    </Container>
                </Form>
            </FormikProvider>
        </Page>
    )
}
