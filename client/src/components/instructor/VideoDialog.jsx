import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, Box,
   FormControlLabel, Checkbox, 
   Typography, 
   Stack, Divider, 
   DialogActions,
   Button
    } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Content from '../Layout/Content';
import FooterBase from '../Layout/Footer';

export default function VideoDialog({ open, onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // useEffect(() => {
  //   // Check if user has previously chosen not to show the video
  //   const shouldShowVideo = localStorage.getItem('showCreateProgramVideo');
  //   if (shouldShowVideo === 'false') {
  //     onClose();
  //   }
  // }, []);

  const handleClose = () => {
    // if (dontShowAgain) {
    //   localStorage.setItem('showCreateProgramVideo', 'false');
    // }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      fullWidth

    >
    
      <DialogContent>
        <Box >
      <Box
                display={'flex'}
           
                mt={6}
                
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: 28,
                    fontWeight: 600,
                  }}
                  align={'left'}
                >
                Build your program in a <br/>
super easy way.
    


                </Typography>
              </Box>
        
             
              <Box
                flexGrow={'1'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                mt={6}
              >
                <Stack
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                  px={1}
                  spacing={3}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                   
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                    
                    <Box
                      width={'100%'}
                      mt={1}
                    
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                        
                      >
                        
1 Program description
                      </Typography>

                      <Typography
                        variant="body"
                        align={'left'}
                        color={'text.secondary'}
                      >
                       Set-up and write all the important
details of the program you are 
building

                      </Typography>
                    </Box>
        
                    <Box width={'35%'}>
                      { <img src={'/images/AppImages/createProgram/program.png'} />}
                    </Box>
                  </Box>

                  <Divider sx={{width:'100%'}} />


                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                   
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                  
                    <Box
                      width={'100%'}
                      mt={1}
                    
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                      >
                     
2 Workout plan
                      </Typography>

                      <Typography
                        variant="body"
                        align={'left'}

                        color={'text.secondary'}
                      >
                    Set-up and write all the important
details of the program you are 
building

                      </Typography>
                    </Box>
                    <Box
                      width={'35%'}
                    
                    >
                      {<img src={'/images/AppImages/createProgram/dumbell.png'} />}
                    </Box>
                  </Box>
                  <Divider sx={{width:'100%'}} />
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                 
                    <Box
                      width={'100%'}
                      mt={1}
                      
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                      >
                    
3 Publish program
                      </Typography>
                      <Box>
                        <Typography
                          variant="body"
                          align={'left'}
                          color={'text.secondary'}
                        >
                          
publish your program in your 
profile and marketplace
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={'35%'}>
                     <img src={'/images/AppImages/createProgram/coach.png'} />
                    </Box>
                  </Box>
                </Stack>
              </Box>
          

          
     
             
            </Box>
        
          </DialogContent>
          <DialogActions>
              <Button fullWidth variant='contained' color='primary' onClick={() => handleClose()}>
               
                Start building
              
              </Button>
              </DialogActions>
      {/* <DialogContent>
        <Box
          mt={2}
          sx={{ position: 'relative', paddingTop: '56.25%' }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src="https://www.youtube.com/embed/VvK2sVbhKJQ"
            title="How to Create a Program"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Don't show this video again"
          />
        </Box>
      </DialogContent> */}
    </Dialog>
  );
}
