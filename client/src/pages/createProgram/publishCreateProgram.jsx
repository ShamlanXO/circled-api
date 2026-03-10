// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState, forwardRef } from 'react'
// components
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    ButtonBase,
    Divider,
    Alert,
} from '@mui/material'
import Input from 'src/components/Labs/Cropper'
import { handleuploadImage } from 'src/utils/uploader'
import Content from '../../components/Layout/Content'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import Iconify from '../../components/Iconify'
import Dialog from '@mui/material/Dialog'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { checkIsDraft ,getEmptyWeekNumber} from 'src/utils/getProgramStatus'
import { createProgram, saveProgram } from 'src/redux/actions/createProgram'
import { useOutletContext } from 'react-router-dom'
import { Grid } from '@mui/material'
import ProgramTypePopover from 'src/components/instructor/ProgramTypePopover'
import { useConfirmationModalContext } from 'src/utils/Modal'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import Lottie from "lottie-react";
import animationData from "src/assets/lottie/lf30_editor_iaocbu1z.json";

const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
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
const SocialButton = styled(ButtonBase)(({ theme }) => ({
    height: 45,

    borderRadius: 16,
    background: '#F9FCFD',
    fontFamily: 'Proxima Nova',
    /* Dark primary / 50% */
    color: '#172A44',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 8,
    border: '2px solid rgba(23, 42, 68, 0.5)',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    padding: '20px 10px',
    maxWidth: 'xs',
    zIndex: 100,
    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const { showConfirmationModal } = useConfirmationModalContext()
    const { search } = useLocation()
   const {handleBack} = props
    const query = new URLSearchParams(search)
    const [Program, updateProgram, mode] = useOutletContext()
   const [successModal,setSuccessModal]=useState(false)
    const navigate = useNavigate()
 
    const handelNext = () => {
        // navigate("/");

        setFieldValue(
            'SendTo',
            values.SendTo.filter((i) => i)
        )

        handleSubmit()
    }
 

    const RegisterSchema = Yup.object().shape({
        message: Yup.string(),
        SendTo: Yup.array().of(Yup.string().email()),
    })

    const [filePicked, setFilePicked] = useState(null)
    const formik = useFormik({
        initialValues: {
            price: Program.Price,
            BannerImage: Program.BannerImage,
            title: Program.Title,
            description: Program.Description,
            ProgramType:Program.ProgramType||"Public",
            message: '',
            // BannerImage: Program.BannerImage,
            PaymentType: Program.PaymentType || 'Free',
            SendTo: Program.SendTo.length
                ? Program.SendTo.map((i) => i.toLowerCase())
                : [''],
        },
        validationSchema: RegisterSchema,
        // validateOnBlur: true,
        // validateOnChange: false,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            if (mode == 'create') {
                if (
                    formik.values.message &&
                    !formik.values.SendTo.filter((i) => i).length
                ) {
                    showConfirmationModal(
                        '',
                        `You wrote a message but did not include 
            the client's email addresses.
            `,
                        'Add email',
                        'Skip and publish'
                    ).then((res) => {
                        if (res) {
                            document.getElementById('addmore').click()
                        } else {
                            if (checkIsDraft(Program)) {
                                showConfirmationModal(
                                    'Save as draft?',
                                    `Your week ${getEmptyWeekNumber(Program)} is currently empty. Please add at least one workout or delete the week to proceed with publishing the program`,
                                    'Continue',
                                    'Save as draft'
                                ).then((res) => {
                                    if (!res) {
                                        dispatch(
                                            updateFeedback({
                                                loading: true,
                                                sAnimate: false,
                                                message:
                                                    'Program created successfully',
                                                severity: 'success',
                                            })
                                        )
                                        dispatch(
                                            saveProgram({
                                                ...Program,
                                                Price: values.price,
                                                BannerImage: values.BannerImage,
                                                Title: values.title,
                                                Description: values.description,
                                                PaymentType: values.PaymentType,
                                                SendTo: checkIsDraft(Program)
                                                    ? []
                                                    : values.SendTo.map((i) =>
                                                          i.toLowerCase()
                                                      ),
                                                IsDraft: checkIsDraft(Program),
                                                IsPublished:
                                                    !checkIsDraft(Program),
                                                Price: values.price,
                                                BannerImage: values.BannerImage,
                                                Title: values.title,
                                                Description: values.description,
                                                PaymentType: values.PaymentType,
                                                GreetingMessage: values.message,
                                            })
                                        ).then((program) => {
                                            if (checkIsDraft(Program))
                                                dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                        sAnimate: true,
                                                        snackbar: false,
                                                        message:
                                                            'Program saved as draft',
                                                        severity: 'success',
                                                    })
                                                )
                                            else {
                                                dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                        sAnimate: true,
                                                        snackbar: false,
                                                        message:
                                                            'Program created successfully',
                                                        severity: 'success',
                                                    })
                                                )
                                            }

                                            navigate('/instructor')
                                        })
                                    } else {
                                        handleBack()
                                    }
                                })
                            } else {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                        sAnimate: false,
                                        message: 'Program created successfully',
                                        severity: 'success',
                                    })
                                )
                                dispatch(
                                    saveProgram({
                                        ...Program,
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        SendTo: checkIsDraft(Program)
                                            ? []
                                            : values.SendTo.map((i) =>
                                                  i.toLowerCase()
                                              ),
                                        IsDraft: checkIsDraft(Program),
                                        IsPublished: !checkIsDraft(Program),
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        GreetingMessage: values.message,
                                    })
                                ).then((program) => {
                                    
                                    setSuccessModal(true)
                                    // if (checkIsDraft(Program))
                                    //     dispatch(
                                    //         updateFeedback({
                                    //             loading: false,
                                    //             sAnimate: true,
                                    //             snackbar: false,
                                    //             message:
                                    //                 'Program saved as draft',
                                    //             severity: 'success',
                                    //         })
                                    //     )
                                    // else {
                                    //     dispatch(
                                    //         updateFeedback({
                                    //             loading: false,
                                    //             sAnimate: true,
                                    //             snackbar: false,
                                    //             message:
                                    //                 'Program created successfully',
                                    //             severity: 'success',
                                    //         })
                                    //     )
                                    // }



                                   // navigate('/instructor')
                                })
                            }
                        }
                    })
                } else {
                    if (checkIsDraft(Program)) {
                        showConfirmationModal(
                            'Save as draft?',
                            `Your week ${getEmptyWeekNumber(Program)} is currently empty. Please add at least one workout or delete the week to proceed with publishing the program`,
                            'Continue',
                            'Save as draft'
                        ).then((res) => {
                            if (!res) {
                                dispatch(
                                    updateFeedback({
                                        loading: true,
                                        sAnimate: false,
                                        message: 'Program created successfully',
                                        severity: 'success',
                                    })
                                )
                                dispatch(
                                    saveProgram({
                                        ...Program,
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        SendTo: checkIsDraft(Program)
                                            ? []
                                            : values.SendTo.map((i) =>
                                                  i.toLowerCase()
                                              ),
                                        IsDraft: checkIsDraft(Program),
                                        IsPublished: !checkIsDraft(Program),
                                        Price: values.price,
                                        BannerImage: values.BannerImage,
                                        Title: values.title,
                                        Description: values.description,
                                        PaymentType: values.PaymentType,
                                        GreetingMessage: values.message,
                                    })
                                ).then((program) => {
                                    if (checkIsDraft(Program))
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                sAnimate: true,
                                                snackbar: false,
                                                message:
                                                    'Program saved as draft',
                                                severity: 'success',
                                            })
                                        )
                                    else {
                                        dispatch(
                                            updateFeedback({
                                                loading: false,
                                                sAnimate: true,
                                                snackbar: false,
                                                message:
                                                    'Program created successfully',
                                                severity: 'success',
                                            })
                                        )
                                    }

                                    navigate('/instructor')
                                })
                            } else {
                                handleBack()
                            }
                        })
                    } else {
                        dispatch(
                            updateFeedback({
                                loading: true,
                                sAnimate: false,
                                message: 'Program created successfully',
                                severity: 'success',
                            })
                        )
                        dispatch(
                            saveProgram({
                                ...Program,
                                Price: values.price,
                                BannerImage: values.BannerImage,
                                Title: values.title,
                                Description: values.description,
                                PaymentType: values.PaymentType,
                                SendTo: checkIsDraft(Program)
                                    ? []
                                    : values.SendTo.map((i) => i.toLowerCase()),
                                IsDraft: checkIsDraft(Program),
                                IsPublished: !checkIsDraft(Program),
                                Price: values.price,
                                BannerImage: values.BannerImage,
                                Title: values.title,
                                Description: values.description,
                                PaymentType: values.PaymentType,
                                GreetingMessage: values.message,
                            })
                        ).then((program) => {
                            if (checkIsDraft(Program))
                               { dispatch(
                                    updateFeedback({
                                        loading: false,
                                        sAnimate: true,
                                        snackbar: false,
                                        message: 'Program saved as draft',
                                        severity: 'success',
                                    })
                                )
                                navigate('/instructor')
                            }
                            else {
                               
                                setSuccessModal(true)
                            }

                         
                        })
                    }
                }
            }

            if (mode == 'edit') {
                dispatch(
                    updateProgram({
                        Price: values.price,
                        BannerImage: values.BannerImage,
                        Title: values.title,
                        Description: values.description,
                        PaymentType: values.PaymentType,
                        SendTo: checkIsDraft(Program)
                            ? []
                            : values.SendTo.map((i) => i.toLowerCase()),
                    })
                ).then((program) => {
                    navigate('/instructor')
                })

                //   dispatch(saveProgram({
                //     ...Program,
                // IsDraft:false,
                //     SendTo: [],
                //   }))
                //       .then((program) => {
                //        dispatch(updateFeedback({
                //           loading: false,
                //           sAnimate: true,
                //           message: "Program created succesfully",
                //           severity: "success",
                //         }));

                //       });
            }
        },
    })
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        validateForm,
        values,
    } = formik

    useEffect(() => {
        if (!Program.Title) setFieldValue('title', null)
        if (!Program.Description) setFieldValue('description', null)
        if (!Program.BannerImage) setFieldValue('BannerImage', null)

        setFieldValue('title', Program.Title)

        setFieldValue('description', Program.Description)

        setFieldValue('BannerImage', Program.BannerImage)
        setFieldValue('price', Program.Price)
        setFieldValue('PaymentType', Program.PaymentType || 'Subscription')
    }, [Program])

    useEffect(() => {
        ref.current = {
            errors,
            touched,
            handleSubmit,
            isSubmitting,

            validateForm,
            getFieldProps,
            setFieldValue,
            values,
        }
    }, [])
    const handleProgramType=(val)=>{
        setFieldValue('ProgramType', val)
       
    }
    return (
        <Content
            withoutPadding
            style={{ paddingBottom: 24, paddingTop: 24, overflowY: 'auto' }}
        >
            <FormikProvider value={formik} validateOnBlur>
                <Form
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                    validateOnBlur
                >
                    <Input
                        hidden
                        accept="image/*"
                        type="file"
                        id="bannerImage"
                        onChange={(e) => {
                            dispatch(updateFeedback({ loading: true }))
                            handleuploadImage(e).then((res) => {
                                setFieldValue('BannerImage', res.data.Location)
                                dispatch(updateFeedback({ loading: false }))
                            })
                        }}
                        cropShape={'rect'}
                        aspect={1.5}
                    />
                    <Box
                        position="relative"
                        width="100%"
                        height={values.BannerImage ? 'auto' : '210px'}
                        mt={2}
                        borderRadius={1}
                        border={`1px solid ${values.BannerImage ? 'transparent' : '#E1E7F0'}`}
             
                    >
                        {values.BannerImage && (
                            <img
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    backgroundColor: '#fff',
                                }}
                                onClick={(e) => {
                                    document
                                        ?.getElementById('bannerImage')
                                        ?.click()
                                }}
                                src={values.BannerImage}
                            />
                        )}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                width: '100%',
                                height: '100%',
                               
                                zIndex: 10,
                                display: 'flex',
                                paddingTop: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >

                                <Iconify
                                    icon={'fluent:image-32-regular'}
                                    width={48}
                                    height={48}
                                   sx={{
                                    color:"text.secondary",
                                    cursor:"pointer"
                                   }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        document
                                            ?.getElementById('bannerImage')
                                            ?.click()
                                    }}
                                />

                            <Typography sx={{ mt: 1,textDecoration:'underline', fontSize:14, fontWeight:600}} color="text.secondary">
                            Add cover image
                            </Typography>

                            <Typography color="text.secondary">
                           Optional
                            </Typography>
                        </Box>
                    </Box>
                    <Box px={2} mt={2}>
                        <Stack spacing={2}>
                            {checkIsDraft(Program) && (
                                <Alert
                                    alignItems={'center'}
                                    sx={{ color: 'text.primary', mt: 2 }}
                                    severity="info"
                                >
                                    You must have exercise in every week to
                                    publish your program.
                                </Alert>
                            )}
                            <Box  pt={2}>
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Program title
                                </Typography>
                                <Typography
                                    mt={0.5}
                                    variant="body1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    {Program.Title}
                                </Typography>
                            </Box>

                            <Box >
                                <Typography
                                    variant="subtitle1"
                                    color="textPrimary"
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    Description
                                </Typography>
                                <ReactReadMoreReadLess
                                    charLimit={120}
                                    readMoreText={'more'}
                                    readLessText={'less'}
                                    readMoreStyle={{
                                        fontWeight: 'bold',
                                        color: '#2B4057',
                                        marginLeft: 6,
                                    }}
                                    readLessStyle={{
                                        fontWeight: 'bold',
                                        color: '#2B4057',
                                        marginLeft: 6,
                                    }}
                                >
                                    {Program.Description ||
                                        'No description provided'}
                                </ReactReadMoreReadLess>
                            </Box>
