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
import Iconify from '../Iconify'

import ButtonBase from '@mui/material/ButtonBase'
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile'
// ----------------------------------------------------------------------

// --
const UploadBox = styled(Box)(({ theme }) => ({
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: `1px dashed ${theme.palette.primary.main}`,
    borderRadius: 12,
    cursor: 'pointer',
}))

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
            <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                display={"flex"}
                                alignItems={"center"}
                                sx={{mb:2}}
                            >
                             Health profile
                            </Typography>
                            <Stack spacing={3} sx={{ width: '100%' }}>
                                {props.measurements}
                    <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Medical Condition"
                        {...getFieldProps('healthInfo.medicalCondition')}
                        error={Boolean(
                            touched.healthInfo?.medicalCondition && errors.healthInfo?.medicalCondition
                        )}
                        helperText={
                            touched.healthInfo?.medicalCondition && errors.healthInfo?.medicalCondition||`Ensures a safe, tailored fitness plan by accounting 
                            for existing health issues and medical conditions.`
                        }
                        InputProps={{
                            style: {
                                //backgroundColor: "#E1E7F0",
                            },
                        }}
                    />
                     <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Medications"
                        {...getFieldProps('healthInfo.medication')}
                        error={Boolean(
                            touched.healthInfo?.medication && errors.healthInfo?.medication
                        )}
                        helperText={
                            touched.healthInfo?.medication && errors.healthInfo?.medication||`Guides the trainer in adapting the program based
                            on medication influences.`
                        }
                        InputProps={{
                            style: {
                                //backgroundColor: "#E1E7F0",
                            },
                        }}
                    />
                    <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Injuries"
                        {...getFieldProps('healthInfo.injuries')}
                        error={Boolean(touched.injuries && errors.healthInfo?.injuries)}
                        helperText={touched.injuries && errors.healthInfo?.injuries||`Prevents exercise-related harm by modifying workouts 
                        for past and current injuries.`}
                        InputProps={{
                            style: {
                                // backgroundColor: "#E1E7F0",
                            },
                        }}
                    />
                     <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Family health history"
                        {...getFieldProps('healthInfo.history')}
                        error={Boolean(
                            touched.healthInfo?.medicalCondition && errors.healthInfo?.history
                        )}
                        helperText={
                            touched.healthInfo?.history && errors.healthInfo?.history||`Guides a proactive fitness plan, considering genetic
                            predispositions and health risks.`
                        }
                        InputProps={{
                            style: {
                                //backgroundColor: "#E1E7F0",
                            },
                        }}
                    />
                    <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Alergies and reactions"
                        {...getFieldProps('healthInfo.allergiesAndReactions')}
                        error={Boolean(
                            touched.healthInfo?.allergiesAndReactions &&
                                errors.healthInfo?.allergiesAndReactions
                        )}
                        helperText={
                            (touched.allergiesAndReactions &&
                            errors.healthInfo?.allergiesAndReactions)||`
                            Ensures a secure workout environment by 
preventing allergic reactions.
                            `
                        }
                        InputProps={{
                            style: {
                                // backgroundColor: "#E1E7F0",
                            },
                        }}
                    />{' '}

                     <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Supplements"
                        {...getFieldProps('healthInfo.supplements')}
                        error={Boolean(
                            touched.healthInfo?.supplements &&
                                errors.healthInfo?.supplements
                        )}
                        helperText={
                            (touched.supplements &&
                            errors.healthInfo?.supplements)||`
                            Customizes dietary advice, avoiding conflicts with 
the fitness program.
                            `
                        }
                        InputProps={{
                            style: {
                                // backgroundColor: "#E1E7F0",
                            },
                        }}
                    />{' '}
                    <ProgramDescriptionModal
                        fullWidth
                        placeholder="Write here"
                        headerSubTitle="Additional Notes"
                        multiline={true}
                        minRows={3}
                        {...getFieldProps('healthInfo.medicalNotes')}
                        error={Boolean(
                            touched.healthInfo?.medicalNotes && errors.healthInfo?.medicalNotes
                        )}
                        helperText={touched.medicalNotes && errors.healthInfo?.medicalNotes}
                        InputProps={{
                            style: {
                                // backgroundColor: "#E1E7F0",
                            },
                        }}
                    >
                        <LabeledInput
                            fullWidth
                            placeholder="Write here"
                            clabel="Additional Notes"
                            multiline={true}
                            minRows={3}
                            maxRows={5}
                            {...getFieldProps('healthInfo.medicalNotes')}
                            error={Boolean(
                                touched.healthInfo?.medicalNotes && errors.healthInfo?.medicalNotes
                            )}
                            helperText={
                                touched.healthInfo?.medicalNotes && errors.healthInfo?.medicalNotes
                            }
                            InputProps={{
                                style: {
                                    // backgroundColor: "#E1E7F0",
                                },
                            }}
                        />
                    </ProgramDescriptionModal>
                    {/* <Stack>
                        <Typography sx={{ pb: 1, pl: 1, fontWeight: 600 }}>
                            Documents
                        </Typography>
                        <UploadBox>
                            <ButtonBase>
                                <Iconify
                                    icon="eva:arrow-circle-up-outline"
                                    width="24px"
                                    height="24px"
                                    color="primary.main"
                                />
                                &nbsp;
                                <Typography variant="subtitle1" color="primary">
                                    Upload
                                </Typography>
                            </ButtonBase>
                        </UploadBox>
                    </Stack> */}
                </Stack>
            </Form>
        </FormikProvider>
    )
}
