// @mui
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'

// components
import Page from '../../components/Page'
// sections
import {
    Box,
    IconButton,
    InputAdornment,
    Typography,
    Avatar,
    Stack,
} from '@mui/material'
import TextField from '../../components/core/LabeledInput'
import { borderRadius } from '@mui/system'
import { IconButtonAnimate, varFade } from '../../components/animate'
import Iconify from '../../components/Iconify'
import Footer from '../../components/onboarding/footer'
import { useLocation, useNavigate } from 'react-router'
import AddCircleIcon from '../../assets/createProgram/AddIcon'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import axios from '../../utils/axios'
import api from '../../utils/api'
import Input from 'src/components/Labs/Cropper'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import { useSelector } from 'react-redux'
import { initProfile } from 'src/redux/actions/Profile'
import { handleuploadImage } from 'src/utils/uploader'
import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import FooterBase from '../../components/Layout/Footer'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import LabeledInput from 'src/components/core/LabeledInput'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
import Logo from 'src/assets/figgslogo.png'
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

export default function ProfilePic({ mode }) {
    const navigate = useNavigate()
    const { state } = useLocation()
    const Onboarding = useSelector((s) => s.Onboarding)
    const [profilePic, setPic] = useState(Onboarding.profilePic)
    const [about, setAbout] = useState(Onboarding.about)
    const dispatch = useDispatch()
    const ProfileSchema = Yup.object().shape({
        expertise: Yup.string().max(50, 'Profession too long').nullable(),
        profileName:Yup.string().required('Enter name of your profile').max(50),
        bio: Yup.string().max(
            500,
            'Bio too long. Maximum 500 characters allowed'
        ),
    })
    const formik = useFormik({
        initialValues: {
            expertise:Onboarding.expertise,
            profileName:Onboarding.name||Onboarding.profileName,
            bio: Onboarding.bio,
        },
        validationSchema: ProfileSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch(updateOnboarding({ ...values }))
            navigate(
                `/onboarding/${
                    mode == 'client' ? 'client/platform-info' : 'platform-info'
                }`,
                {
                    state,
                }
            )
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
    const uploadImage = (e) => {
        dispatch(updateFeedback({ loading: true }))

        handleuploadImage(e).then(
            (res) => {
                setPic(res.data.Location)
                dispatch(updateFeedback({ loading: false }))
            },
            (rej) => {
                if (rej == 'size')
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message: 'Image size should be less than 5 mb',
                            severity: 'warning',
                        })
                    )
                else
                    return dispatch(
                        updateFeedback({
                            loading: false,
                            snackbar: true,
                            message:
                                'Error in uploading image please try again later',
                            severity: 'warning',
                        })
                    )
            }
        )
    }

    useEffect(() => {
        dispatch(updateOnboarding({ profilePic: profilePic }))
    }, [profilePic, about])

    const handleNext = () => {
        navigate(
            `/onboarding/${
                mode == 'client' ? 'client/platform-info' : 'platform-info'
            }`,
            {
                state,
            }
        )
    }

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Page title=" Simplified Online Fitness Training ">
                    <Input
                        accept="image/*"
                        onChange={uploadImage}
                        id="profile-img"
                        cropShape={'round'}
                        aspect={1}
                        style={{ display: 'none' }}
                    />
                    <Container>
                        <Header
                            title={'Create profile'}
                            onClose={() => navigate('/', { state })}
                        />
                        <Content>
                            <Box
                                display={'flex'}
                                justifyContent="center"
                                alignItems={'center'}
                                mt={4}
                            >
                               <Typography variant="h3" textAlign={'center'} sx={{fontSize:24}}>
                               Your profile image
                                </Typography>
                            </Box>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                pt={2}
                            >
                                <Box
                                    width={'100%'}
                                    display="flex"
                                    justifyContent={'center'}
                                    mt={4}
                                    mb={2}
                                >
                                    <Box
                                        style={{
                                            borderRadius: '50%',
                                            position: 'relative',

                                            backgroundSize: 'cover',
                                        }}
                                        onClick={() =>
                                            document
                                                .getElementById('profile-img')
                                                .click()
                                        }
                                    >
                                        {!profilePic ? (
                                            <Avatar
                                                sx={{ width: 130, height: 130 }}
                                            >
                                                <AccountCircleIcon
                                                    sx={{
                                                        fontSize: 155,
                                                        color: '#E1E7F0',
                                                    }}
                                                />
                                            </Avatar>
                                        ) : (
                                            <Avatar
                                                sx={{ width: 130, height: 130 }}
                                                src={profilePic}
                                            ></Avatar>
                                        )}
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: -13,
                                                right: -8,
                                                color: 'primary.main',
                                            }}
                                        >
                                            <AddCircleIcon
                                                sx={{
                                                    fontSize: 48,
                                                    color: 'primary.main',
                                                }}
                                                color="primary.main"
                                            />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                            {mode == 'client' ? null : (
                                <Stack
                                    spacing={2}
                                    sx={{ width: '100%', mt: 4 }}
                                >
                                     <LabeledInput
                                        fullWidth
                                        placeholder="Profile name"
                                        clabel="Profile name"
                                        {...getFieldProps('profileName')}
                                        error={Boolean(
                                            touched.profileName &&
                                                errors.profileName
                                        )}
                                        helperText={
                                            (touched.profileName &&
                                            errors.profileName)||""
                                        }
                                        inputProps={{ maxLength: 50 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{ height: '100%' }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {(
                                                            formik.values
                                                                .profileName + ''
                                                        ).length + '/50'}
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <LabeledInput
                                        fullWidth
                                        placeholder="Example: Yoga, Crossfit, etc."
                                        clabel="Expertise"
                                        {...getFieldProps('expertise')}
                                        error={Boolean(
                                            touched.expertise &&
                                                errors.expertise
                                        )}
                                        helperText={
                                            touched.expertise &&
                                            errors.expertise
                                        }
                                        inputProps={{ maxLength: 50 }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment
                                                    position="end"
                                                    sx={{ height: '100%' }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {(
                                                            formik.values
                                                                .expertise + ''
                                                        ).length + '/50'}
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <ProgramDescriptionModal
                                        headerTitle="Your bio"
                                        headerSubTitle="About"
                                        fullWidth
                                        placeholder="Write about yourself..."
                                        clabel="About"
                                        {...getFieldProps('bio')}
                                        error={Boolean(
                                            touched.bio && errors.bio
                                        )}
                                        helperText={touched.bio && errors.bio}
                                        inputProps={{
                                            maxLength: 500,
                                        }}
                                        endAdornment={
                                            <InputAdornment
                                                position="end"
                                                sx={{ height: '100%' }}
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
                                                            formik.values.bio +
                                                            ''
                                                        ).length + '/500'}
                                                    </Typography>
                                                </Box>
                                            </InputAdornment>
                                        }
                                        multiline
                                        minRows={4}
                                    >
                                        <LabeledInput
                                            fullWidth
                                            placeholder="Write about yourself..."
                                            clabel="About"
                                            {...getFieldProps('bio')}
                                            error={Boolean(
                                                touched.bio && errors.bio
                                            )}
                                            helperText={
                                                touched.bio && errors.bio
                                            }
                                            inputProps={{
                                                maxLength: 500,
                                            }}
                                            maxRows={12}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment
                                                        position="end"
                                                        sx={{ height: '100%' }}
                                                    >
                                                        <Box
                                                            position={
                                                                'absolute'
                                                            }
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
                                                                    formik
                                                                        .values
                                                                        .bio +
                                                                    ''
                                                                ).length +
                                                                    '/500'}
                                                            </Typography>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            multiline
                                            minRows={8}
                                        />
                                    </ProgramDescriptionModal>
                                </Stack>
                            )}
                        </Content>
                        <FooterBase>
                            <Footer
                                next
                                nextText={
                                    !profilePic &&
                                    !values.bio &&
                                    !values.expertise
                                        ? 'Skip'
                                        : 'Next'
                                }
                            />
                        </FooterBase>
                    </Container>
                </Page>
            </Form>
        </FormikProvider>
    )
}
