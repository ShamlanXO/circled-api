// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
// sections
import { Box, Typography, Stack, ButtonBase } from '@mui/material'
import axios from '../../../utils/axios'
import api from '../../../utils/api'
import Footer from '../../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'
import TextField from '../../../components/core/LabeledInput'
import PasswordField from '../../../components/core/PasswordInput'
// ----------------------------------------------------------------------
import Header from '../../../components/onboarding/header'
import { updateFeedback } from '../../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../../redux/actions/Onboarding'
import Container from '../../../components/Layout/Container'
import FooterBase from '../../../components/Layout/Footer'
import Content from '../../../components/Layout/Content'
import HeaderBase from '../../../components/Layout/Header'
import { useState } from 'react'
import ResetPasswordComponent from 'src/components/ResetPassword/ResetPassword'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
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

export default function ForgotPasswordPage() {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const rePass =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/

    const navigate = useNavigate()

    const [formEmail, setFormEmail] = useState('')
    const EmailSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
    })

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: EmailSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setSubmitting(true)
            dispatch(
                updateFeedback({
                    loading: true,
                })
            )
            axios
                .post(
                    `${api.protocol}${api.baseUrl}${api.ChangePasswordMail2}`,
                    {
                        email: values.email,
                    }
                )
                .then((response) => {
                    console.log(response.data)

                    setFormEmail(values.email)
                })
                .catch((err) => {
                    console.error(err)
                })
                .finally(() => {
                    dispatch(
                        updateFeedback({
                            loading: false,
                        })
                    )
                    setSubmitting(false)
                })

            setFormEmail(values.email)
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
            {!formEmail ? (
                <RootStyle>
                    <FormikProvider value={formik}>
                        <Form
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <Container>
                                <HeaderBase>
                                    <Header
                                        title={'Forgot Password ?'}
                                        onClose={() => navigate(-1)}
                                    />
                                </HeaderBase>
                                <Content>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        alignItems={'center'}
                                        justifyContent="center"
                                        px={2}
                                        flexGrow={'1'}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            color={'primary'}
                                            sx={{ mb: 4 }}
                                        >
                                            Follow these steps to recover your
                                            account
                                        </Typography>

                                        <Stack
                                            spacing={2}
                                            sx={{ width: '100%' }}
                                        >
                                            <TextField
                                                fullWidth
                                                placeholder=""
                                                clabel="Email address*"
                                                {...getFieldProps('email')}
                                                error={Boolean(
                                                    touched.email &&
                                                        errors.email
                                                )}
                                                helperText={
                                                    touched.email &&
                                                    errors.email
                                                }
                                            />
                                        </Stack>
                                    </Box>
                                </Content>
                                <FooterBase>
                                    <Footer next />
                                </FooterBase>
                            </Container>
                        </Form>
                    </FormikProvider>
                </RootStyle>
            ) : (
                <ResetPasswordComponent
                    formEmail={formEmail}
                    handleBackToEmail={() => setFormEmail('')}
                />
            )}
        </Page>
    )
}
