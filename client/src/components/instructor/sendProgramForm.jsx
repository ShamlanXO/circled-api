// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    IconButton,
    InputAdornment,
    ListItemButton,
    Radio,
    Button,
    Stack,
    TextField,
    Typography,
    ButtonBase,
} from '@mui/material'

import * as Yup from 'yup'
import {
    useFormik,
    Form,
    FormikProvider,
    useFormikContext,
    FieldArray,
    getIn,
    ErrorMessage,
} from 'formik'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import axios from 'axios'
import api from 'src/utils/api'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import LabeledInput from '../core/LabeledInput'
import SendProgramEmails from 'src/components/instructor/sendProgramEmails'
import { MobileDatePicker } from '@mui/lab'
import SubscriptionTypePopover from './subscriptionTypePopover'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default function SendProgramForm(props) {
    const navigate = useNavigate()
    const RegisterSchema = Yup.object().shape({
        email: Yup.array().of(
            Yup.string()
                .email('Enter a valid email')
                .required('Email is required')
        ),
        price: Yup.number()
            .required('Price is required')
            .min(0, "Price can't be negative"),
        PaymentType: Yup.string().required('Payment type is required'),
        message: Yup.string().max(500, 'Message too long'),
    })

    const [filePicked, setFilePicked] = useState(null)
    const formik = useFormik({
        initialValues: {
            email: [''],
            price: props.Program?.Price,
            PaymentType: props.Program?.PaymentType,
            message: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {},
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
        handleChange,
        handleBlur,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = useFormikContext()
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            {/* <Box>
                <BoxStyle style={{ alignItems: 'end' }}>
                    <Box width="100%">
                        <Box display="flex" alignItems={'center'}>
                   
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 600 }}
                                color="common.primary"
                                gutterBottom
                            >
                                Pricing model
                            </Typography>{' '}
                        </Box>
                        <SubscriptionTypePopover
                            selectedSubscriptionType={values.PaymentType}
                            setSubscriptionType={(val) =>
                                setFieldValue('PaymentType', val)
                            }
                        >
                            <ListItemButton
                                fullWidth
                                sx={{
                                    backgroundColor: '#F5F7FA',
                                    borderRadius: '9px',
                                    height: '56px',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Monthly Subscription
                                </Typography>

                                <Iconify
                                    icon={'entypo:select-arrows'}
                                    color="common.black"
                                />
                            </ListItemButton>
                        </SubscriptionTypePopover>
                    </Box>
                    &nbsp;&nbsp;
                    <Box width="50%">
                        {values.PaymentType !== 'Free' && (
                            <>
                                <Box display="flex" alignItems={'center'}>
                 
                                    <Typography
                                        variant="h6"
                                        color="common.white"
                                    >
                                        Price
                                    </Typography>{' '}
                                </Box>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder="100"
                                    {...getFieldProps('price')}
                                    value={
                                        values.PaymentType == 'Free'
                                            ? ''
                                            : getFieldProps('price').value
                                    }
                                    disabled={values.PaymentType == 'Free'}
                                    error={Boolean(
                                        touched.price && errors.price
                                    )}
                                    helperText={touched.price && errors.price}
                                    InputProps={{
                                        startAdornment:
                                            values.PaymentType ==
                                            'Free' ? null : (
                                                <InputAdornment position="end">
                                                    <Iconify
                                                        icon={'uil:dollar-alt'}
                                                        color={'inherit'}
                                                    />
                                                </InputAdornment>
                                            ),
                                    }}
                                />
                            </>
                        )}
                    </Box>
                </BoxStyle>
            </Box> */}
            {!props?.email?<Box marginTop={2}>
                <ButtonBase>
                    {/* <Iconify icon="bi:arrow-up-right-circle" sx={{fontSize:18}} color={"text.primary"} ml={0.5}/>
                    &nbsp;&nbsp; */}
                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        sx={{ fontWeight: 600, display: 'flex' }}
                    >
                        Send to &nbsp;
                    </Typography>
                </ButtonBase>
                <SendProgramEmails
                    allRecievers={values.email}
                    setAllRecievers={(arr) => setFieldValue('email', arr)}
                    errors={errors.email}
                    errorObj={{}}
                    modal
                    setErrorObj={() => {}}
                />
            </Box>:""}
            {/* <FieldArray name="email">
        {({ push, remove }) => (
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600, display: "flex" }}>
              Send to&nbsp;
            </Typography>
            {values.email.map((field, index) => (
              <Box display={"flex"} key={`${index}`} alignItems="start">
                <Box flex={1}>
                  <TextField
                    variant="outlined"
                    sx={{ maxWidth: 308 }}
                    error={
                      getIn(touched, `email.${index}`) &&
                      getIn(errors, `email.${index}`)
                    }
                    helperText={getIn(errors, `email.${index}`)}
                    name={`email.${index}`}
                    type="email"
                    value={values.email[index]}
                    placeholder="example@email.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Box>
                {index === 0 && values.email[index] && (
                  <IconButton
                    sx={{ ml: 1, mt: 1 }}
                    onClick={() => {
                      setFieldValue(`email.${index}`, "");
                    }}
                  >
                    <Iconify icon="radix-icons:cross-2" color="primary" />
                  </IconButton>
                )}
                {index > 0 && (
                  <IconButton
                    sx={{ ml: 1, mt: 1 }}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Iconify icon="radix-icons:cross-2" color="primary" />
                  </IconButton>
                )}
              </Box>
            ))}
            <Box>
              <Button
                // style={{  borderRadius: 10 }}
                variant="text"
                size="small"
                color={"primary"}
                sx={{ mt: 0, px: 0, mb: 0, pb: 0, fontSize: 16 }}
                onClick={() => {
                  push("");
                }}
              >
                + Add more
              </Button>
            </Box>
          </Stack>
        )}
      </FieldArray> */}
            <ProgramDescriptionModal
                headerTitle="Create Program"
                headerSubTitle="Message"
                fullWidth
                clabel="Message (optional)"
                {...getFieldProps('message')}
                placeholder="Write a message here"
                error={Boolean(touched.message && errors.message)}
                helperText={touched.message && errors.message}
                multiline
                minRows={4}
            >
                <LabeledInput
                    fullWidth
                    clabel={
                        <Typography
                            variant="subtitle1"
                            color="text.primary"
                            sx={{ fontWeight: 600, display: 'flex' }}
                        >
                            Message &nbsp;
                            <Typography color="text.secondary">
                                optional
                            </Typography>
                        </Typography>
                    }
                    {...getFieldProps('message')}
                    placeholder="Write a message here"
                    error={Boolean(touched.message && errors.message)}
                    helperText={touched.message && errors.message}
                    multiline
                    minRows={8}
                    maxRows={8}
                />
            </ProgramDescriptionModal>
        </Stack>
    )
}
