// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemButton,
  Stack,
  ButtonBase,
  Divider,
  Typography,
  Grid,
  Drawer,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import Label from '../Label';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import LightboxModal from 'src/components/LightBoxContainer';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { useNavigate } from 'react-router';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import SocialLink from '../instructor/SocialLink';
import SeeMoreSeeLess from '../common/SeeMoreSeeLess';
import ShowMoreText from 'react-show-more-text';
import TextMaxLine from 'src/components/TextMaxLine';
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
  //boxShadow: "0px 4px 54px #E1E7F0",
  // borderRadius: "0px 0px 8px 8px",
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

// ----------------------------------------------------------------------

export default function ProfileHeader({ setHeaderDependency, myInstructor, clientMyprofile, Profile }) {

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to truncate text to first 10 words
  const truncateToWords = (text, wordLimit = 20) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const handleShowMore = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <BoxHeader>
      {
        <Box position={'relative'}>
          {false ? (
            <Box
              position="relative"
              width="100%"
              height={Profile.banner ? '118px' : 90}
              bgcolor={Profile.banner ? '#fafafa' : '#fff'}
              borderRadius={'0px 0px 8px 8px'}
            >
              {Profile.banner ? (
                <LightboxModal image={Profile.banner}>
                  <img
                    style={{
                      width: '100%',
                      height: '118px',
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

          <Box
            width="100%"
            margin={false ? '-8px' : '32px 0px 0px'}
            paddingLeft={3}
            paddingRight={3}
          >
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
                    width: '100px',
                    height: '100px',
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
              </Stack>
            </Box>
          </Box>

          <Box
            width={'100%'}
            display={'flex'}
            sx={{ px: 4, paddingBottom: 3 }}
            justifyContent={'flex-end'}
          >
            {myInstructor ? (
              <></>
            ) : (
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
              <Button
                variant="outlined"
                size={'small'}
                fullWidth
                sx={{ px: 4, height: 36, fontSize: 16, mt: 3 }}
                color={clientMyprofile ? 'secondary' : 'primary'}
                onClick={() => navigate('/instructor/editProfile')}
              >
                Edit profile
              </Button>
            )}
          </Box>
          {Profile.bio ? (
            <>
            
              <Box
                width={'100%'}
                sx={{ px: 3, mb: 2 }}
              >
                <Typography
                  variant="h5"
                  color="text.primary"
                >
                  About
                </Typography>
               
                  <Typography color="text.primary">
                    {truncateToWords(Profile.bio)}
                  </Typography>
                  {Profile.bio.split(' ').length > 20 && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleShowMore}
                      sx={{ p: 0, minWidth: 'auto', textTransform: 'none',fontSize:18 }}
                    >
                      Read more
                    </Button>
                  )}
              
              </Box>
            </>
          ) : (
            ''
          )}
        </Box>
      }

      {/* Drawer for full bio */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
            minHeight: '50vh',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
           
            <IconButton onClick={handleCloseDrawer}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>
          <Typography variant="h5"  color="text.primary" sx={{fontSize:24,mb:2}} >About the trainer</Typography>
          <Typography color="text.primary" sx={{ lineHeight: 1.6 }}>
            {Profile.bio}
          </Typography>
        </Box>
      </Drawer>
    </BoxHeader>
  );
}

