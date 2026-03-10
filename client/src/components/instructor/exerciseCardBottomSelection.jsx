import { Box, Button, Divider, Radio, SwipeableDrawer, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useConfirmationModalContext } from 'src/utils/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import { MenuItem } from '@mui/material';
import AddCircle from 'src/assets/IconSet/AddOutlined';
import Delete from 'src/assets/IconSet/Delete';
import Edit from 'src/assets/IconSet/edit';
import LibraryIcon from 'src/assets/IconSet/DB';
import LibrarySelector from 'src/pages/instructor/library/LibrarySelector';
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

function WorkoutDayBottomDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Program, updateProgram } = props;
  const { showConfirmationModal } = useConfirmationModalContext();
  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor={'bottom'}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        disableBackdropTransition
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {/* <Box display="flex" justifyContent={"center"} sx={{ mb: 1 }}>
          <img
            src={"/images/bottomDrawerIndicator.png"}
            width={"170px"}
            height="5px"
          />
        </Box> */}
        <Box
          padding={'24px 24px 36px'}
          style={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            backgroundColor: '#fff',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            component="form"
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography variant="body">{props?.title}</Typography>
            </Box>
            {/* <Box
              display="flex"
              justifyContent="space-between"
              marginTop="16px"
              alignItems={"center"}
              mb={2}
            >
              <Box display="flex" alignItems={"center"}>
                <Typography variant="body1" color="text.primary">
                  Number of exercises: {props.workouts}
                </Typography>
              </Box>
            </Box> */}

            <Divider sx={{ mb: 1, mt: 2 }} />

            <MenuItem
              sx={{ px: 0 }}
              onClick={() => {
                props.onUploadNew();

                setDrawerOpen(false);
              }}
            >
              <AddCircle
                icon="icon-park-outline:dumbbell"
                sx={{ mr: 2 }}
              />
              <Typography align="center">Upload media</Typography>
            </MenuItem>

            <LibrarySelector
              onBack={() => setDrawerOpen(false)}
              mode="videos"
              slectionMode
              onSelection={(i) => props.onSelection(i)}
            >
              <MenuItem sx={{ px: 0 }}>
                <LibraryIcon sx={{ mr: 4 }} />
                <Typography
                  sx={{ ml: 2 }}
                  align="center"
                >
                  Upload from library
                </Typography>
              </MenuItem>
            </LibrarySelector>
            {/* <LibrarySelector
                            onBack={() => setDrawerOpen(false)}
                            mode="publicVideos"
                            slectionMode
                            onSelection={(i) => props.onSelection(i)}
                        >
                            <MenuItem sx={{ px: 0 }}>
                                <LibraryIcon sx={{ mr: 2 }} />
                                <Typography align="center">
                                    Upload video from public library
                                </Typography>
                            </MenuItem>
                        </LibrarySelector> */}
          </Box>
        </Box>
      </SwipeableDrawer>
      <div
        onClick={(e) => {
          e.stopPropagation();
          props.clientSide ? props.onClick() : setDrawerOpen(true);
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default WorkoutDayBottomDrawer;
