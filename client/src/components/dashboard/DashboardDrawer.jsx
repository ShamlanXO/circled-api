// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import {
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  ListItem,
  Stack,
  Typography,
  Button,
  ButtonBase,
  Divider,
  Drawer,
  List,
} from '@mui/material';

import Iconify from '../Iconify';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile } from 'src/redux/actions/Profile';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { signOut } from 'src/redux/actions/common';
import Icon_Feedback from 'src/assets/common/Icon_Feedback';
import ProfileIcon from 'src/assets/IconSet/Profile';
import DraftIcon from 'src/assets/IconSet/Dft';
import SupportIcon from 'src/assets/IconSet/Support';
import QuestionIcon from 'src/assets/IconSet/Question';
import Setting from 'src/assets/IconSet/Setting';
import ArchiveIcon from 'src/assets/IconSet/Archive';
import Payment from 'src/assets/IconSet/Payment';
import SmileIcon from 'src/assets/IconSet/Smile';
import BugIcon from 'src/assets/IconSet/Bug';
import Switch from 'src/assets/IconSet/SwitchIcon';
import PersonalInfo from 'src/assets/IconSet/PersoalInfo';
import ArrowRight from 'src/assets/IconSet/ArrowRight';
import ContactIcon from 'src/assets/IconSet/Headphone';
import Guide from 'src/assets/IconSet/Guide';
import { ArrowForwardIosRounded, ArrowRightRounded } from '@mui/icons-material';

// ----------------------------------------------------------------------

const HeadStyle = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  paddingLeft: 24,
  paddingRight: 24,

  paddingTop: 24,
  position: 'sticky',
  zIndex: 100,
  top: 0,
}));

// ----------------------------------------------------------------------

