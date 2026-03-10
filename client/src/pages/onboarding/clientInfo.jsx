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
        goals: Yup.string().max(250, 'You have reached the limit'),
      
    })
    let userData = useSelector((s) => s.Onboarding)
    const formik = useFormik({
        initialValues: {
            goals: '',
           
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
                `/onboarding/${mode == 'client' ? 'client/' : ''}client-info2`,
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
                                Personal fitness
                            </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={6}
                                            inputProps={{
                                                maxLength: 250,
                                            }}
                                            placeholder="Write down your fitness and health goals"
                                            clabel={
                                                <Typography variant="subtitle1">
                                                    Goals
                                                </Typography>
                                            }
                                            {...getFieldProps('goals')}
                                            error={Boolean(
                                                touched.goals && errors.goals
                                            )}
                                            helperText={
                                                (touched.goals &&
                                                    errors.goals) ||
                                                'Understanding your goal helps your trainer to design a program that targets your specific needs.'
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
