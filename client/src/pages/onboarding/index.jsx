// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
// sections
import { Box, Typography, Stack, Button, Divider } from '@mui/material'
import axios from '../../utils/axios'
import api from '../../utils/api'
import Footer from '../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'
import TextField from '../../components/core/LabeledInput'
import PasswordField from '../../components/core/PasswordInput'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import Container from '../../components/Layout/Container'
import FooterBase from '../../components/Layout/Footer'
import Content from '../../components/Layout/Content'
import HeaderBase from '../../components/Layout/Header'
import GoogleLogin from 'react-google-login'
import Iconify from '../../components/Iconify'
import { initProfile } from 'src/redux/actions/Profile'
import { useConfirmationModalContext } from '../../utils/Modal'
import { checkUserExistance } from 'src/redux/actions/common'
import { useState } from 'react'
import Logo from '../../assets/figgslogo.png'
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
const SocialButton = styled(Button)(({ theme }) => ({
    height: 52,
    alignItems: 'center',
    borderRadius: 40,
    background: '#fff',
    border: '1.5px solid #C3CBD9',
    borderColor: '#C3CBD9',
    boxShadow: '0px 4px 4px rgba(43, 64, 87, 0.1)',
    fontFamily: 'Proxima Nova',
    paddingLeft: '12px',
    /* Dark primary / 50% */
    color: '#172A44',
    fontSize: 16,
    fontWeight: 'bold',

    marginBottom: 8,
    border: '1.5px solid ',
}))

// ----------------------------------------------------------------------

export default function Onboarding({ mode }) {
    const { state } = useLocation()
   
        return <EnterEmail mode={mode} />
    
}



const EnterEmail = ({ mode }) => {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    const [existMail, setExistMail] = useState('')
    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
    })

    const formik = useFormik({
        initialValues: {
            email: state?.email || '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setExistMail('')
            setSubmitting(true)
            dispatch(
                updateFeedback({
                    loading: true,
                })
            )
            
                    dispatch(
                        updateFeedback({
                            loading: false,
                        })
                    )
                    dispatch(
                        updateOnboarding({
                            email: values.email,
                        })
                    )

                    setSubmitting(true)
                    dispatch(
                        updateFeedback({
                            loading: true,
                        })
                    )

                    if (!state?.token)
                        axios
                            .post(
                                `${api.protocol}${api.baseUrl}${api.SendVerifyMail}`,
                                {
                                    email: values.email,
                                }
                            )
                            .then((response) => {
                                dispatch(
                                    updateOnboarding({
                                        authType: '1',
                                        email: values.email,
                                        password: values.password,
                                    })
                                )

                                {
                                    true &&
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                snackbar: true,
                                                message:
                                                    'Verification mail sent to your email!',
                                                severity: 'success',
                                            })
                                        )
                                }
                                navigate(
                                    `/onboarding/${
                                        mode == 'client' ? 'client/' : ''
                                    }${false ? 'info' : 'verification'}`,
                                    { state:{...state,authType:response.data.type} }
                                )
                            })
                            .catch((error) => {
                                if (error.response.status === 406)
                                    return dispatch(
                                        updateFeedback({
                                            loading: false,
                                            snackbar: true,
                                            message:
                                                'Account with give email address already exists!',
                                            severity: 'error',
                                        })
                                    )
                                else
                                    return dispatch(
                                        updateFeedback({
                                            loading: false,
                                            snackbar: true,
                                            message:
                                                'Oops caught some error! Please try again',
                                            severity: 'error',
                                        })
                                    )
                            })
                    else {
                        dispatch(
                            updateFeedback({
                                loading: false,
                            })
                        )
                        dispatch(
                            updateOnboarding({
                                authType: 1,
                                email: values.email,
                                password: values.password,
                                token: state?.token,
                            })
                        )
                        navigate(
                            `/onboarding/${mode == 'client' ? 'client/' : ''}${
                                state?.email ? 'info' : 'verification'
                            }`,
                            { state }
                        )
                    }
                    //navigate("/onboarding", { state: { ...state, email: values.email } });
             
        },
    })

    const navigate = useNavigate()
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        setFieldError,
        values,
    } = formik
    return (
        <Page title=" Simplified Online Fitness Training ">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Container>
                        {' '}
                        <Header
                            title={'Create account'}
                            onClose={() => navigate('/', { state })}
                            style={{
                                borderRadius: '32px',
                                backgroundColor: 'white',
                                boxShadow:
                                    '0px 4px 54px rgba(225, 231, 240, 0.5)',
                                overflow: 'hidden',
                            }}
                        />
                        <Content>
                            <Box
                                display={'flex'}
                                justifyContent="center"
                                alignItems={'center'}
                                mt={4}
                            >
                                <img src={Logo} height={46} />
                            </Box>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                flexGrow={'1'}
                            >
                                {existMail ? (
                                    <Typography
                                        align="left"
                                        color={'text.secondary'}
                                        component={'span'}
                                        sx={{ my: 4 }}
                                    >
                                        This account {existMail} already exist.{' '}
                                        <Typography
                                            onClick={() => navigate('/login')}
                                            color={'primary.main'}
                                            component={'span'}
                                        >
                                            Login
                                        </Typography>{' '}
                                        or change email to continue.
                                    </Typography>
                                ) : (
                                    <Typography
                                        align="left"
                                        color={'text.secondary'}
                                        component={'span'}
                                        sx={{ my: 4 }}
                                    >
                                        Well check if you have an account if not{' '}
                                        <br /> you will create one
                                    </Typography>
                                )}
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        disabled={state?.email}
                                        placeholder="Example@email.com"
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Email address
                                            </Typography>
                                        }
                                        {...getFieldProps('email')}
                                        error={Boolean(
                                            touched.email && errors.email
                                        )}
                                        helperText={
                                            touched.email && errors.email
                                        }
                                    />
                                    {/* <PasswordField
                    clabel={
                      <Typography variant="subtitle1">Password</Typography>
                    }
                    fullWidth
                    placeholder=""
                    {...getFieldProps("password")}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <PasswordField
                    clabel={
                      <Typography variant="subtitle1">
                        Confirm Password
                      </Typography>
                    }
                    fullWidth
                    placeholder=""
                    {...getFieldProps("confirmPass")}
                    error={Boolean(touched.confirmPass && errors.confirmPass)}
                    helperText={touched.confirmPass && errors.confirmPass}
                  /> */}
                                </Stack>
                                {/* <Box width={"100%"} my={2}>
                  {" "}
                  <Divider>
                    <Typography color={"text.secondary"} sx={{ px: 1 }}>
                      OR
                    </Typography>
                  </Divider>
                </Box> */}
                                <Button
                                    variant="contained"
                                    sx={{ mt: 4 }}
                                    type="submit"
                                >
                                    Continue
                                </Button>
                            </Box>
                        </Content>
                    </Container>
                </Form>
            </FormikProvider>
        </Page>
    )
}

