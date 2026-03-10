// @mui
import { styled } from '@mui/material/styles'

// components
import Page from '../../components/Page'
import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import Header from 'src/components/Layout/Header'
import LabeledInput from 'src/components/core/LabeledInput'
import { useNavigate, useLocation } from 'react-router'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import Iconify from 'src/components/Iconify'
import { updateFeedback } from 'src/redux/actions/feedback'
import axios from 'src/utils/axios'
import api from 'src/utils/api'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import FeedBackPopup from 'src/components/common/feedbackPopover'
import SatisFactionPopover from 'src/components/common/satisFactionPopover'
import { handleuploadImage } from 'src/utils/uploader'
import {
    Box,
    Typography,
    IconButton,
    Stack,
    InputAdornment,
    Button,
} from '@mui/material'

import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import { useDispatch, useSelector } from 'react-redux'
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11),
    },
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
}))
// ----------------------------------------------------------------------

export default function Contact() {
    const navigate = useNavigate()
    const Profile = useSelector((s) => s.Profile)
    const dispatch = useDispatch()
    const FeedbackSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .max(50, 'Title too long'),
        type: Yup.string().required('Type is required'),
        satisfaction: Yup.string().required('Satisfaction is required'),
        attachment: Yup.string().required('Attachment is required'),
        description: Yup.string()
            .required('Description is required')
            .max(1000, 'Description too long'),
    })

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            type: 'Give feedback',
            satisfaction: 'Very satisfied',
            attachment: '',
        },
        validationSchema: FeedbackSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch({
                type: 'UPDATE_FEED',
                payload: {
                    loading: true,
                },
            })
            axios
                .post(api.protocol + api.baseUrl + api.addFeedback, {
                    ...values,
                    email: Profile?.email,
                })
                .then((response) => {
                    dispatch({
                        type: 'UPDATE_FEED',
                        payload: {
                            loading: false,
                            snackbar: true,
                            message: 'Feedback submitted successfully',
                            severity: 'success',
                        },
                    })
                    setSubmitting(false)
                    resetForm()
                })
        },
    })

    const {
        errors,
        touched,
        handleSubmit,
        resetForm,
        isSubmitting,
        isValid,
        validateForm,
        getFieldProps,
        setFieldValue,
        values,
    } = formik
    return (
        <Page title="Contact us">
            <Container>
                <Header
                    style={{
                        borderRadius: '0px 0px 8px 8px',
                        boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
                        overflow: 'hidden',
                    }}
                >
                    <BoxHeader px={2} py={2}>
                        <Box display={'flex'} alignItems={'center'}>
                            {' '}
                            <IconButton
                                onClick={() => navigate(-1)}
                                sx={{ color: 'text.primary' }}
                            >
                                <ArrowLeft />
                            </IconButton>
                            <Typography variant="h6" color="text.primary">
                                Feedback
                            </Typography>{' '}
                        </Box>{' '}
                    </BoxHeader>
                </Header>
                <Content
                    withoutPadding
                    style={{ paddingBottom: 24, background: '#fff' }}
                >
                    <FormikProvider value={formik}>
                        <Form
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <Stack
                                spacing={3}
                                sx={{ width: '100%', px: 2, py: 3 }}
                            >
                                <Typography
                                    color={'text.secondary'}
                                    component={'span'}
                                >
                                    Share Your Feedback & Ideas! <br />
                                    We value your input! Let us know your
                                    thoughts and ideas to help us improve. Your
                                    feedback is important to us. Go to{' '}
                                    <Typography
                                        component={'span'}
                                        color="primary.main"
                                        onClick={() => navigate('/help')}
                                    >
                                        Help & support
                                    </Typography>{' '}
                                    with any suggestions or questions.
                                </Typography>
                                <Stack direction={'row'} spacing={2}>
                                    <Box width="50%">
                                        <Typography variant="subtitle1" mb={1}>
                                            I would like to
                                        </Typography>{' '}
                                        <FeedBackPopup
                                            selected={formik.values.type}
                                            setSelected={(val) =>
                                                setFieldValue('type', val)
                                            }
                                        />
                                    </Box>

                                    {formik.values.type == 'Give feedback' ? (
                                        <Box width="50%">
                                            <Typography
                                                variant="subtitle1"
                                                mb={1}
                                            >
                                                Satisfaction
                                            </Typography>{' '}
                                            <SatisFactionPopover
                                                selected={
                                                    formik.values.satisfaction
                                                }
                                                setSelected={(val) =>
                                                    setFieldValue(
                                                        'satisfaction',
                                                        val
                                                    )
                                                }
                                            />
                                        </Box>
                                    ) : null}
                                </Stack>

                                <LabeledInput
                                    fullWidth
                                    placeholder="Write title here"
                                    maxLength={50}
                                    clabel="Title"
                                    {...getFieldProps('title')}
                                    error={Boolean(
                                        touched.title && errors.title
                                    )}
                                    helperText={touched.title && errors.title}
                                    inputProps={{
                                        maxLength: 50,
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {/* {(formik.values.title + "").length + "/50"} */}
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <ProgramDescriptionModal
                                    headerTitle="Create program"
                                    headerSubTitle="Tell us"
                                    fullWidth
                                    placeholder="Write here the details."
                                    clabel="Tell us"
                                    {...getFieldProps('description')}
                                    error={Boolean(
                                        touched.description &&
                                            errors.description
                                    )}
                                    helperText={
                                        touched.description &&
                                        errors.description
                                    }
                                    multiline
                                    minRows={6}
                                    inputProps={{
                                        maxLength: 1000,
                                    }}
                                    endAdornment={
                                        <InputAdornment
                                            position="end"
                                            sx={{ height: '100%', pt: 4 }}
                                        >
                                            <Box
                                                position={'absolute'}
                                                bottom={12}
                                                right={16}
                                                height={'100%'}
                                                display={'flex'}
                                                flexDirection="column"
                                                justifyContent={'flex-end'}
                                                // marginTop={10}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {(
                                                        formik.values
                                                            .description + ''
                                                    ).length + '/1000'}
                                                </Typography>
                                            </Box>
                                        </InputAdornment>
                                    }
                                    // InputProps={{

                                    // }}
                                >
                                    <LabeledInput
                                        fullWidth
                                        placeholder="Write here the details."
                                        clabel="Tell us"
                                        {...getFieldProps('description')}
                                        error={Boolean(
                                            touched.description &&
                                                errors.description
                                        )}
                                        helperText={
                                            touched.description &&
                                            errors.description
                                        }
                                        multiline
                                        minRows={6}
                                        inputProps={{
                                            maxLength: 1000,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{
                                                        height: '100%',
                                                        pt: 2,
                                                    }}
                                                >
                                                    <Box
                                                        position={'absolute'}
                                                        bottom={12}
                                                        right={16}
                                                        height={'100%'}
                                                        display={'flex'}
                                                        flexDirection="column"
                                                        justifyContent={
                                                            'flex-end'
                                                        }
                                                        // marginTop={10}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {(
                                                                formik.values
                                                                    .description +
                                                                ''
                                                            ).length + '/1000'}
                                                        </Typography>
                                                    </Box>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </ProgramDescriptionModal>

                                <Box>
                                    <Typography variant="subtitle1" mb={1}>
                                        Attach file
                                    </Typography>{' '}
                                    <Box
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        onClick={() =>
                                            document
                                                .getElementById('attachment')
                                                .click()
                                        }
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            border: '1.5px dashed #2F86EB',
                                            borderColor: 'primary.main',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {formik.values.attachment ? (
                                            <Typography
                                                variant="caption"
                                                align="center"
                                            >
                                                1 file attached
                                            </Typography>
                                        ) : (
                                            <Iconify
                                                icon="teenyicons:attach-outline"
                                                color="primary.main"
                                                sx={{ fontSize: 32 }}
                                            />
                                        )}
                                    </Box>
                                    <input
                                        type="file"
                                        id="attachment"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            dispatch(
                                                updateFeedback({
                                                    loading: true,
                                                })
                                            )
                                            handleuploadImage(
                                                e,
                                                'feedback',
                                                ''
                                            ).then((res) => {
                                                setFieldValue(
                                                    'attachment',
                                                    res.data.Location
                                                )
                                                dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                    })
                                                )
                                            })
                                        }}
                                        cropShape={'rect'}
                                        aspect={2.4}
                                    />
                                </Box>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                >
                                    {' '}
                                    Submit
                                </Button>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </Content>
            </Container>
        </Page>
    )
}
