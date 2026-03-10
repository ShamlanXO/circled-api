// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components
import Page from '../../components/Page'
import { length, mass } from 'units-converter'
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

    Switch,
    Grid,
    Divider,
} from '@mui/material'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import Iconify from '../../components/Iconify'
import CarouselBasic1 from 'src/pages/overview/extra/carousel/CarouselBasic1'
import IconHeight from 'src/assets/clientProfile/Icon_Height'
import IconWeight from 'src/assets/clientProfile/Icon_Weight'
import IconPercentage from 'src/assets/clientProfile/Icon_Percentage'
import IconMass from 'src/assets/clientProfile/Icon_Mass'
import BodyComposition from 'src/assets/IconSet/fitnessProfile/BodyComposition'
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile'
import BodySystemForm from 'src/components/client/bodySystemForm'
import EditDrawer from 'src/components/common/EditDrawerWithCustomView'
import { InputBase } from '@mui/material'
import { updateProfile } from 'src/redux/actions/Profile'
import MaskedInput from 'src/components/core/MaskedInput'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#F3F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

const ProgramBox = styled(Box)(({ theme }) => ({
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    margin: '4px 0',
    borderRadius: 16,
    position: 'relative',
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
    justifyContent: 'space-between',
    alignItems: 'center',
}))
// ----------------------------------------------------------------------

