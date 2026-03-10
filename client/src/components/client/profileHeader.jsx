// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Avatar, Box, Button, IconButton, ListItemButton, Badge, Stack, Typography, ButtonBase } from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import LightboxModal from 'src/components/LightBoxContainer';
import Collapse from '@mui/material/Collapse';
import Iconify from '../Iconify';
import Label from '../Label';

import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router';
import { handleuploadImage } from 'src/utils/uploader';
import { updateProfile } from 'src/redux/actions/Profile';
import { dispatch } from 'src/redux/store';
import Input from 'src/components/Labs/Cropper';
import { updateFeedback } from 'src/redux/actions/feedback';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddImage from 'src/assets/IconSet/AddImage';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useFormikContext } from 'formik';
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 10px',
  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  //zIndex: 100,
  backgroundColor: '#fff',

  borderRadius: '0px 0px 4px 4px',
}));

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
}));
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 16,
  },
}));
// ----------------------------------------------------------------------

export default function MyProfileHeader({ setHeaderDependency, Profile, editmode, view, setView }) {
  const [mini, setMini] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const minimize = () => {
    setMini(!mini);
  };

  const uploadPofilePic = (e) => {
    dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    handleuploadImage(e, `/users/${Profile.email.replace('@', '-AT-').split('.').join('-DOT-')}/profilepic`).then(
      (res) => {
        dispatch({ type: 'UPDATE_FEED', payload: { loading: false } });
        dispatch(updateProfile({ profilePic: res.data.Location }));
      },
    );
  };

  const uploadBannerImage = (e) => {
    dispatch({ type: 'UPDATE_FEED', payload: { loading: true } });
    handleuploadImage(e, `/users/${Profile.email.replace('@', '-AT-').split('.').join('-DOT-')}/profilebanner`).then(
      (res) => {
        dispatch({ type: 'UPDATE_FEED', payload: { loading: false } });
        dispatch(updateProfile({ banner: res.data.Location }));
      },
    );
  };

  const removeBanner = () => {
    dispatch(updateProfile({ banner: '' }));
  };
  const formik = useFormikContext();

  if (editmode)
    return (
      <BoxHeader>
        {/* <Box>
          <Box
            position="relative"
            width="100%"
            height="172px"
            bgcolor={'#f5f5f5'}
          >
            {Profile.banner && (
              <img
                style={{
                  width: '100%',
                  height: '172px',
                  objectFit: 'cover',
                  backgroundColor: '#fff',
                  borderRadius: '0px 0px 8px 8px',
                }}
                onClick={(e) => {
                  document?.getElementById('bannerImage')?.click();
                }}
                src={Profile.banner}
              />
            )}
            <Box
              sx={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '100%',
                height: '100%',

                pl: 2,
                zIndex: 10,
                display: 'flex',

                justifyContent: 'center',
                alignItems: 'center',
              }}
              // onClick={(e) => {
              //   document?.getElementById("bannerImage")?.click();
              // }}
            >
              <IconButtonAnimate
                onClick={(e) => {
                  e.stopPropagation();
                  document?.getElementById('bannerImage')?.click();
                }}
              >
                <Input
                  hidden
                  accept="image/*"
                  type="file"
                  id="bannerImage"
                  onChange={uploadBannerImage}
                  cropShape={'rect'}
                  aspect={2.4}
                  sx={{
                    color: 'primary.main',
                  }}
                />
                <Iconify
                  icon={'weui:camera-outlined'}
                  width={32}
                  height={32}
                  color="common.white"
                />
              </IconButtonAnimate>

            
              {Profile.banner && (
                <IconButtonAnimate
                  onClick={(e) => {
                    removeBanner();
                  }}
                 
                  onChange={uploadBannerImage}
                >
                  <Iconify
                    icon={'iconoir:cancel'}
                    width={24}
                    height={24}
                    color="common.white"
                  />
                </IconButtonAnimate>
              )}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: -40,
                left: 16,
                zIndex: 101,
                width: '80px',
                height: '80px',
              }}
            >
              <Box
                width={'84px'}
                height={'84px'}
                bgcolor={'rgba(0,0,0,0.2)'}
                position={'absolute'}
                zIndex={100}
                borderRadius={'50%'}
                display="flex"
                justifyContent="center"
                alignItems="center"

              >
                <IconButtonAnimate
                  component="label"
                  size={'small'}
                >
                  <Input
                    hidden
                    accept="image/*"
                    id="avatarImage"
                    type="file"
                    aspect={1}
                    onChange={uploadPofilePic}
                    cropShape={'round'}
                  />
                  <Iconify
                    icon={'weui:camera-outlined'}
                    width={24}
                    height={24}
                    color="common.white"
                  />
                </IconButtonAnimate>
              </Box>
              <Avatar
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                }}
                src={Profile.profilePic}
              />
            </Box>
          </Box>

          <Box
            width="auto"
            margin="45px 20px 20px"
          >
            <Box
              display="flex"
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Stack width={'100%'}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  width={'100%'}
                >
                  <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {Profile?.profileName || Profile?.name}
                    <Typography>#{Profile.figgsId}</Typography>
                  </Typography>
                
                </Stack>
           
              </Stack>
            </Box>
          </Box>
        </Box> */}
<Box display={"flex"} alignItems={"center"}  my={4} px={2}>
        <Box >
         
        <Box
              sx={{
                position: 'relative',
               
                zIndex: 101,
                width: '100px',
                height: '100px',
              }}
            >
              <Box
                width={'100px'}
                height={'100px'}
                bgcolor={'rgba(0,0,0,0.2)'}
                position={'absolute'}
                zIndex={100}
                borderRadius={'50%'}
                display="flex"
                justifyContent="center"
                alignItems="center"

              >
                <IconButtonAnimate
                  component="label"
                  size={'small'}
                >
                  <Input
                    hidden
                    accept="image/*"
                    id="avatarImage"
                    type="file"
                    aspect={1}
                    onChange={uploadPofilePic}
                    cropShape={'round'}
                  />
                  <Iconify
                    icon={'weui:camera-outlined'}
                    width={24}
                    height={24}
                    color="common.white"
                  />
                </IconButtonAnimate>
              </Box>
              <Avatar
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                }}
                src={Profile.profilePic}
              />
            </Box>
          </Box>
          <Box>
          <Stack direction={"column"} spacing={0} ml={2}>
            <Typography variant="h5" color="text.primary" sx={{fontSize:24}}>{Profile.profileName || Profile.name}</Typography>
            <Typography variant="body1" color="text.secondary">{Profile.expertise}</Typography>
          </Stack>
          </Box>
        </Box>
      </BoxHeader>
    );
  else
    return (
      <BoxHeader>
        {
          <Box position={'relative'}>
            {false? (
              <Box
                position="relative"
                width="100%"
                height={Profile.banner ? '172px' : 90}
                bgcolor={Profile.banner ? '#fafafa' : '#fff'}
                borderRadius={'0px 0px 8px 8px'}
              >
                {Profile.banner ? (
                  <LightboxModal image={Profile.banner}>
                    <img
                      style={{
                        width: '100%',
                        height: '172px',
                        objectFit: 'cover',
                        backgroundColor: '#fff',
                        borderRadius: '0px 0px 8px 8px',
                      }}
                      src={Profile.banner || '/images/profile-banner.png'}
                    />
                  </LightboxModal>
                ) : (
                  ''
                )}
              </Box>
            ) : (
              ''
            )}

            <Box margin={false ? '-8px 20px 16px' : '32px 20px 16px'}>
              <Box
                display="flex"
                justifyContent={'space-between'}
                alignItems={'center'}
                width="100%"
              >
                <Box>
                  <Box
                    sx={{
                      mr: 2,
                      bottom: -38,
                      left: 16,
                      zIndex: 101,
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '4px solid #fff',
                    }}
                  >
                    <LightboxModal image={Profile.profilePic || '/images/dummyUser.png'}>
                      <Avatar
                        sx={{
                          width: '100%',
                          height: '100%',
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          border: '3px solid #fff',
                        }}
                        src={Profile.profilePic || '/images/dummyUser.png'}
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
                      sx={{ textTransform: 'capitalize', fontSize: '24px' }}
                    >
                      {Profile.profileName || Profile.name}
                      {/* <Typography color={'text.secondary'}>
                                            #{Profile.figgsId}
                                        </Typography> */}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body"
                    color="text.secondary"
                  >
                    {Profile.expertise}
                  </Typography>
                  {/* {!expanded && (
                    <Typography
                      variant="body"
                      color="primary.main"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <b> View more</b>
                    </Typography>
                  )} */}
                </Stack>
              </Box>
              {/* <SeeMoreSeeLess collapsedHeight={0}>
                            <Typography
                                sx={{ mt: 2 }}
                                color="text.primary"
                                
                            >
                               
                                    {Profile.bio || 'No bio found'}
                               
                            </Typography>
                        </SeeMoreSeeLess> */}
              {/* <Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={6} md={4}>
                    <SocialLink />
                  </Grid>
                </Grid>
              </Box> */}
            </Box>
            <Box
              px={3}
              pb={1}
            >
              <Collapse
                in={expanded}
                collapsedSize={0}
              >
                {Profile.bio || 'No bio found'}
                <br />

                <Typography gutterBottom>{Profile.location}</Typography>
                <Typography
                  gutterBottom
                  variant="body"
                  color="primary.main"
                  onClick={() => setExpanded(!expanded)}
                >
                  <b>View less</b>
                </Typography>
              </Collapse>
            </Box>

            <Box
              width={'100%'}
              mt={1}
              display={'flex'}
              sx={{ px: 4, paddingBottom: 3 }}
              justifyContent={'flex-end'}
            >
              <Button
                variant="outlined"
                size={'small'}
                fullWidth
                sx={{ px: 4, height: 36, fontSize: 16 }}
                color={'primary'}
                onClick={() => navigate('/editProfile')}
              >
                Edit profile
              </Button>
            </Box>
          </Box>
        }

       
      </BoxHeader>
    );
}
