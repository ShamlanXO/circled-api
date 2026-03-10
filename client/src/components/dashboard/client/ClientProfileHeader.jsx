// @mui
import { styled } from '@mui/material/styles'
// components
// sections
import {
    Avatar,
    Box,
    Button,
    IconButton,
    ListItemButton,
    Stack,
    Grid,
    ButtonBase,
    Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import Iconify from '../../Iconify'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import { useNavigate } from 'react-router'
import ProgramList from './../ProgramList'
import { IconButtonAnimate } from 'src/components/animate'
import { Profile } from 'src/sections/@dashboard/user/profile'
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem'
import IconPhotos from 'src/assets/clientProfile/Icon_Photos'
import MessageIcon from 'src/assets/common/message'
import IconSups from 'src/assets/clientProfile/Icon_Sups'
import LightboxModal from 'src/components/LightBoxContainer'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// ----------------------------------------------------------------------

const BoxHeader = styled(Box)(() => ({
    width: '100%',
    //zIndex: 100,
    backgroundColor: '#FBFBFB',

  pb:2
}))

// ----------------------------------------------------------------------

export default function ClientProfileHeader({
    setHeaderDependency,
    Profile,
    Program,
    view,
    setView,
}) {
    const [mini, setMini] = useState(true)
    const navigate = useNavigate()
    const minimize = () => {
        setMini(!mini)
        setTimeout(() => {
            setHeaderDependency(mini)
        }, 300)
    }
    const activityLevelOptions = {
        Light: 'Light: 1-3 times a week',
        Moderate: 'Moderate: 4-5 times a week',
        Active: 'Active: intense 4-5 times a week',
        'Very active': 'Very active: intense 6-7 times a week',
    }

    return (
        <BoxHeader >
            
                <Box pb={4}>
               
               <Box >
                    {false?<Box
                        position="relative"
                        width="100%"
                        height={Profile.banner?"172px":90}
                        bgcolor={"#FBFBFB"}
                        borderRadius= {'0px 0px 8px 8px'}

                    >
                        {Profile.banner?<LightboxModal image={Profile.banner}>
                            <img
                                style={{
                                    width: '100%',
                                    height: '172px',
                                    objectFit: 'cover',
                                    backgroundColor: '#fff',
                                    borderRadius: '0px 0px 8px 8px',
                                }}
                                src={
                                    Profile.banner ||
                                    '/images/profile-banner.png'
                                }
                            />
                        </LightboxModal>:""}
               
                   
                    
                    </Box>:""}

                    <Box width="100%" padding={Profile.banner?"-8px 20px 16px":"32px 20px 0px"}>
                        <Box
                            display="flex"
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            width="100%"
                        >
                            <Box>
                            <Box
                            sx={{
                                mr:2,
                                bottom: -38,
                                left: 16,
                                zIndex: 101,
                                width: '88px',
                                height: '88px',
                                borderRadius:'50%',
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                border: '4px solid #fff',
                            }}
                        >
                            <LightboxModal
                                image={
                                    Profile.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            >
                                <Avatar
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius:"50%",
                                        border: '3px solid #fff',
                                    }}
                                    src={
                                        Profile.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </LightboxModal>
                        </Box>
                            </Box>
                            <Stack width="100%">
                                <Stack
                                    direction={'row'}
                                    alignItems={'flex-end'}
                                    flexGrow={1}
                                    width={'100%'}
                                    justifyContent={'space-between'}
                                >
                                    <Typography
                                        variant="h5"
                                        color="text.primary"
                                        sx={{ textTransform: 'capitalize' ,fontSize:28}}
                                    >
                                           {Profile.profileName||Profile.name}
                                        {/* <Typography color={'text.secondary'}>
                                            #{Profile.figgsId}
                                        </Typography> */}
                                    </Typography>

                                </Stack>
                                {/* <Typography
                                    variant="body"
                                    color="text.secondary"
                                   
                                >
                                    #{Profile.figgsId}
                                </Typography> */}
                               
                            </Stack>
                        </Box>
                   
                        
                    </Box>
                 

                </Box>

                    {/* <Box width="auto" margin="45px 24px 0px">
                       
                        <Box mt={2}>
                            <Tabs
                                value={view}
                                variant="fullWidth"
                                centered
                                onChange={(e, val) => setView(val)}
                            >
                             
                                <Tab
                                    value="program"
                                    label={
                                        <Typography
                                            sx={{
                                                fontSize: 18,
                                                fontWeight:
                                                    view == 'program'
                                                        ? 'bold'
                                                        : 300,
                                            }}
                                        >
                                            {`Program`}
                                        </Typography>
                                    }
                                />
                                   <Tab
                                    value="about"
                                    label={
                                        <Typography
                                            sx={{
                                                fontSize: 18,
                                                fontWeight:
                                                    view == 'about'
                                                        ? 'bold'
                                                        : 300,
                                            }}
                                        >
                                            {`About`}
                                        </Typography>
                                    }
                                />
                            </Tabs>
                        </Box>
                    </Box> */}
                   
                </Box>
        
            
        </BoxHeader>
    )
}
