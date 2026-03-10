// @mui
import { styled } from '@mui/material/styles'

// components
import Page from 'src/components/Page'
// sections
import { Box, Typography, Stack,  Button,Checkbox} from '@mui/material'


import { useLocation, useNavigate } from 'react-router'
import TextField from 'src/components/core/LabeledInput'

import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import FooterBase from 'src/components/Layout/Footer'

import Logo from 'src/assets/figgslogo.png'

// ----------------------------------------------------------------------
import Header from 'src/components/onboarding/header'
import { useState } from 'react'
import { updateFeedback } from 'src/redux/actions/feedback'
import { sendinvitation } from 'src/redux/actions/invite'
export default function HomePage({ mode }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    const [confirmed,setConfirmed]=useState(false)
    const InviteSchema = Yup.object().shape({
 
        email:Yup.string().email("enter a valid email").required('Email is required'),
        message: Yup.string().nullable(),

    })
    let userData = useSelector((s) => s.Onboarding)
    const formik = useFormik({
        initialValues: {
   
            email: ''
        },
        validationSchema: InviteSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
        
            dispatch(sendinvitation(values)).then((res)=>{
            
                dispatch({
                    type: 'UPDATE_FEED',
                    payload: {
                        loading: false,
                        snackbar: true,
                        message:'Invitation sent successfully',
                        severity: 'success',
                    },
                })
                navigate(-1)

            }).catch(err=>{
                dispatch({
                    type: 'UPDATE_FEED',
                    payload: {
                        loading: false,
                        snackbar: true,
                        message:'Oops caught some error! Please try again',
                        severity: 'error',
                    },
                })
            
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

    return (
        <Page title=" Simplified Online Fitness Training ">
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Container>
                        <Header
                            title={'Invite client'}
                            onClose={() => navigate(-1, { state })}
                        />
                        <Content
                            display={'flex'}
                            height={'100%'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            flexGrow={'1'}
                            px={2}
                        >
                            <Box
                                display={'flex'}
                                justifyContent="center"
                                alignItems={'center'}
                                mt={4}
                            >
                                <img src={Logo} height={46} />
                            </Box>
                            <Typography
                                variant="h3"
                                align="left"
                                sx={{ mt: 6 ,mb:1}}
                            >
                                Enter your clients email address
                            </Typography>
                            <Typography color={"text.secondary"}>
                            By entering the clients email address you <br/>
will invite him to your client list
                            </Typography>

                            <Stack spacing={2} mt={2} sx={{ width: '100%' }}>
                                <TextField
                                    fullWidth
                                    placeholder={"Example@email.com"}
                                    clabel={
                                        <Typography variant="subtitle1">
                                           Email
                                            {/* <Typography component={"span"} color={"error"}>
                        *
                      </Typography> */}
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

                                <TextField
                                    fullWidth
                                    placeholder={"Write something"}

                                    clabel={
                                        <Typography variant="subtitle1" sx={{display:"flex",alignItems:"center"}}>
                                            Message <Typography variant='text2' color={"text.secondary"}>
                                               &nbsp; optional
                                            </Typography>
                                            {/* <Typography component={"span"} color={"error"}>
                        *
                      </Typography> */}
                                        </Typography>
                                    }
                                    multiline
                                    minRows={6}
                                    {...getFieldProps('message')}
                                    error={Boolean(
                                        touched.message && errors.message
                                    )}
                                    helperText={
                                        touched.message && errors.message
                                    }
                                />
                                  
                            </Stack>
                        </Content>
                        <FooterBase>
                            <Box px={2}>
                                <Typography sx={{alignItems:"center"}}>
                                    <Checkbox checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} />
                                I confirm all of the information above is correct.
                                </Typography>
                            </Box>
                            <Box display={"flex"} justifyContent={"flex-end"} px={2} py={2} pt={1}>
                            <Button 
                            variant='contained' 
                            type='submit'
                            sx={{px:4}}
                            disabled={!confirmed}
                            >Send</Button>
                            </Box>
                           
                            {/* <Footer next back backClick={() => navigate(-1)} /> */}
                        </FooterBase>
                    </Container>
                </Form>
            </FormikProvider>
        </Page>
    )
}
