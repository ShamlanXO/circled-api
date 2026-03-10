// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components

import {
    Box,
    Button,
    Typography,
    Stack,

    Chip,
   
    Grid
} from '@mui/material'

import { useNavigate, useLocation, useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import { sendProgram } from '../../redux/actions/createProgram'
import FooterBase from '../../components/Layout/Footer'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import SendProgramForm from 'src/components/instructor/sendProgramForm'
import { useOutletContext } from 'react-router-dom'

import Logo from '../../assets/figgslogo.png'
import Checkbox from '@mui/material/Checkbox';


const BoxStyle = styled(Box)(() => ({
    width: '100%',
   
}))




// ----------------------------------------------------------------------

export default function SendProgramPage({Program,email,handleDone}) {
    const dispatch = useDispatch()
 
    const [isConfirmed,setIsConfirmed]=useState(false)
    const navigate = useNavigate()
  
    const [isSentProgram, setIsSent] = useState(false)
    const RegisterSchema = Yup.object().shape({
        email: Yup.array().of(
            Yup.string()
                .email('Enter a valid email')
                .required('Email is required')
        ),
        price: Yup.number()
            .required('Price is required')
            .min(0, "Price can't be negative"),
        message: Yup.string().max(100, 'Message too long'),
        PaymentType: Yup.string().required('Payment type is required'),
    })


    const formik = useFormik({
        initialValues: {
            email: [email],
            price: Program.Price,
            PaymentType: Program.PaymentType,
            message: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            dispatch(
                updateOnboarding({
                    loading: true,
                })
            )

            dispatch(
                sendProgram({
                    ...Program,
                    SendTo: values.email.map((i) => i.toLowerCase()),
                    Price: values.PaymentType == 'Free' ? 0 : values.price,
                    PaymentType: values.PaymentType,
                    GreetingMessage: values.message,
                })
            )
                .then((result) => {
                    dispatch(
                        updateOnboarding({
                            loading: false,
                        })
                    )
                    setIsSent(true)
                    //navigate("/", { replace: true });
                })
                .catch((err) => {
                    dispatch(
                        updateOnboarding({
                            loading: false,
                        })
                    )
                })
        },
    })

    const { handleSubmit, values,submitForm } = formik

    return (
    
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        {isSentProgram ? (
                          <>
                                    <img src={Logo} height={42} style={{marginTop:24}}/>

                                    <Box my={4} px={4} width={'100%'}>
                                        <Box
                                            width={'100%'}
                                            borderRadius={1}
                                            overflow={'hidden'}
                                            style={{
                                                border: '1px solid #C3CBD9',
                                            }}
                                        >
                                            <img
                                                src={
                                                    Program.BannerImage ||
                                                    '/images/instructor/programOverview.jpg'
                                                }
                                                height={150}
                                                width={'100%'}
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <Box
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}
                                                py={2}
                                                pt={3}
                                            >
                                                <Typography
                                                    fontSize={'18px'}
                                                    color={'text.secondary'}
                                                >
                                                    You have sent
                                                </Typography>
                                                <Typography
                                                    fontSize={'16px'}
                                                    fontWeight={'600'}
                                                >
                                                    {Program.Title}
                                                </Typography>
                                            </Box>
                                          
                                            <Box
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}
                                                py={2}
                                            >
                                                <Typography
                                                    fontSize={'16px'}
                                                    color={'text.secondary'}
                                                >
                                                    To
                                                </Typography>
                                                {values.email.map((i) => {
                                                    return (
                                                        <Typography
                                                            fontSize={'16px'}
                                                        >
                                                            {i}
                                                        </Typography>
                                                    )
                                                })}

                                                <Typography
                                                    fontSize={'14px'}
                                                    color={'text.secondary'}
                                                    align={'center'}
                                                    sx={{ mt: 4, px: 4 }}
                                                >
                                                    You'll be notified by email
                                                    when the client accepts the
                                                    program.
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <center>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 4, px: 6 }}
                                                onClick={() => handleDone()}
                                            >
                                                Done
                                            </Button>
                                        </center>
                                    </Box>
                            </>
                        ) : (
                           
                            <>
                                    <Box position="relative" p={2} pb={0} pt={4}>
                                        <Grid container spacing={2}>
<Grid item xs={5}> <img
                                            src={
                                                Program.BannerImage ||
                                                '/images/profile-banner.png'
                                            }
                                            style={{
                                                width: '100%',
                                                height: '90px',
                                                objectFit: 'cover',
                                                borderRadius:8
                                            }}
                                        /></Grid>
                                        <Grid item xs={7}>
                                            <Stack spacing={1}>
                                            <Typography
                                                variant="body1"
                                                color="text.primary"
                                                fontWeight={600}
                                                gutterBottom
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    fontSize: 18,
                                                }}
                                            >
                                                {Program.Title}
                                            </Typography>
                                            
                                          
                                            </Stack>

                                      
                                        </Grid>
                                        </Grid>
                                    
                                    </Box>

                                    <Box px={2} mt={2}>
                                   
                                        {isSentProgram ? (
                                            <>
                                                <Typography
                                                    gutterBottom
                                                    align="center"
                                                    variant="h4"
                                                    color={'text.primary'}
                                                >
                                                    Program sent successfully
                                                </Typography>
                                                <Typography
                                                    align="center"
                                                    variant="h4"
                                                >
                                                    To
                                                </Typography>

                                                <Box
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    justifyContent={'center'}
                                                    flexDirection={'column'}
                                                    mt={2}
                                                >
                                                    {values.email.map((i) => {
                                                        return (
                                                            <Chip
                                                                label={i}
                                                                variant="outlined"
                                                                color={
                                                                    'primary'
                                                                }
                                                                sx={{
                                                                    fontSize: 16,
                                                                    fontWeight: 500,
                                                                    mb: 1,
                                                                    py: 2,
                                                                    borderRadius: 1,
                                                                    borderWidth: 2,
                                                                }}
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItem="center"
                                                >
                  
                                                </Box>

                                                <SendProgramForm
                                                    Program={Program}
                                                    email={email}
                                                />
                                            </>
                                        )}
                                    </Box>
                            
                          
                                    <BoxStyle mt={1}>
                                        <Box px={2}  pt={2}>
                                        <Typography variant='body2' display={"flex"} alignItems={"center"}>
                                            <Box component={"span"} mr={0.5}>
                                                <Checkbox size='small' onChange={e=>setIsConfirmed(e.target.checked)}/>
                                            </Box>
                                            I confirm all of the information above is correct.</Typography>
                                        </Box>
                                        <Box
                                            display={'flex'}
                                            justifyContent={'flex-end'}
                                            width={'100%'}
                                            px={3}
                                            py={2}
                                            pt={1}
                                        >
                                            
                                                <Button
                                                    onClick={submitForm}
                                                    variant="contained"
                                                    disabled={!isConfirmed}
                                                    sx={{
                                                        display: 'flex',
                                                        minWidth: 132,
                                                    }}
                                                >
                                                    Send
                                                    
                                                </Button>
                                         
                                        </Box>
                                    </BoxStyle>
                              
                                </>
                            
                        )}
                    </Form>
                </FormikProvider>
          
    )
}
