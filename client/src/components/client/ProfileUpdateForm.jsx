// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    InputAdornment,
    Radio,
    Stack,
    RadioGroup,
    Typography,
    Grid,
    Divider,
    ButtonBase,
} from '@mui/material'

import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import axios from 'axios'
import api from 'src/utils/api'
import {TextField} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import LabeledInput from '../core/LabeledInput'
import { MobileDatePicker } from '@mui/lab'
import LabeledPhoneInput from '../core/PhoneInput'
import CountryInput from '../core/CountryInput'
import { updateProfile } from 'src/redux/actions/Profile'
import { useDispatch } from 'react-redux'
import CommonBottomDrawer from '../common/EditDrawer'
import 'src/pages/onboarding/dropdown.css'
import getCountry from 'src/utils/getCountry'
import moment from 'moment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'


// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    zIndex: 100,
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

export default function ClientProfileUpdateForm(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email('Enter a valid email'),
        phone: Yup.string().min(4).nullable(),
        DOB: Yup.date(),
   
        gender: Yup.string(),
        bio: Yup.string().max(100, 'Bio too long'),
        password: Yup.string(),
        country: Yup.string(),
        firstName:Yup.string().required()
    })

    const [filePicked, setFilePicked] = useState(null)
    const [isEditOpen,setEditOpen]=useState(false)
    const formik = useFormik({
        initialValues: {
            title: '',
            firstName:props?.Profile.name?.split(" ")?.[0],
            lastName:props?.Profile.name?.split(" ")?.[1],
            phone: props?.Profile?.phone,
            gender: props?.Profile?.gender,
            DOB: new Date(props?.Profile?.DOB),
          
            password: '',
            country:props?.Profile?.country
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch(updateProfile({...values,name:values.firstName+" "+values.lastName,DOB:values.DOB}))
            setSubmitting(true)
            //   dispatch(
            //     updateFeedback({
            //       loading: true,
            //     })
            //   );
            // axios
            //   .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
            //     email: values.email,
            //   })
            //   .then((response) => {
            //   dispatch(
            //     updateOnboarding({
            //       authType: 1,
            //       email: values.email,
            //       bio: values.bio,
            //       type: null,
            //     })
            //   );
            //   dispatch(
            //     updateFeedback({
            //       loading: false,
            //       snackbar: true,
            //       message: "Verification mail sent to your email!",
            //       severity: "success",
            //     })
            //   );
            // })
            // .catch((error) => {
            //   if (error.response.status === 406) {
            //   }
            // return dispatch(
            //   updateFeedback({
            //     loading: false,
            //     snackbar: true,
            //     message: "Acccount with give email address already exists!",
            //     severity: "error",
            //   })
            // );
            // else {
            // }
            // return dispatch(
            //   updateFeedback({
            //     loading: false,
            //     snackbar: true,
            //     message: "Oops caught some error! Please try again",
            //     severity: "error",
            //   })
            // );
            // });
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
        return () => handleSubmit()
    }, [])

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ width: '100%' }}>
                <CommonBottomDrawer 
                isEditOpen={isEditOpen}
                setEditOpen={setEditOpen}
open={true} 
title={"Update location"} 
label={"First name"}
value={<Stack direction={"row"} alignItems={"center"} spacing={2} sx={{textTransform:"capitalize"}}>
   
   {values.firstName}
    </Stack>
    
    }
onSave={()=>handleSubmit()} 
field={ <LabeledInput   
{...getFieldProps('firstName')}
error={Boolean(touched.firstName && errors.firstName)}
                    setFieldValue={val=>setFieldValue("firstName",val)}
                   
                    helperText={touched.firstName && errors.firstName}/>}
                    
                    
                    />      


                                 <CommonBottomDrawer 
                                 isEditOpen={isEditOpen}
                                 setEditOpen={setEditOpen}
open={true} 
title={"Update location"} 
label={"Last name"}
value={<Stack direction={"row"} alignItems={"center"} spacing={2} sx={{textTransform:"capitalize"}}>
   
   {values.lastName}
    </Stack>
    
  }
onSave={()=>handleSubmit()} 
field={ <LabeledInput   
{...getFieldProps('lastName')}
error={Boolean(touched.lastName && errors.lastName)}
                    setFieldValue={val=>setFieldValue("lastName",val)}
                   
                    helperText={touched.lastName && errors.lastName}/>}
                    
                    
                    />         


<CommonBottomDrawer 
isEditOpen={isEditOpen}
setEditOpen={setEditOpen}
open={true} 
title={"Update location"} 
label={"Birthday"}
value={<Stack direction={"row"} alignItems={"center"} spacing={2} sx={{textTransform:"capitalize"}}>
   
   {values?.DOB?moment(new Date(values?.DOB)).format("DD, MMM yyyy"):""}
    </Stack>
    
  }
onSave={()=>handleSubmit()} 
field={ <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Date of Birth"
    value={values.DOB}
    onChange={(newValue) => {
      setFieldValue('DOB', newValue);
    }}
    renderInput={(params) => <TextField {...params} fullWidth />}
  />
</LocalizationProvider>}
                    
                    
                    />   



<CommonBottomDrawer 
isEditOpen={isEditOpen}
setEditOpen={setEditOpen}
open={true} 
title={"Update location"} 
label={"Gender"}
value={<Stack direction={"row"} alignItems={"center"} spacing={2} sx={{textTransform:"capitalize"}}>
   
   {values.gender}
    </Stack>
    
  }
