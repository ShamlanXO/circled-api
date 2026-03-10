// @mui
import { styled } from '@mui/material/styles'
// components

// sections
import { Box, Stack, Typography, InputAdornment,Button } from '@mui/material'

import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import LabeledInput from '../core/LabeledInput'
import DropDownSelect from '../core/DropdownSelect'
import { useDispatch } from 'react-redux'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import { updateProfile } from 'src/redux/actions/Profile'
import { useFormikContext } from 'formik';
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails'
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProfileUpdateForm(props) {
    const formik = useFormikContext();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const RegisterSchema = Yup.object().shape({
    //     expertise: Yup.string().max(50, 'Profession too long').nullable(),
    //     name: Yup.string().max(50, 'Name too long'),
    //     phone: Yup.string()

    //         .min(10, 'Enter valid phone')
    //         .max(10, 'Enter valid phone')
    //         .nullable(),
    //     dob: Yup.date().nullable(),
    //     bio: Yup.string().max(
    //         800,
    //         'Bio too long. Maximum 800 characters allowed'
    //     ),
    //     goals: Yup.string().nullable(),
    //     trainingExperience: Yup.string().nullable(),
    //     YearsOfTraining: Yup.number()
    //         .min(0, 'Years of training is required')
    //         .max(100, 'Please enter realistic value')
    //         .nullable(),
    //     currentJob: Yup.string().nullable(),
    //     faviroteCardio: Yup.string().nullable(),
    //     activityLevel: Yup.string().nullable(),
    // })

  
    // const formik = useFormik({
    //     initialValues: {
    //         title: '',
    //         name: props.Profile?.name,
    //         expertise: props.Profile?.expertise,
    //         phone: props.Profile?.phone,
    //         dob: props.Profile?.dob,
    //         bio: props.Profile?.bio,
    //         password: '',
    //         gender: props.Profile?.gender,
    //         goals: props.Profile?.goals,
    //         trainingExperience: props.Profile?.trainingExperience,
    //         YearsOfTraining: props.Profile?.YearsOfTraining,
    //         currentJob: props.Profile?.currentJob,
    //         faviroteCardio: props.Profile?.faviroteCardio,
    //         activityLevel: props.Profile?.activityLevel || 'Light',
    //     },
    //     validationSchema: RegisterSchema,
    //     onSubmit: async (values, { setErrors, setSubmitting }) => {
    //         console.log(values)
    //         dispatch(updateProfile({ ...values }))
    //         //   dispatch(
    //         //     updateFeedback({
    //         //       loading: true,
    //         //     })
    //         //   );
    //         // axios
    //         //   .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
    //         //     title: values.title,
    //         //   })
    //         //   .then((response) => {
    //         //   dispatch(
    //         //     updateOnboarding({
    //         //       authType: 1,
    //         //       title: values.title,
    //         //       bio: values.bio,
    //         //       type: null,
    //         //     })
    //         //   );
    //         //   dispatch(
    //         //     updateFeedback({
    //         //       loading: false,
    //         //       snackbar: true,
    //         //       message: "Verification mail sent to your title!",
    //         //       severity: "success",
    //         //     })
    //         //   );
    //         // })
    //         // .catch((error) => {
    //         //   if (error.response.status === 406) {
    //         //   }
    //         // return dispatch(
    //         //   updateFeedback({
    //         //     loading: false,
    //         //     snackbar: true,
    //         //     message: "Acccount with give title address already exists!",
    //         //     severity: "error",
    //         //   })
    //         // );
    //         // else {
    //         // }
    //         // return dispatch(
    //         //   updateFeedback({
    //         //     loading: false,
    //         //     snackbar: true,
    //         //     message: "Oops caught some error! Please try again",
    //         //     severity: "error",
    //         //   })
    //         // );
    //         // });
    //     },
    // })

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
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
           
                {props.mode == 'client' ? (
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <LabeledInput
                            fullWidth
                            placeholder="Your name"
                            clabel="Profile name"
                            {...getFieldProps('profileName')}
                            error={Boolean(touched.profileName && errors.profileName)}
                            helperText={touched.profileName && errors.profileName||"This name will be viewed in your profile for the public"}
                         
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
                                            {(formik.values.profileName + '').length +
                                                '/50'}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <ProgramDescriptionModal
                            fullWidth
                            multiline
                            minRows={3}
                            headerSubTitle="Your goals"
                            placeholder="Write down your fitness and health goals"
                            clabel={
                                <Typography variant="subtitle1">
                                    Goals
                                </Typography>
                            }
                            {...getFieldProps('goals')}
                            error={Boolean(touched.goals && errors.goals)}
                            helperText={touched.goals && errors.goals}
                        >
                            <LabeledInput
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Write down your fitness and health goals"
                                clabel={
                                    <Typography variant="subtitle1">
                                        Goals
                                    </Typography>
                                }
                                {...getFieldProps('goals')}
                                error={Boolean(touched.goals && errors.goals)}
                                helperText={
                                    (touched.goals && errors.goals) ||
                                    'Understanding your goal helps your trainer to design a program that targets your specific needs.'
                                }
                            />
                        </ProgramDescriptionModal>

                        <LabeledInput
                            fullWidth
                            placeholder="Swimming / Crossfit / football"
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

                        <LabeledInput
                            fullWidth
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
                        />

                        <DropDownSelect
                            size={'small'}
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
                                touched.activityLevel && errors.activityLevel
                            )}
                            helperText={
                                (touched.activityLevel &&
                                    errors.activityLevel) ||
                                'An indicator of your current physical activity helps to adjust the intensity of the program to your lifestyle.'
                            }
                        />

                        <LabeledInput
                            fullWidth
                            placeholder="Write here"
                            clabel={
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                    sx={{ fontWeight: 600, display: 'flex' }}
                                >
                                    Current job&nbsp;
                                    <Typography color="text.secondary">
                                        optional
                                    </Typography>
                                </Typography>
                            }
                            {...getFieldProps('currentJob')}
                            error={Boolean(
                                touched.currentJob && errors.currentJob
                            )}
                            helperText={
                                (touched.currentJob && errors.currentJob) ||
                                'This may helps your trainer to possibly include cardio exercises you enjoy.'
                            }
                        />

                        <LabeledInput
                            fullWidth
                            placeholder="Write here"
                            clabel={
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                    sx={{ fontWeight: 600, display: 'flex' }}
                                >
                                    Favirote cardio&nbsp;
                                    <Typography color="text.secondary">
                                        optional
                                    </Typography>
                                </Typography>
                            }
                            {...getFieldProps('faviroteCardio')}
                            error={Boolean(
                                touched.faviroteCardio && errors.faviroteCardio
                            )}
                            helperText={
                                (touched.faviroteCardio &&
                                    errors.faviroteCardio) ||
                                'This aids trainers in crafting a program that seamlessly fits your lifestyle.'
                            }
                        />
                    </Stack>
                ) : (
                    <Stack spacing={3} sx={{ width: '100%' }}>
                        <LabeledInput
                            fullWidth
                            placeholder="Your name"
                            clabel="Profile name"
                            {...getFieldProps('profileName')}
                            error={Boolean(touched.profileName && errors.profileName)}
                            helperText={touched.profileName && errors.profileName||"This name will be viewed in your profile for the public"}
                         
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
                                            {(formik.values.profileName + '').length +
                                                '/50'}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <LabeledInput
                            fullWidth
                            placeholder="Bodybuilding"
                            clabel="expertise"
                            {...getFieldProps('expertise')}
                            error={Boolean(
                                touched.expertise && errors.expertise
                            )}
                            helperText={touched.expertise && errors.expertise}
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
                                            {(formik.values.expertise + '')
                                                .length + '/50'}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <ProgramDescriptionModal
                            headerTitle="About"
                            headerSubTitle="About"
                            fullWidth
                            placeholder="Your Bio"
                            clabel="Bio"
                            {...getFieldProps('bio')}
                            error={Boolean(touched.bio && errors.bio)}
                            helperText={touched.bio && errors.bio}
                            inputProps={{
                                maxLength: 800,
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
                                            {(formik.values.bio + '').length +
                                                '/800'}
                                        </Typography>
                                    </Box>
                                </InputAdornment>
                            }
                            multiline
                            minRows={4}
                        >
                            <LabeledInput
                                fullWidth
                                placeholder="Bio"
                                clabel="Bio"
                                {...getFieldProps('bio')}
                                error={Boolean(touched.bio && errors.bio)}
                                helperText={touched.bio && errors.bio}
                                inputProps={{
                                    maxLength: 800,
                                }}
                                maxRows={6}
                                InputProps={{
                                    endAdornment: (
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
                                                    {(formik.values.bio + '')
                                                        .length + '/800'}
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
                )}{' '}
            </Form>
        </FormikProvider>
    )
}