// const EnterPassword = ({ mode }) => {
//     const dispatch = useDispatch()
//     const { state } = useLocation()
//     const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
//     console.log(state)
//     const RegisterSchema = Yup.object().shape({
//         email: Yup.string()
//             .email('Email must be a valid email address')
//             .required('Email is required'),
//         password: Yup.string()
//             .required('Password is required')

//             .matches(
//                 rePass,
//                 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number'
//             ),

//         confirmPass: Yup.string()
//             .required('confirm password is required')
//             .oneOf([Yup.ref('password'), null], 'Passwords must match'),
//     })

//     const formik = useFormik({
//         initialValues: {
//             email: state?.email || '',
//             password: '',
//             confirmPass: '',
//         },
//         validationSchema: RegisterSchema,
//         onSubmit: async (values, { setErrors, setSubmitting }) => {
//             dispatch(
//                 updateOnboarding({
//                     password: values.password,
//                 })
//             )
//             navigate(
//                 `/onboarding/${mode == 'client' ? 'client/info' : 'preview'}`,
//                 {
//                     state: { ...state, token: state?.token },
//                 }
//             )
//         },
//     })
//     const modalContext = useConfirmationModalContext()

//     const navigate = useNavigate()
//     const {
//         errors,
//         touched,
//         handleSubmit,
//         isSubmitting,
//         getFieldProps,
//         setFieldValue,
//         values,
//     } = formik
//     return (
//         <Page title=" Simplified Online Fitness Training ">
//             <FormikProvider value={formik}>
//                 <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
//                     <Container>
//                         <Header
//                             title={'Create account'}
//                             onClose={() => navigate('/', { state })}
//                         />