onSave={()=>handleSubmit()} 
field={   <TextField
sx={{mt:1}}
    select
    fullWidth
    {...getFieldProps('gender')}
    value={values?.gender}
    onChange={(event) => setFieldValue('gender', event.target.value)}
    SelectProps={{
        native: true,
    }}
    error={Boolean(touched.gender && errors.gender)}
    helperText={touched.gender && errors.gender}
>
    <option value="" disabled>
        Select your gender
    </option>
    <option value="male">Male</option>
    <option value="female">Female</option>
 
</TextField>}
                    
                    




                    />   





<CommonBottomDrawer 
isEditOpen={isEditOpen}
setEditOpen={setEditOpen}
open={true} 
title={"Update location"} 
label={"Location"}
value={values.country?<Stack direction={"row"} alignItems={"center"} spacing={2}>
    <img src={getCountry(values.country).image} width={24} height={16} style={{marginRight:8}}/>
   { getCountry(values.country).name}
    </Stack>
    
    :"No location"}
onSave={()=>handleSubmit()} 
field={ <CountryInput   
{...getFieldProps('country')}
error={Boolean(touched.country && errors.country)}
                    setFieldValue={val=>setFieldValue("country",val)}
                    
                    helperText={touched.country && errors.country}/>}
                    
                    
                    />


<CommonBottomDrawer 
isEditOpen={isEditOpen}
setEditOpen={setEditOpen}
open={true} inputType={"text"} 
title={"Update mobile"} 
label={"Mobile number"}
value={values.phone?"+"+values.phone:"No number"}
onSave={()=>handleSubmit()} 
field={<LabeledPhoneInput
                        fullWidth
                        placeholder="+91 98765-43210"
                      
                        setFieldValue={setFieldValue}
                        {...getFieldProps('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Iconify
                                        icon="ic:round-keyboard-arrow-right"
                                        color="text.secondary"
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />}
                    
                    
                    />
                    <br/>
                    
                    {/* <Box>
                        <Typography variant="subtitle1" color="text.primary">
                            Gender
                        </Typography>
                        <RadioGroup {...getFieldProps('gender')}>
                            <Stack
                                direction={'row'}
                                spacing={2}
                                alignItems="center"
                            >
                                <Stack direction={'row'} alignItems="center">
                                    <Radio color="primary" value="female" />{' '}
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        Female
                                    </Typography>
                                </Stack>
                                <Stack direction={'row'} alignItems="center">
                                    <Radio color="primary" value="male" />{' '}
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                    >
                                        Male
                                    </Typography>
                                </Stack>
                            </Stack>
                        </RadioGroup>
                    </Box> */}


                      {/* <Box>
                     
                      <Grid container>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography variant="subtitle1">
                                    Birthday
                                   
                                </Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ pr: 1 }}>
                                <YearPicker
                                    defaultValue={'Year'}
                                    start={1950} // default is 1900
                                    end={2023} // default is current year
                                    reverse // default is ASCENDING
                                    required={true} // default is false
                                    // default is false
                                    // mandatory
                                    value={values.DOB.getFullYear()}
                                    onChange={(year) => {
                                        // mandatory

                                        if (!year) return
                                        setFieldValue(
                                            'DOB',
                                            new Date(
                                                year,
                                                values.DOB.getMonth(),
                                                values.DOB.getDate()
                                            )
                                        )
                                    }}
                                    id={'year'}
                                    name={'year'}
                                    classes={'dropdown-year'}
                                    style={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ pr: 1 }}>
                                <MonthPicker
                                    value={values.DOB.getMonth()}
                                    defaultValue={'Month'}
                                    // to get months as numbers
                                    short // default is full name
                                    // default is Titlecase
                                    endYearGiven // mandatory if end={} is given in YearPicker
                                    year={values.DOB.getFullYear()} // mandatory
                                    required={true} // default is false
                                    // default is false

                                    classes={'dropdown-month'}
                                    onChange={(month) => {
                                        // mandatory
                                        if (!month) return
                                        setFieldValue(
                                            'DOB',
                                            new Date(
                                                values.DOB.getFullYear(),
                                                month,
                                                values.DOB.getDate()
                                            )
                                        )
                                    }}
                                    id={'month'}
                                    name={'month'}
                                    optionClasses={'option classes'}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <DayPicker
                                    defaultValue={'Day'}
                                    year={values.DOB.getFullYear()} // mandatory
                                    month={values.DOB.getMonth()} // mandatory
                                    endYearGiven // mandatory if end={} is given in YearPicker
                                    required={true} // default is false
                                    // default is false
                                    value={values.DOB.getDate()}
                                    onChange={(day) => {
                                        if (!day) return
                                        setFieldValue(
                                            'DOB',
                                            new Date(
                                                values.DOB.getFullYear(),
                                                values.DOB.getMonth(),
                                                day
                                            )
                                        )
                                    }}
                                    id={'day'}
                                    classes={'dropdown-day'}
                                    name={'day'}
                                    //classes={"classes"}
                                    //optionClasses={"option classes"}
                                />
                            </Grid>
                        </Grid>
                    </Box> */}

{/* 
                    <Box>
                        <Divider />
                        <Box
                            onClick={() => navigate('/resetpassword')}
                            py={1.5}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Typography variant="subtitle1">
                                Change password
                            </Typography>
                            <Iconify icon="ic:round-keyboard-arrow-right" />
                        </Box>
                        <Divider />
                    </Box> */}
                </Stack>{' '}
            </Form>
        </FormikProvider>
    )
}
