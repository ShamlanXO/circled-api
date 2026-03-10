// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    Button,
    IconButton,
    ListItemButton,
    Stack,
    ButtonBase,
    Typography,
    Grid,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import Label from '../Label'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import LightboxModal from 'src/components/LightBoxContainer'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import { useNavigate } from 'react-router'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import SocialLink from '../instructor/SocialLink'
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    maxWidth: 'xs',
    zIndex: 100,
    borderRadius: '0px 0px 8px 8px',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    //zIndex: 100,
    backgroundColor: '#fff',
    //boxShadow: "0px 4px 54px #E1E7F0",
    // borderRadius: "0px 0px 8px 8px",
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

export default function ProfileHeader({
    setHeaderDependency,
    myInstructor,
    clientMyprofile,
    Profile,
}) {
    const [mini, setMini] = useState(true)
    const navigate = useNavigate()
    const minimize = () => {
        setMini(!mini)
        setTimeout(() => {
            setHeaderDependency(!mini)
        }, 300)
    }
    return (
        <BoxHeader>
            {
                <Box>
                    <Box
                        position="relative"
                        width="100%"
                        height="172px"
                        bgcolor={'#fafafa'}
                        borderRadius= {'0px 0px 8px 8px'}

                    >
                        <LightboxModal image={Profile.banner}>
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
                        </LightboxModal>
               
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -38,
                                left: 16,
                                zIndex: 101,
                               borderRadius:"50%",
                               width:84,
                                
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
                                       
                                        borderRadius:"50%",
                                    }}
                                    src={
                                        Profile.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </LightboxModal>
                        </Box>
                    </Box>

                    <Box width="auto" margin="42px 20px 16px">
                        <Box
                            display="flex"
                            justifyContent={'space-between'}
                            alignItems={'flex-start'}
                            width="100%"
                        >
                            <Stack >
                                <Stack
                                    direction={'row'}
                                    alignItems={'center'}
                                    flexGrow={1}
                                    width={'100%'}
                                    justifyContent={'space-between'}
                                >
                                    <Typography
                                        variant="h5"
                                        color="text.primary"
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                           {Profile.profileName||Profile.name}
                                        {/* <Typography color={'text.secondary'}>
                                            #{Profile.figgsId}
                                        </Typography> */}
                                    </Typography>

                                    {myInstructor ? (
                                        <></>
                                        // <Button
                                        //     variant="contained"
                                        //     color="primary"
                                        //     sx={{ height: 40, px: 2 }}
                                        //     onClick={() =>
                                        //         navigate('/messages')
                                        //     }
                                        // >
                                        //     <Iconify
                                        //         icon="jam:messages-alt"
                                        //         width={24}
                                        //         height={24}
                                        //         color="common.white"
                                        //     />
                                        //     &nbsp;&nbsp;Message
                                        // </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size={'small'}
                                            sx={{ mt: -3 }}
                                            color={
                                                clientMyprofile
                                                    ? 'secondary'
                                                    : 'primary'
                                            }
                                            onClick={() =>
                                                navigate(
                                                    '/instructor/editProfile'
                                                )
                                            }
                                        >
                                            {/* <Iconify
                    icon={"eva:edit-outline"}
                    width={24}
                    height={24}
                    color={clientMyprofile ? "secondary.main" : "primary.main"}
                  />
                  &nbsp;&nbsp; */}
                                            Edit profile
                                        </Button>
                                    )}
                                </Stack>
                                <Typography
                                    variant="body"
                                    color="text.secondary"
                                    sx={{mt:0.5}}
                                >
                                    {Profile.expertise}
                                </Typography>
                            </Stack>
                           {mini&& <Button size={"small"} onClick={()=>setMini(!mini)} style={{paddingTop:0,paddingBottom:0,fontSize:16}}>
                                View profile
                            </Button>}
                        </Box>
                        <Collapse in={!mini}>
                            <Typography
                                sx={{ mt: 2 }}
                                color="text.primary"
                                
                            >
                               
                                    {Profile.bio || 'No bio found'}
                                {/* </ReactReadMoreReadLess> */}
                            </Typography>
                            {/* <Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={6} md={4}>
                    <SocialLink />
                  </Grid>
                </Grid>
              </Box> */}
                        </Collapse>
                    </Box>
                </Box>
            }

            {/* <center>
                <Box
                    component={ButtonBase}
                    onClick={minimize}
                    display="flex"
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    {mini && (
                        <Typography
                            variant="caption"
                            color={'text.secondary'}
                            sx={{ mb: -1 }}
                        >
                            {mini ? 'More' : 'Less'}
                        </Typography>
                    )}
                    <Iconify
                        sx={{ color: 'text.secondary' }}
                        icon={
                            mini
                                ? 'ic:round-keyboard-arrow-down'
                                : 'ic:round-keyboard-arrow-up'
                        }
                        width="24px"
                        height="24px"
                    />
                    {!mini && (
                        <Typography
                            variant="caption"
                            color={'text.secondary'}
                            sx={{ mt: -1 }}
                        >
                            {mini ? 'More' : 'Less'}
                        </Typography>
                    )}
                </Box>
            </center> */}
        </BoxHeader>
    )
}