export default function DashboardDrawer(props) {
  const { newCard } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const navigate = useNavigate();

  const clients = useSelector((state) => state?.ProgramList?.clients?.clients?.length);

  const program = useSelector(
    (state) =>
      state.ProgramList.Programs.filter(
        (item) => item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false,
      ).length,
  );
  const drafts = useSelector(
    (state) => state.ProgramList.Programs.filter((i) => i.IsDraft == true && i.IsDeleted == false).length,
  );

  const archived = useSelector((state) => state.ProgramList.Programs.filter((i) => i.IsArchived == true).length);
  const Profile = useSelector((s) => s.Profile);
  const swichAccount = () => {
    dispatch(
      updateFeedback({
        loading: true,
        sAnimate: true,
        message: '',
        description: '',
        profileType: Profile.type == 'Athlete' ? 'Instructor' : 'Athlete',
      }),
    );
    dispatch(
      updateProfile({
        type: Profile.type == 'Athlete' ? 'Instructor' : 'Athlete',
      }),
    ).then((res) => {
      setTimeout(() => {
        dispatch(
          updateFeedback({
            loading: false,
            sAnimate: false,
            profileType: '',
          }),
        );
      }, 4000);

      navigate('/');
    });
  };
  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        // ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: '80vw',
            backgroundColor: (theme) => theme.palette.background.white,
          },
        }}
      >
        <HeadStyle>
          <Stack
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            sx={{ mb: 1.5 }}
          >
            <Avatar
              sx={{
                width: '60px',
                height: '60px',
                marginRight: 1,
              }}
              src={Profile.profilePic}
              onClick={() => navigate(props.client ? '/myProfile' : '/instructor/profile')}
            />
            {Profile.type == 'Instructor' && (
              <Box onClick={() => navigate('/clients')}>
                <Typography
                  align="center"
                  variant="h4"
                  color="text.primary"
                >
                  {clients}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Clients
                </Typography>
              </Box>
            )}
            {Profile.type == 'Instructor' && (
              <Box>
                <Typography
                  align="center"
                  variant="h4"
                  color="text.primary"
                >
                  {program}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Programs
                </Typography>
              </Box>
            )}
          </Stack>
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ textTransform: 'capitalize', mb: 0.5 }}
            >
              {Profile.profileName || Profile.name}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              #{Profile.figgsId}
            </Typography>
            <Button
              sx={{ p: 0, fontSize: 16, py: 0, height: 32 }}
              onClick={() => navigate(props.client ? '/myProfile' : '/instructor/profile')}
            >
              View profile
            </Button>
          </Box>
          <Divider sx={{ mt: 2 }} />
        </HeadStyle>
        <Box
          height={'100%'}
          px={3}
          //sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
        >
          {Profile.type == 'Instructor' ? (
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                pt: 3,
              }}
            >
              <Typography variant="subtitle1">Program manager</Typography>

              <Stack
                spacing={4}
                mt={3}
              >
                <ListItemButton
                  disablePadding
                  sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                  onClick={() => navigate('/drafts')}
                >
                  <Stack
                    direction={'row'}
                    spacing={0.5}
                  >
                    {' '}
                    <DraftIcon
                      width={24}
                      height={24}
                      sx={{
                        height: 24,
                        width: 24,
                      }}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Typography color="text.primary">
                      Draft &nbsp; &nbsp;
                      <span>{drafts}</span>
                    </Typography>
                  </Stack>

                  <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
                </ListItemButton>

                <ListItemButton
                  disablePadding
                  sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                  onClick={() => navigate('/archives')}
                >
                  <Stack
                    direction={'row'}
                    spacing={0.5}
                  >
                    {' '}
                    <ArchiveIcon
                      color="text.primary"
                      width={24}
                      height={24}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Typography color="text.primary">
                      Archived &nbsp; &nbsp;
                      <span
                        style={{
                          fontWeight: 'normal',
                        }}
                      >
                        {archived}
                      </span>
                    </Typography>
                  </Stack>
                  <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
                </ListItemButton>
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ) : (
            ''
          )}

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              pt: 3,
            }}
          >
            <Typography variant="subtitle1">Account settings </Typography>

            <Stack
              spacing={4}
              mt={3}
            >
              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/accountSettings')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  {' '}
                  <PersonalInfo
                    width={24}
                    height={24}
                    sx={{
                      height: 24,
                      width: 24,
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Personal information</Typography>
                </Stack>

                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>

              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/payment')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  {' '}
                  <Payment
                    color="text.primary"
                    width={24}
                    height={24}
                  />{' '}
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Payments</Typography>
                </Stack>
                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>
              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={swichAccount}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  {' '}
                  <Switch
                    color="text.primary"
                    width={24}
                    height={24}
                  />{' '}
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">
                    Switch to {Profile.type == 'Athlete' ? 'trainer' : 'athlete'}{' '}
                  </Typography>
                </Stack>
                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              pt: 3,
            }}
          >
            <Typography variant="subtitle1">Referrals and benefits</Typography>

            <Stack
              spacing={4}
              mt={3}
            >
              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/invite-trainer')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  <SmileIcon color="text.primary" />
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Invite a trainer</Typography>
                </Stack>

                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              pt: 3,
            }}
          >
            <Typography variant="subtitle1">Support</Typography>

            <Stack
              spacing={4}
              mt={3}
            >
              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/feedback')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  <SupportIcon color="text.primary" />
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Give us a feedback</Typography>
                </Stack>

                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>

              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/bugreport')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  <BugIcon color="text.primary" />
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Report a bug</Typography>
                </Stack>
                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>
              {/* <ListItemButton
                    disablePadding
                   
                        sx={{ pr:0,width:"100%",justifyContent:"space-between",height:24 ,pl:0,pb:0,pt:0}}
                        onClick={() => navigate('/help')}
                    >
                       <Stack direction={"row"} spacing={0.5}>  
                       <ContactIcon width={24} height={24} />
                                &nbsp;&nbsp;&nbsp;
                                <Typography
                               
                                    color="text.primary"
                                >
                                 Contact us
                                   
                                </Typography>
                                </Stack>
                                <ArrowForwardIosRounded sx={{fontSize:18}}/>
                        </ListItemButton> */}

              <ListItemButton
                disablePadding
                sx={{ pr: 0, width: '100%', justifyContent: 'space-between', height: 24, pl: 0, pb: 0, pt: 0 }}
                onClick={() => navigate('/help')}
              >
                <Stack
                  direction={'row'}
                  spacing={0.5}
                >
                  <Guide
                    width={24}
                    height={24}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Typography color="text.primary">Guide</Typography>
                </Stack>
                <ArrowForwardIosRounded sx={{ fontSize: 18 }} />
              </ListItemButton>
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>

          <Box></Box>
          <Box
            sx={{
              bottom: 0,
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <ListItemButton
              disablePadding
              sx={{ pr: 0, py: 4, width: '100%', justifyContent: 'space-between', height: 24, pl: 0 }}
              onClick={() => signOut()}
            >
              <Stack
                direction={'row'}
                spacing={0.5}
              >
                <Iconify
                  icon={'tabler:logout'}
                  width={24}
                  height={24}
                />
                &nbsp;&nbsp;&nbsp;
                <Typography color="text.primary">Sign out</Typography>
              </Stack>
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      <div onClick={() => handleDrawerOpen()}>{props.children}</div>
    </div>
  );
}
