import { Box, Button, Divider, Radio, Drawer as SwipeableDrawer, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../Iconify';
import Label from '../Label';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeedback } from 'src/redux/actions/feedback';
import Checkbox from '@mui/material/Checkbox';
import { MenuItem, Avatar } from '@mui/material';
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });
import DeleteIcon from 'src/assets/IconSet/Delete';
import EyeIcon from 'src/assets/IconSet/eye';
import CopyFile from 'src/assets/IconSet/CopyFile';
import CopyLink from 'src/assets/IconSet/CopyLink';
import ShareIcon from 'src/assets/IconSet/Share';
import UnarchiveIcon from 'src/assets/IconSet/CheckDoc';
import Icon_AddProgramImg from 'src/assets/createProgram/Icon_AddProgram2';
import Send from 'src/assets/IconSet/Email';
import ArchiveIcon from 'src/assets/IconSet/Archive';
import { Unarchive } from '@mui/icons-material';
import { archiveProgram, duplicateProgram } from 'src/redux/actions/createProgram';
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
    event.stopPropagation();
    setDrawerOpen(isOpen);
  };

  const onView = () => {
    toggleDrawer(false);
    navigate(`/editProgram/${props.Program._id}/publishProgram`);
  };

  const ArchiveTheProgram = (id) => {
    dispatch(archiveProgram(id)).then((res) => {
      navigate(-1);
    });
  };

  const onDuplicate = (e) => {
    e.stopPropagation();
    dispatch(duplicateProgram(props.Program._id)).then((res) => {
      setDrawerOpen(false);
    });
  };
  const shareWorkout = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: ` shared a fitness program :`,
          url: `/public/workout-program/${props.Program._id}`,
        })
        .then(() => {});
    }
  };
  const copyWorkout = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/public/workout-program/${props.Program._id}`);

    dispatch(updateFeedback({ snackbar: true, message: 'Copied' }));
  };

  return (
    <div>
      <SwipeableDrawer
        anchor={'bottom'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          },
        }}
      >
        {/* <Box display="flex" justifyContent={"center"} sx={{ mb: 1 }}>
            <img
              src={"/images/bottomDrawerIndicator.png"}
              width={"170px"}
              height="5px"
            />
          </Box> */}

        <Box
          padding={'16px 24px 36px'}
          style={{
            backgroundColor: '#fff',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            component="form"
          >
            <Box
              display="flex"
              alignItems={'center'}
            >
              {Program.BannerImage ? (
                <Avatar
                  variant="rounded"
                  style={{
                    width: '40px',
                    height: '35px',
                    backgroundColor: '#F3F5F8',
                  }}
                  src={Program.BannerImage || 'https://ik.imagekit.io/figgs/undefined1652090438465_y2tsKMW6E'}
                />
              ) : (
                <Icon_AddProgramImg
                  sx={{
                    width: '54px',
                    height: '54px',
                  }}
                />
              )}
              <Typography
                color="text.primary"
                sx={{
                  textTransform: 'capitalize',
                  ml: 1,
                }}
              >
                {Program.Title}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />

            {!Program.IsArchived ? (
              <>
                {' '}
                <MenuItem
                  sx={{ px: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/sendProgram/' + props.Program._id);
                  }}
                >
                  <Send sx={{ mr: 2 }} />
                  <Typography align="center">Send</Typography>
                </MenuItem>
                <MenuItem
                  sx={{ px: 0 }}
                  onClick={shareWorkout}
                >
                  <ShareIcon
                    icon="fluent:share-android-24-regular"
                    sx={{ mr: 2 }}
                  />
                  <Typography align="center">Share</Typography>
                </MenuItem>
              </>
            ) : (
              <MenuItem
                sx={{ px: 0 }}
                onClick={() => props.unarchiveProgram(props.Program._id)}
              >
                <UnarchiveIcon sx={{ mr: 2 }} />
                <Typography align="center">Un-archive</Typography>
              </MenuItem>
            )}
            <MenuItem
              sx={{ px: 0 }}
              onClick={copyWorkout}
            >
              <CopyLink sx={{ mr: 2 }} />
              <Typography align="center">Copy link</Typography>
            </MenuItem>
            <MenuItem
              sx={{ px: 0 }}
              onClick={() => navigate(`/programOverview/${props.Program._id}`)}
            >
              <EyeIcon sx={{ mr: 2 }} />
              <Typography align="center">View</Typography>
            </MenuItem>
            <MenuItem
              sx={{ px: 0 }}
              onClick={onDuplicate}
            >
              <CopyFile sx={{ mr: 1.7, ml: -0.5, fontSize: 30 }} />
              <Typography align="center">Duplicate</Typography>
            </MenuItem>

            <MenuItem
              sx={{ px: 0 }}
              onClick={() => ArchiveTheProgram(props.Program._id)}
            >
              <ArchiveIcon sx={{ mr: 2 }} />
              <Typography align="center">Archive</Typography>
            </MenuItem>
          </Box>
        </Box>
      </SwipeableDrawer>
      <div
        onClick={(e) => {
          e.stopPropagation();
          props.clientSide ? props.onClick() : !props?.Program.IsDraft ? setDrawerOpen(true) : undefined;
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default WorkoutDayBottomDrawer;