export default function MyProfileBodySystem() {
    const { search } = useLocation()
    const Profile = useSelector((s) => s.Profile)
    let [data, setData] = useState({ ...Profile.healthInfo })

    const setHealtInfo = (att, value) => {
        setData({ ...data, [att]: value })
    }

    const query = new URLSearchParams(search)
    const allPrograms = [{}, {}, {}]
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [unitFormat, setUnitFormat] = useState(1)
    const saveData = (dataNew) => {
        dispatch(updateProfile({ healthInfo: { ...dataNew } }))
    }
    const TabContainer = styled(Box)(({ theme }) => ({
        display: 'flex',
        width: '100%',

        justifyContent: 'center',
    }))

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header>
                        <BoxHeader px={2} py={2}>
                            <Box
                                width={'100%'}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >
                                <Box display={'flex'} alignItems={'center'}>
                                    {' '}
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        Body system
                                    </Typography>{' '}
                                </Box>{' '}
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content style={{ padding: '0px', overflowY: 'auto' ,backgroundColor:"#F5F7FA"}}>
                        <Box bgcolor={"#fff"} px={3} mt={2} py={3}>
                            <Box display={'flex'} alignItems={'center'} justifyContent={"space-between"} mb={2}>
                            <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                sx={{display:"flex",alignItems:"center"}}
                            >
                          <BodyComposition style={{marginRight:12}}/>      Body Composition
                            </Typography>

                            <Typography color={'primary'} onClick={()=>setUnitFormat(unitFormat == 0?1:0)}>
                            {unitFormat == 0?"US metrics":"Metric units"}
                            </Typography>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <EditDrawer view={<Box display={'flex'}>
                               
                               <Box>
                                   <Typography
                                       sx={{ fontWeight: 'bold' }}
                                       variant="body1"
                                       color="text.primart"
                                       gutterBottom
                                   >
                                       Height
                                   </Typography>
                                   <Typography variant="body1" color="text.secondary">
                                        {Number(data.height) > 0
                                            ? Number(
                                                  unitFormat == 0
                                                      ? data.height
                                                      : length(
                                                            Number(data.height)
                                                        )
                                                            .from('cm')
                                                            .to('ft').value
                                              ).toFixed(2)
                                            : 0}
                                            {
                                                unitFormat == 0
                                                    ? ' cm'
                                                    : ' ft'
                                            }
                                      </Typography>
                                   </Box>
                                </Box>
                                   
                                   }
                                    title="Height"
                                    field={
                                        <MaskedInput
                                            value={
                                                Number(data.height) > 0
                                                    ? Number(
                                                          unitFormat == 0
                                                              ? data.height
                                                              : length(
                                                                    Number(
                                                                        data.height
                                                                    )
                                                                )
                                                                    .from(
                                                                        'cm'
                                                                    )
                                                                    .to(
                                                                        'ft'
                                                                    ).value
                                                      ).toFixed(2)
                                                    : 0
                                            }
                                            placeholder={'0cm'}
                                            suffix={
                                                unitFormat == 0
                                                    ? ' cm'
                                                    : ' ft'
                                            }
                                            sx={{ width: 'auto' }}
                                            onChange={(e) =>
                                                setHealtInfo(
                                                    'height',
                                                    unitFormat == 0
                                                        ? e.target.value
                                                        : length(
                                                              Number(
                                                                  e.target
                                                                      .value
                                                              )
                                                          )
                                                              .from('ft')
                                                              .to('cm')
                                                              .value
                                                )
                                            }
                                        />
                                   }

                                    />
                                    
                                </Grid>
                   <Grid item xs={3}>
                   <EditDrawer view={<Box display={'flex'} >
                     <Box>
                          <Typography
                            sx={{ fontWeight: 'bold' }}
                            variant="body1"
                            color="text.primart"
                            gutterBottom
                          >
                            Weight
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                             {Number(data.weight) > 0
                                  ? Number(
                                          unitFormat == 0
                                            ? data.weight
                                            : mass(
                                                    Number(data.weight)
                                              )
                                                    .from('kg')
                                                    .to('lb').value
                                     ).toFixed(2)
                                  : 0}
                                  {
                                        unitFormat == 0
                                         ? ' kg'
                                         : ' lbs'
                                  }
                              </Typography>
                          </Box>
                   </Box>
                     }
                        title="Weight"
                        field={
                            <MaskedInput
                                value={
                                    Number(data.weight) > 0
                                        ? Number(
                                            unitFormat == 0
                                                ? data.weight
                                                : mass(
                                                        Number(data.weight)
                                                    )
                                                        .from('kg')
                                                        .to('lb').value
                                        ).toFixed(2)
                                        : 0
                                }
                                placeholder={'0 kg'}
                                suffix={
                                    unitFormat == 0
                                        ? ' kg'
                                        : ' lbs'
                                }
                                sx={{ width: 'auto' }}
                                onChange={(e) =>
                                    setHealtInfo(
                                        'weight',
                                        unitFormat == 0
                                            ? e.target.value
                                            : mass(
                                                Number(e.target.value)
                                            )
                                                .from('lb')
                                                .to('kg')
                                                .value
                                    )
                                }
                            />
                        }
                    />
               </Grid>


               <Grid item xs={3}>
                        
                        <EditDrawer view={<Box display={'flex'}>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}

                                variant="body1"

                                color="text.primary"
                                gutterBottom
                            >
                                Body Fat
                                {/* <Typography


                                    variant="body1" 
                                    color="text.secondary"
                                >
                                    &nbsp; &nbsp;Optional
                                </Typography> */}
                            </Typography>

                            <Typography variant="body1" align='center' color="text.secondary">
                            {data?.bodyFat||"00"}%
                            </Typography>
                        </Box>
                        </Box>
                        }
                        title="Body Fat"
                        field={
                            <MaskedInput

                                value={data.bodyFat}    
                                placeholder={'0%'}
                                suffix={' %'}
                                onChange={(e) =>
                                    setHealtInfo(
                                        'bodyFat',
                                        e.target.value
                                    )
                                }
                            />
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <EditDrawer 
                    view={<Box display={'flex'}>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                            >
                                Lean Mass
                                {/* <Typography

                                    variant="body1"
                                    color="text.secondary"
                                >
                                    &nbsp; &nbsp;Optional
                                </Typography> */}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                {Number(data.leanMass) > 0
                                    ? Number(
                                            unitFormat == 0
                                                ? data.leanMass 
                                                : mass(
                                                        Number(data.leanMass)
                                                    )
                                                        .from('kg') 
                                                        .to('lb').value
                                        ).toFixed(2)
                                    : 0}
                                    {
                                        unitFormat == 0
                                            ? ' kg'
                                            : ' lbs'
                                    }
                            </Typography>
                        </Box>
                    </Box>
                    }
                    title="Lean Mass"
                    field={
                        <MaskedInput
                            value={
                                Number(data.leanMass) > 0
                                    ? Number(
                                        unitFormat == 0
                                            ? data.leanMass
                                            : mass(
                                                    Number(data.leanMass)
                                                )
                                                    .from('kg')
                                                    .to('lb').value
                                    ).toFixed(2)
                                    : 0
                            }
                            placeholder={'0 kg'}
                            suffix={
                                unitFormat == 0
                                    ? ' kg'
                                    : ' lbs'
                            }
                            sx={{ width: 'auto' }}
                            onChange={(e) =>
                                setHealtInfo(
                                    'leanMass',
                                    unitFormat == 0
                                        ? e.target.value
                                        : mass(
                                                Number(e.target.value)
                                            )
                                                .from('lb')
                                                .to('kg')
                                                .value
                                )
                            }
                        />

                    }
                />
            </Grid>
                    


                                    


                               
                            </Grid>
                        </Box>
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

<Box bgcolor={"#fff"} px={3} mt={2}  py={3}>
                        <Stack spacing={2}>
                            

                        
                          
                            <Typography
                                variant="h5"
                                color="text.primary"
                                gutterBottom
                                display={"flex"}
                                alignItems={"center"}
                            >
                             <HealthProfile style={{marginRight:12}} />   Health profile
                            </Typography>
                            <BodySystemForm
                                data={data}
                                setData={setData}
                                saveData={saveData}
                            />
                        </Stack>
                        </Box>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
