// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components
import Page from '../../components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    Avatar,
    ButtonBase,
    InputAdornment,
    IconButton,
    StepLabel,
    StepContent,
    Step,
    Stepper,
    Tabs,
    Tab,
    Chip,

    Switch,
    Divider,
    Grid
} from '@mui/material'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation, useParams } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import { sendProgram } from '../../redux/actions/createProgram'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import LabeledInput from '../../components/core/LabeledInput'
import FooterBase from '../../components/Layout/Footer'
import Progress from 'src/components/progress'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import Footer from 'src/components/onboarding/footer'
import axios from 'axios'
import api from 'src/utils/api'
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import ExerciseCard from 'src/components/instructor/exerciseCard'
import Label from 'src/components/Label'
import { TabContext, TabPanel } from '@mui/lab'
import SwitchCustom from 'src/components/SwitchCustom'
import ProgramOverviewStatus from 'src/components/program/programOverviewStatus'
import ClientList from 'src/components/dashboard/client/ClientList'
import ProgramOverviewPopover from 'src/components/program/programOverviewPopover'
import SendProgramForm from 'src/components/instructor/sendProgramForm'
import { useOutletContext } from 'react-router-dom'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import Share from 'src/assets/IconSet/Share'
import Send from 'src/assets/IconSet/Send'
import Logo from '../../assets/figgslogo.png'
import Checkbox from '@mui/material/Checkbox';

const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    width: '100%',
    borderTop: '2px solid #ECEEEF',
    borderRadius: '24px 24px 0px 0px',
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
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
}))

const PriceContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    padding: '12px',
    justifyContent: 'center',
    alignItems: 'center',
}))
// ----------------------------------------------------------------------

export default function SendProgramPage() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { search ,state} = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const exercises = [{}, {}]
    const [isConfirmed,setIsConfirmed]=useState(false)
    const navigate = useNavigate()
    const [Program, updateProgram, mode,original] = useOutletContext()
    const [current, setCurrent] = useState('About')
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

    const [filePicked, setFilePicked] = useState(null)
    const formik = useFormik({
        initialValues: {
            email: [state?.email||''],
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

    const { handleSubmit, values } = formik

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        {isSentProgram ? (
                            <Container>
                                <Content
                                    flex
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img src={Logo} height={42} />

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
                                                onClick={() => navigate(-1)}
                                            >
                                                Done
                                            </Button>
                                        </center>
                                    </Box>
                                </Content>
                            </Container>
                        ) : (
                            <Container>
                                {' '}
                                <Header noColor>
                                    <BoxHeader px={2} py={2}>
                                        <Box
                                            width={'100%'}
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'space-between'}
                                        >
                                            <Box
                                                display={'flex'}
                                                alignItems={'center'}
                                            >
                                                {' '}
                                                <IconButton
                                                    onClick={() => navigate(-1)}
                                                    sx={{
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    <ArrowLeft />
                                                </IconButton>
                                                <Typography
                                                    variant="body1"
                                                    color="text.primary"
                                                >
                                                    {/* Program Overview &nbsp;&gt;&nbsp; */}
                                                    <Typography
                                                        component={'span'}
                                                        variant="subtitle1"
                                                        color="text.primary"
                                                    >
                                                        Send program
                                                    </Typography>
                                                </Typography>
                                            </Box>{' '}
                                        </Box>
                                    </BoxHeader>
                                </Header>{' '}
                                <Content
                                    style={{
                                        marginTop: -8,
                                        paddingBottom: 24,
                                        overflowY: 'auto',
                                    }}
                                    withoutPadding
                                >
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
                                            <Box display={"flex"} height={"100%"} alignItems={"center"}>
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
                                            {/* <Stack direction={"row"} justifyContent={"space-between"}>
                                            <Typography>
                                                Workout 
                                               { equal(Program?.ExercisePlan,original?.ExercisePlan,{strict:true})?"":<Typography sx={{color:"secondary.main",ml:1}} component={"span"}>Edited</Typography>}
                                            </Typography>
                                            <ButtonBase sx={{color:"primary.main",fontSize:16}} onClick={()=> navigate("/sendProgram/" + id + "/workoutCalendar")}>Edit</ButtonBase>
                                            </Stack>
                                            <Divider sx={{my:2}}/>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                            <Typography>
                                                Meal Plan 
                                                { equal(Program?.DietPlan,original?.DietPlan,{strict:true})?"":<Typography sx={{color:"secondary.main",ml:1}} component={"span"}>Edited</Typography>}
                                            </Typography>
                                            <ButtonBase sx={{color:"primary.main",fontSize:16}} onClick={()=> navigate("/sendProgram/" + id + "/createDietPlan")}>Edit</ButtonBase>
                                            </Stack> */}
                                            </Box>

                                      
                                        </Grid>
                                        </Grid>
                                    
                                    </Box>

                                    <Box px={2} mt={2}>
                                        <Stack mb={2}>
                                            {/* <Typography
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
                                            </Typography> */}
                                            {/* <Typography
                                                line={4}
                                                variant="body1"
                                                color="text.secondary"
                                            >
                                                <ReactReadMoreReadLess
                                                    charLimit={120}
                                                    readMoreText={'more'}
                                                    readLessText={'less'}
                                                    readMoreStyle={{
                                                        fontWeight: 'bold',
                                                        color: '#2B4057',
                                                    }}
                                                    readLessStyle={{
                                                        fontWeight: 'bold',
                                                        color: '#2B4057',
                                                    }}
                                                >
                                                    {Program.Description ||
                                                        'No Description'}
                                                </ReactReadMoreReadLess>
                                            </Typography> */}
                                        </Stack>
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
                                                    {/* <Typography variant="subtitle1" color="text.primary">
                    Workout Calendar
                  </Typography> */}
                                                    {/* <ButtonBase
                    onClick={() =>
                      navigate("/sendProgram/" + id + "/workoutCalendar")
                    }
                  >
                    <Typography variant="body1" color="primary.main">
                      Customize
                    </Typography>
                    &nbsp;
                    <Iconify
                      icon={"eva:edit-outline"}
                      width={24}
                      height={24}
                      color="primary.main"
                    />
                  </ButtonBase> */}
                                                </Box>

                                                <SendProgramForm
                                                    Program={Program}
                                                    email={state?.email}
                                                    updateProgram={
                                                        updateProgram
                                                    }
                                                />
                                            </>
                                        )}
                                    </Box>
                                </Content>
                                <FooterBase>
                                    <BoxStyle>
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
                                            {isSentProgram ? (
                                                <Button
                                                    onClick={() =>
                                                        navigate('/', {
                                                            replace: true,
                                                        })
                                                    }
                                                    variant="contained"
                                                    sx={{
                                                      
                                                        minWidth: 160,
                                                       
                                                    }}
                                                >
                                                    Done
                                                    {/* <Iconify
                                                        icon={
                                                            'akar-icons:circle-chevron-right'
                                                        }
                                                        color="white"
                                                        width={20}
                                                        height={20}
                                                    /> */}
                                                </Button>
                                            ) : (
                                                <Button fullWidth
                                                    type="Submit"
                                                    variant="contained"
                                                    disabled={!isConfirmed}
                                                    sx={{
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        minWidth: 132,
                                                    }}
                                                >
                                                    Send program
                                                    
                                                </Button>
                                            )}
                                        </Box>
                                    </BoxStyle>
                                </FooterBase>
                            </Container>
                        )}
                    </Form>
                </FormikProvider>
            </Page>
        </RootStyle>
    )
}