//                         <Content>
//                             <Box
//                                 display={'flex'}
//                                 justifyContent="center"
//                                 alignItems={'center'}
//                                 mt={4}
//                             >
//                                 <Typography
//                                     variant="h3"
//                                     sx={{ color: 'grey.700' }}
//                                 >
//                                     Circled.fit
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         ml: 1,
//                                         px: 1,
//                                         backgroundColor: 'primary.lighter',
//                                         borderRadius: '30px',
//                                     }}
//                                 >
//                                     {' '}
//                                     <Box
//                                         sx={{
//                                             color: 'primary.main',
//                                             fontSize: 10,
//                                             py: 0.3,
//                                         }}
//                                     >
//                                         Beta
//                                     </Box>
//                                 </Box>
//                             </Box>
//                             <Box
//                                 display={'flex'}
//                                 alignItems={'center'}
//                                 flexDirection={'column'}
//                                 flexGrow={'1'}
//                             >
//                                 <Typography
//                                     align="left"
//                                     color={'text.secondary'}
//                                     sx={{ my: 4 }}
//                                 >
//                                     You are creating an account as
//                                     <Typography
//                                         align="center"
//                                         color={'text.primary'}
//                                     >
//                                         {state.email}
//                                     </Typography>
//                                 </Typography>
//                                 <Stack spacing={2} sx={{ width: '100%' }}>
//                                     {/* <TextField
//                     fullWidth
//                     disabled={state?.email}
//                     placeholder=""
//                     clabel={
//                       <Typography variant="subtitle1">
//                         Your email address
//                       </Typography>
//                     }
//                     {...getFieldProps("email")}
//                     error={Boolean(touched.email && errors.email)}
//                     helperText={touched.email && errors.email}
//                   /> */}
//                                     <PasswordField
//                                         clabel={
//                                             <Typography variant="subtitle1">
//                                                 Password
//                                             </Typography>
//                                         }
//                                         fullWidth
//                                         placeholder=""
//                                         {...getFieldProps('password')}
//                                         error={Boolean(
//                                             touched.password && errors.password
//                                         )}
//                                         helperText={
//                                             touched.password && errors.password
//                                         }
//                                     />
//                                     <PasswordField
//                                         clabel={
//                                             <Typography variant="subtitle1">
//                                                 Confirm Password
//                                             </Typography>
//                                         }
//                                         fullWidth
//                                         placeholder=""
//                                         {...getFieldProps('confirmPass')}
//                                         error={Boolean(
//                                             touched.confirmPass &&
//                                                 errors.confirmPass
//                                         )}
//                                         helperText={
//                                             touched.confirmPass &&
//                                             errors.confirmPass
//                                         }
//                                     />
//                                 </Stack>
//                                 <Button
//                                     variant="contained"
//                                     fullWidth
//                                     sx={{ mt: 4 }}
//                                     type="submit"
//                                 >
//                                     Continue
//                                 </Button>
//                             </Box>
//                         </Content>
//                         {/* <FooterBase>
//               <Footer next />
//             </FooterBase> */}
//                     </Container>
//                 </Form>
//             </FormikProvider>
//         </Page>
//     )
// }


// const EnterPasswordPhone = ({ mode }) => {
//     const dispatch = useDispatch()
//     const { state } = useLocation()
//     const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
//     console.log(state)
//     const RegisterSchema = Yup.object().shape({
//         email:Yup.string().email("Enter a valid email").required("Enter a valid email"),
//         phone: Yup
//             .string('Email must be a valid email address')
//             .required('Email is required'),
//         password: Yup.string()
//             .required('Password is required')

//             .matches(
//                 rePass,
//                 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number'
//             ),

//         confirmPass: Yup.string()
//             .required('confirm password is required')
//             .oneOf([Yup.ref('password'), null], 'Passwords must match'),
//     })

//     const formik = useFormik({
//         initialValues: {
//             phone: state?.phone || '',
//             password: '',
//             confirmPass: '',
//             email:""
//         },
//         validationSchema: RegisterSchema,
//         onSubmit: async (values, { setErrors, setSubmitting,setFieldError }) => {

//             checkUserExistance({email:values.email})
//             .then((res) => {
//                 if (res.data) {
                  
//                 } else {
//                     dispatch(
//                         updateFeedback({
//                             loading: false,
//                         })
//                     )

//                     setFieldError('email', 'email already exists')
                    
