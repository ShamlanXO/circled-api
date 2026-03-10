// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    ButtonBase,
    InputAdornment,
    Radio,
    Stack,
    Typography,
} from '@mui/material'

import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import axios from 'axios'
import api from 'src/utils/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import LabeledInput from '../core/LabeledInput'
import { MobileDatePicker } from '@mui/lab'

import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import { useDispatch } from 'react-redux'
// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    height: '100%',
}))

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

export default function BodySystemForm({ data, setData, saveData,Profile,updateOnboarding,part1,part2 }) {
    const navigate = useNavigate()
    const RegisterSchema = Yup.object().shape({
        medicalCondition: Yup.string().max(100, 'Too long').nullable(),
        injuries: Yup.string().max(100, 'Too long').nullable(),
        allergiesAndReactions: Yup.string().max(100, 'Too long').nullable(),
        medications: Yup.string().max(100, 'Too long').nullable(),
        supplements: Yup.string().max(100, 'Too long').nullable(),
        medicalNotes: Yup.string().max(100, 'Too long').nullable(),
        history: Yup.string().nullable(),
    })

    const [filePicked, setFilePicked] = useState(null)
    const formik = useFormik({
        initialValues: {
            medicalCondition: '',
            injuries: '',
            alergiesAndReactions: '',
            medications: '',
            supplements: '',
            medicalNotes: '',

            ...data,
        },
        validationSchema: RegisterSchema,
        
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            setData({
                ...values,
                height: data?.height,
                weight: data?.weight,
                bodyFat: data?.bodyFat,
                leanMass: data?.leanMass,
            })
            saveData({
                ...values,
                height: data?.height,
                weight: data?.weight,
                bodyFat: data?.bodyFat,
                leanMass: data?.leanMass,
            })
        },
    })

    const imageHandler = (event) => {
        if (!event.target.files[0]) return false

        setFilePicked(URL.createObjectURL(event.target.files[0]))

        setFieldValue('avatar', event.target.files[0])
    }
    const {
        errors,
        touched,
        handleSubmit,
        
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik

    useEffect(() => {
        return () => {
            handleSubmit()
        }
    }, [values])

    const dispatch =useDispatch()
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ width: '100%' }}>
               { part1&&  <>  <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Medical Condition"
                        {...getFieldProps('medicalCondition')}
                        error={Boolean(
                            touched.medicalCondition && errors.medicalCondition
                        )}
                        helperText={
                            touched.medicalCondition && errors.medicalCondition||`Ensures a safe, tailored fitness plan by accounting 
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
                        {...getFieldProps('medication')}
                        error={Boolean(
                            touched.medication && errors.medication
                        )}
                        helperText={
                            touched.medication && errors.medication||`Guides the trainer in adapting the program based
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
                        {...getFieldProps('injuries')}
                        error={Boolean(touched.injuries && errors.injuries)}
                        helperText={touched.injuries && errors.injuries||`Prevents exercise-related harm by modifying workouts 
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
                        {...getFieldProps('history')}
                        error={Boolean(
                            touched.medicalCondition && errors.history
                        )}
                        helperText={
                            touched.history && errors.history||`Guides a proactive fitness plan, considering genetic
                            predispositions and health risks.`
                        }
                        InputProps={{
                            style: {
                                //backgroundColor: "#E1E7F0",
                            },
                        }}
                    /> </>}
                    {part2&&<><LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Alergies and reactions"
                        {...getFieldProps('allergiesAndReactions')}
                        error={Boolean(
                            touched.allergiesAndReactions &&
                                errors.allergiesAndReactions
                        )}
                        helperText={
                            (touched.allergiesAndReactions &&
                            errors.allergiesAndReactions)||`
                            Ensures a secure workout environment by 
preventing allergic reactions.
                            `
                        }
                        InputProps={{
                            style: {
                                // backgroundColor: "#E1E7F0",
                            },
                        }}
                    />

                     <LabeledInput
                        fullWidth
                        placeholder="Write here"
                        clabel="Supplements"
                        {...getFieldProps('supplements')}
                        error={Boolean(
                            touched.supplements &&
                                errors.supplements
                        )}
                        helperText={
                            (touched.supplements &&
                            errors.supplements)||`
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
                        {...getFieldProps('medicalNotes')}
                        error={Boolean(
                            touched.medicalNotes && errors.medicalNotes
                        )}
                        helperText={touched.medicalNotes && errors.medicalNotes}
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
                            {...getFieldProps('medicalNotes')}
                            error={Boolean(
                                touched.medicalNotes && errors.medicalNotes
                            )}
                            helperText={
                                (touched.medicalNotes && errors.medicalNotes)||'Write any additional notes for your trainer to know '
                            }
                            InputProps={{
                                style: {
                                    // backgroundColor: "#E1E7F0",
                                },
                            }}
                        />
                    </ProgramDescriptionModal>
                    </>
}
                    {/* <Stack>
                        <Typography sx={{ pb: 1,mb:2, fontWeight: 600,display:"flex",alignItems:"center" }}>
                        Attachments <Typography color={"text.secondary"} sx={{ml:0.5}}>Optional</Typography>
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
                        <Typography color={"text.secondary"} sx={{mt:2}}>Health documents for your trainer</Typography>
                    </Stack>
                    */}
                </Stack>{' '}
            </Form>
        </FormikProvider>
    )
}
