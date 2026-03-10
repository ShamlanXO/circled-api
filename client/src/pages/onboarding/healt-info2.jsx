// @mui
import { styled } from '@mui/material/styles'

// components
import Page from '../../components/Page'
// sections
import { Box, Typography, Stack ,Grid} from '@mui/material'
import { useState } from 'react'
import Footer from '../../components/onboarding/footer'
import { useLocation, useNavigate } from 'react-router'
import TextField from '../../components/core/LabeledInput'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import MobileDatePicker from '@mui/lab/MobileDatePicker'
import FooterLayout from 'src/components/Layout/Footer'
import Container from 'src/components/Layout/Container'
import { useConfirmationModalContext } from 'src/utils/Modal'
import HeaderLayout from 'src/components/Layout/Header'
import Content from 'src/components/Layout/Content'
import DropDownSelect from '../../components/core/DropdownSelect'
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal'
import Logo from '../../assets/figgslogo.png'
import { InputAdornment } from '@mui/material'
import MaskedInput from 'src/components/core/MaskedInput'
import { length, mass } from 'units-converter'

import BodyComposition from 'src/assets/IconSet/fitnessProfile/BodyComposition'
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile'
import BodySystemForm from 'src/components/client/bodySystemForm'
import EditDrawer from 'src/components/common/EditDrawerWithCustomView'
import BodyMetrix from 'src/components/client/BodyMetrix'
// ----------------------------------------------------------------------
import Header from '../../components/onboarding/header'
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

export default function HomePage({ mode }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { state } = useLocation()
    const Profile = useSelector((s) => s.Onboarding)
    let [data, setData] = useState({ ...Profile.healthInfo })
    const { showConfirmationModal } = useConfirmationModalContext()
    const setHealtInfo = (att, value) => {
        setData({ ...data, [att]: value })
    }

    const RegisterSchema = Yup.object().shape({
        goals: Yup.string().max(250, 'You have reached the limit'),
        trainingExperience: Yup.string(),
        YearsOfTraining: Yup.number()
            .min(0, 'This field is required')
            .max(250, 'Please enter realistic value'),
        currentJob: Yup.string(),
        faviroteCardio: Yup.string(),
        activityLevel: Yup.string(),
    })
  
    const [unitFormat, setUnitFormat] = useState(1)
    const saveData = (dataNew) => {
        dispatch(updateOnboarding({ healthInfo: { ...dataNew } }))
    }

    const onClickSkip=()=>{
        showConfirmationModal(
            'Are you sure you want to continue without providing it?',
            `The information you're about to skip might be crucial for your trainer to customize or adjust your program effectively`,
            'Skip Anyway',
            'Go Back'
        ).then((res) => {
            if (res) {
                navigate(
                    `/onboarding/${mode == 'client' ? 'client/' : ''}profile-pic`,
                    {
                        state,
                    })
            }
        })
    }
    return (
        <Page title=" Simplified Online Fitness Training ">
           
                    <Container>
                        <Header
                            title={'Create profile'}
                            onClose={() => navigate('/', { state })}
                            // onSkip={onClickSkip}
                        />
                          <Content withoutPadding>
                      {/* <BodyMetrix data={data} setData={setData} saveData={saveData} /> */}
                        {/* <TabContainer sx={{ mb: 4 }}>
                            <Tabs
                                fullWidth
                                variant="fullWidth"
                                value={unitFormat}
                                onChange={(e, n) => setUnitFormat(n)}
                                aria-label=""
                                indicatorColor="none"
                                sx={{
                                    backgroundColor: '#F5F7FA',
                                    borderRadius: 12,
                                    border: '1px solid #E1E7F0',
                                }}
                            >
                                <Tab
                                    label="Metric units"
                                    style={{
                                        minWidth: '100px',
                                    }}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: (theme) =>
                                                theme.palette.common.white,
                                            backgroundColor: (theme) =>
                                                theme.palette.primary.main,
                                            borderRadius: 12,
                                            boxShadow: '0px 1px 7px #E1E7F0',
                                            border: '1px solid #E1E7F0',
                                        },
                                    }}
                                />
                                <Tab
                                    label="US metrics"
                                    style={{
                                        minWidth: '80px',
                                    }}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: (theme) =>
                                                theme.palette.common.white,
                                            backgroundColor: (theme) =>
                                                theme.palette.primary.main,
                                            borderRadius: 12,
                                            boxShadow: '0px 1px 7px #E1E7F0',
                                            border: '1px solid #E1E7F0',
                                        },
                                    }}
                                />
                            </Tabs>
                        </TabContainer> */}

<Box display={'flex'}
                                height={'100%'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                flexGrow={'1'}
                                my={4}
                                px={2}>
                        <Stack spacing={2}>
                            
                              
                        <Typography
                                        variant="h2"
                                        align="left"
                                        sx={{ my: 4 }}
                                    >
                                    Health profile 2
                                    </Typography>
                        <br/>
                        
                        
                            <BodySystemForm
                                part2
                                data={data}
                                setData={setData}
                                saveData={saveData}
                                updateOnboarding={updateOnboarding}
                                Profile={Profile}
                            />
                        </Stack>
                        </Box>
                        {/* <Box bgcolor={"#fff"} px={3} mt={2}  py={3}>
                        <Stack>
                        <Typography  sx={{ mb:-1.5,  fontWeight: 600 ,display:"flex",alignItems:"center"}}>
                        Body images <Typography color={"text.secondary"} sx={{ml:0.5}}>Optional</Typography>
                        </Typography>
                       <PhotoWidget mode={"edit"} data={Profile?.bodyImages} setData={d=>dispatch(updateOnboarding({
                                    bodyImages:d
                                }))}
                                />
                    </Stack>
                        </Box> */}
                    </Content>
                        <FooterLayout>
                            <Footer 
                             nextClick={()=> navigate(
                                `/onboarding/${mode == 'client' ? 'client/' : ''}profile-pic`,
                                {
                                    state,
                                })
                            }
                           
                            back 
                          next

                          nextText={
                            Object.values(Profile.healthInfo).filter(i=>i).length<2?"Skip":"Next"
                          }
                            
                            
                            backClick={() => navigate(-1)} />
                        </FooterLayout>
                      
                    </Container>
              
        </Page>
    )
}