//                 }
//             })
//             .catch((err) => {
               
//                 dispatch(
//                     updateFeedback({
//                         loading: false,
//                     })
//                 )
//                 dispatch(
//                     updateOnboarding({
//                         password: values.password,
//                         email:values.email
//                     })
//                 )
//                 navigate(
//                     `/onboarding/${mode == 'client' ? 'client/info' : 'preview'}`,
//                     {
//                         state: { ...state,  email:values.email,token: state?.token },
//                     }
//                 )
//                 //navigate("/onboarding", { state: { ...state, email: values.email } });
//             })
            
//         },
//     })
//     const modalContext = useConfirmationModalContext()

//     const navigate = useNavigate()
//     const {
//         errors,
//         touched,
//         handleSubmit,
//         isSubmitting,
//         getFieldProps,
//         setFieldValue,
//         values,
//     } = formik
//     return (
//         <Page title=" Simplified Online Fitness Training ">
//             <FormikProvider value={formik}>
//                 <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
//                     <Container>
//                         <Header
//                             title={'Create account'}
//                             onClose={() => navigate('/', { state })}
//                         />

//                         <Content>
//                             <Box
//                                 display={'flex'}
//                                 justifyContent="center"
//                                 alignItems={'center'}
//                                 mt={4}
//                             >
//                                 <Typography
//                                     variant="h3"
//                                     sx={{ color: 'grey.700' }}
//                                 >
//                                     Circled.fit
//                                 </Typography>
//                                 <Box
//                                     sx={{
//                                         ml: 1,
//                                         px: 1,
//                                         backgroundColor: 'primary.lighter',
//                                         borderRadius: '30px',
//                                     }}
//                                 >
//                                     {' '}
//                                     <Box
//                                         sx={{
//                                             color: 'primary.main',
//                                             fontSize: 10,
//                                             py: 0.3,
//                                         }}
//                                     >
//                                         Beta
//                                     </Box>
//                                 </Box>
//                             </Box>
//                             <Box
//                                 display={'flex'}
//                                 alignItems={'center'}
//                                 flexDirection={'column'}
//                                 flexGrow={'1'}
//                             >
//                                 <Typography
//                                     align="left"
//                                     color={'text.secondary'}
//                                     sx={{ my: 4 }}
//                                 >
//                                     You are creating an account as
//                                     <Typography
//                                         align="center"
//                                         color={'text.primary'}
//                                     >
//                                         {state.email}
//                                     </Typography>
//                                 </Typography>
//                                 <Stack spacing={2} sx={{ width: '100%' }}>
//                                     <TextField
//                     fullWidth
//                     disabled={state?.email}
//                     placeholder=""
//                     clabel={
//                       <Typography variant="subtitle1">
//                         Your email address
//                       </Typography>
//                     }
//                     {...getFieldProps("email")}
//                     error={Boolean(touched.email && errors.email)}
//                     helperText={touched.email && errors.email}
//                   />
//                                     <PasswordField
//                                         clabel={
//                                             <Typography variant="subtitle1">
//                                                 Password
//                                             </Typography>
//                                         }
//                                         fullWidth
//                                         placeholder=""
//                                         {...getFieldProps('password')}
//                                         error={Boolean(
//                                             touched.password && errors.password
//                                         )}
//                                         helperText={
//                                             touched.password && errors.password
//                                         }
//                                     />
//                                     <PasswordField
//                                         clabel={
//                                             <Typography variant="subtitle1">
//                                                 Confirm Password
//                                             </Typography>
//                                         }
//                                         fullWidth
//                                         placeholder=""
//                                         {...getFieldProps('confirmPass')}
//                                         error={Boolean(
//                                             touched.confirmPass &&
//                                                 errors.confirmPass
//                                         )}
//                                         helperText={
//                                             touched.confirmPass &&
//                                             errors.confirmPass
//                                         }
//                                     />
//                                 </Stack>
//                                 <Button
//                                     variant="contained"
//                                     fullWidth
//                                     sx={{ mt: 4 }}
//                                     type="submit"
//                                 >
//                                     Continue
//                                 </Button>
//                             </Box>
//                         </Content>
//                         {/* <FooterBase>
//               <Footer next />
//             </FooterBase> */}
//                     </Container>
//                 </Form>
//             </FormikProvider>
//         </Page>
//     )
// }