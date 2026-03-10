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

import { useNavigate, useLocation } from 'react-router'

import PasswordField from '../../components/core/PasswordInput'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import Container from '../../components/Layout/Container'

import Content from '../../components/Layout/Content'

import { useConfirmationModalContext } from '../../utils/Modal'
import LabeledPhoneInput from 'src/components/core/PhoneInput'
import { checkUserExistance } from 'src/redux/actions/common'
import { useState } from 'react'
import Logo from '../../assets/figgslogo.png'
import Iconify from 'src/components/Iconify'
const RootStyle = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    height: '100vh',
}))



// ----------------------------------------------------------------------

export default function Onboarding({ mode }) {
    const { state } = useLocation()

   
        return <EnterPhone mode={mode} />
  
}

const EnterPhone = ({ mode }) => {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    const [existMail, setExistMail] = useState('')
    const RegisterSchema = Yup.object().shape({
        phone: Yup.string()
          
            .required('Mobile is required'),
    })

    const formik = useFormik({
        initialValues: {
            phone: state?.phone || '',
            channel:"whatsapp"
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting },name) => {
         
            setExistMail('')
            setSubmitting(true)
            dispatch(
                updateFeedback({
                    loading: true,
                })
            )
            
                        dispatch(
                            updateOnboarding({
                                phone: values.phone,
                            })
                        )
                    
              
                
                   
                

                    if (!state?.token)
                        axios
                            .get(
                                `${api.protocol}${api.baseUrl}${api.sendOtp}${values.phone}&channel=${values.channel}`,
                                
                            )
                            .then((response) => {
                                dispatch(
                                    updateOnboarding({
                                        authType: '1',
                                        phone: values.phone,
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
                                                    'Verification message sent to your mobile number!',
                                                severity: 'success',
                                            })
                                        )
                                }
                                navigate(
                                    `/onboarding/${
                                        mode == 'client' ? 'client/' : ''
                                    }${false ? 'info' : 'verification'}`,
                                    { state:{...state,type:"phone",authType:response.data.type} }
                                )
                            })
                            .catch((error) => {
                                
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
                                email: values.phone,
                                password: values.password,
                                token: state?.token,
                            })
                        )
                        navigate(
                            `/onboarding/${mode == 'client' ? 'client/' : ''}${
                                state?.phone ? 'info' : 'verification'
                            }`,
                            { state:{...state,type:"phone"} }
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

    console.log(errors)
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
                                <Typography variant='h2' sx={{mt:4}}>
                                Enter your mobile<br/>
number
                                </Typography>
                               
                                    <Typography
                                        align="left"
                                        color={'text.secondary'}
                                        component={'span'}
                                        sx={{ my: 4 ,mt:2}}
                                    >
                                      We will send you verification code to the<br/>
number you entered
                                    </Typography>
                               
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <LabeledPhoneInput
                                        fullWidth
                                      
                                      
                                        clabel={
                                            <Typography variant="subtitle1">
                                                Phone number
                                            </Typography>
                                        }
                                        setFieldValue={setFieldValue}
                                        {...getFieldProps('phone')}

                                        error={ errors.phone
                                        }
                                        helperText={
                                            touched.phone && errors.phone
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
                                    size='large'
                                   onClick={()=>{formik.setFieldValue('channel',"whatsapp");handleSubmit()}}
                                    name="whatsapp"
                                >
                                 <Iconify icon="ic:baseline-whatsapp" sx={{fontSize:28,mr:1}}/>  Receive code by WhatsApp
                                </Button>
                                <Box sx={{my:3,mb:2}}>
                                <Divider>
                                        <Typography color={'text.secondary'}>
                                            OR
                                        </Typography>
                                    </Divider></Box>
                                    <Button  onClick={()=>{formik.setFieldValue('channel',"sms");handleSubmit()}}>
                            Receive code via sms
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
//         phone: Yup.string()
//             .phone('phone must be a valid phone number')
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
