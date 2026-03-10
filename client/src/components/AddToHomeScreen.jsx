import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Drawer, Snackbar, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import LogoSquare from 'src/assets/IconSet/logo/CircledSquare';
import Safari from 'src/assets/IconSet/addtohome/safari';
import Tray from 'src/assets/IconSet/addtohome/tray';
import Add from 'src/assets/IconSet/addtohome/add';

export default function AddToHomeScreen() {
  const [openSnack, setOpenSnack] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    if (iOSSafari && !navigator.standalone) {
      setOpenSnack(true);
    }
  }, []);

  // const handleInstallPWATForAndroid = () => {
  //   // Check if the app is already installed
  //   if (window.matchMedia('(display-mode: standalone)').matches) {
  //     setOpenSnack(true);
  //     return;
  //   }

  //   // Check if the browser supports PWA installation
  //   if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
  //     // Get the deferred prompt
  //     let deferredPrompt;
  //     window.addEventListener('beforeinstallprompt', (e) => {
  //       // Prevent Chrome 67 and earlier from automatically showing the prompt
  //       e.preventDefault();
  //       // Stash the event so it can be triggered later
  //       deferredPrompt = e;
  //       // Show the install button
  //       setOpenSnack(true);
  //     });

  //     // Handle the install button click
  //     const installPWA = async () => {
  //       if (deferredPrompt) {
  //         // Show the install prompt
  //         deferredPrompt.prompt();
  //         // Wait for the user to respond to the prompt
  //         const { outcome } = await deferredPrompt.userChoice;
  //         // We no longer need the prompt. Clear it up
  //         deferredPrompt = null;
  //         // Hide the install button
  //         setOpenSnack(false);
  //       }
  //     };

  //     return installPWA;
  //   } else {
  //     // Browser doesn't support PWA installation
  //     console.log('PWA installation not supported');
  //     setOpenSnack(true);
  //   }
  // };

  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };
  return (
    <>
      <Snackbar
        open={openSnack}
        //   autoHideDuration={10000}
        //onClose={()=>setOpenSnack(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        ContentProps={{
          sx: {
            background: 'white',
            color: 'text.primary',
          },
        }}
        action={
          <Button
            onClick={() => {
              setOpenSnack(false);
              setDrawerOpen(true);
            }}
            style={{ borderRadius: 12, px: 3 }}
            variant="contained"
          >
            Install
          </Button>
        }
        message={
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            sx={{ width: '100%' }}
            justifyContent={'space-between'}
          >
            <IconButton onClick={() => setOpenSnack(false)}>
              <CloseOutlined />
            </IconButton>
            <LogoSquare sx={{ fontSize: 40, mr: 2 }} />
            <Typography sx={{ width: '100%', flexGrow: 1, pl: 1 }}>
              Install to get the
              <br />
              best experience !
            </Typography>
          </Stack>
        }
        //   action={action}
      />
      <Drawer
        anchor={'bottom'}
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            boxShadow: 'none',
            borderRadius: '12px 12px 0 0',
            padding: '20px',
          },
        }}
        disableBackdropTransition
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Stack
            direction={'row'}
            spacing={2}
            alignItems={'center'}
          >
            <LogoSquare sx={{ fontSize: 50 }} />
            <Typography variant="h3">
              <b>Circled beta</b>
              <br />
              install for best experience
            </Typography>
          </Stack>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Box
          px={2}
          py={2}
        >
          <Box
            width={'100%'}
            mt={2}
          >
            <video
              src={'/videos/add-to-home-screen.mp4'}
              autoPlay
              loop
              muted
              width={'100%'}
              playsInline
            />
          </Box>

          {/* <Stack
            spacing={2}
            mt={3}
            mb={4}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              1. open safari &nbsp; <Safari />
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              2. Tap on &nbsp; <Tray />
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              3. select &nbsp;<i>Add to home screen</i> &nbsp; &nbsp;
              <Add />
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              4. Wait and look for &nbsp;
              <LogoSquare />
              &nbsp; click&nbsp;<Typography color={'primary.main'}>Add</Typography>
            </Typography>
          </Stack> */}
        </Box>
      </Drawer>
    </>
  );
}