<Divider/>
                        </Stack>
                        <Box width="50%">
                                <Box
                                    display="flex"
                                    alignItems={'center'}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Program type
                                    </Typography>{' '}
                                </Box>
                                <ProgramTypePopover
                                    selectedProgramType={
                                        values.ProgramType
                                    }
                                    setProgramType={handleProgramType}
                                ></ProgramTypePopover>

                                <Typography color="text.secondary" sx={{mt:2}}>
                               { values.ProgramType == 'Public' ? 'Program will be visible in your profile' : 'Program will not be visible in your profile'}
                                </Typography>
                            </Box>
                    </Box>
                </Form>
            </FormikProvider>
            <SuccessDialog programId={Program._id} dispatch={dispatch} navigate={navigate} open={successModal}/>
        </Content>
    )
})

const SuccessDialog=({programId,dispatch, navigate,open})=>{
    const [openDialog,setOpenDialog]=useState(open)

    useEffect(()=>{
        setOpenDialog(open)
    },[open])

const onShare=()=>{

        if (navigator.share) {
            navigator
                .share({
                    title: ` shared a fitness program :`,
                    url: `/public/workout-program/${programId}`,
                })
                
        }
    
}
const onCopyLink=()=>{
 navigator.clipboard.writeText(`${window.location.origin}/public/workout-program/${programId}`)
 dispatch(updateFeedback({ snackbar: true, message: 'Copied to clipboard' }))
}
const onDone=()=>{
    navigate(`/`)
    setOpenDialog(false)

}

    return(
       <Dialog
       open={openDialog}
       fullWidth
       fullScreen
       onClose={()=>setOpenDialog(false)}
       >
        <Stack spacing={2} px={3} alignItems="center" justifyContent="center" height="100%">
                {openDialog && <Lottie
                autoplay
                animationData={
                  animationData
                }
                loop={true}
                height={100}
                width={100}
              />}
           
            
            <Typography variant="h3" align="center" color="text.primary">
                Program created successfully
            </Typography>
            <Typography variant="body1" align="center" color="text.primary">
                Your program has been created successfully. You can now share it with your clients.
            </Typography>
            <Button fullWidth variant="contained"  color="primary" onClick={onShare}>
            <Iconify icon="mdi:share" width={32} height={32}/>  &nbsp;  Share
            </Button>
            <Button fullWidth variant='outlined' color='primary' onClick={onCopyLink}>
            <Iconify icon="mdi:link" width={32} height={32}/>  &nbsp;  Copy link
            </Button>
            <Button fullWidth variant="outlined" color="primary" onClick={onDone}>
                Done
            </Button>
        </Stack>
       </Dialog>

    )
}