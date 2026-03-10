// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
// components
import Page from '../../components/Page';
import TextMaxLine from 'src/components/TextMaxLine';
import { useMemo } from 'react';

// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Avatar,
  ButtonBase,
  InputAdornment,
  IconButton,
  Divider,
  StepLabel,
  StepContent,
  Step,
  Stepper,
  Tabs,
  Tab,
  Badge,
  TextField,
  ListItem,
  BottomNavigation,
  ListItemButton,
} from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import Iconify from '../../components/Iconify';
import BottomAction from '../../components/common/BottomAction';
import FooterBase from '../../components/Layout/Footer';
import { TabContext, TabPanel } from '@mui/lab';
import InstructorHeader from 'src/components/home/HomeHeader';
import { searchItemByKey } from 'src/utils/search.js';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import { getChatUsers } from 'src/redux/actions/chat';
import { useDispatch, useSelector } from 'react-redux';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import DbIcon from 'src/assets/IconSet/MoreIcon';
import Logo from 'src/assets/figgslogo.png';
import Countdown from 'react-countdown';
import DeleteIcon from 'src/assets/IconSet/Delete';
import { useConfirmationModalContext } from 'src/utils/Modal';
import moment from 'moment';
import InviteClientDrawer from 'src/components/instructor/InviteClientDrawer';
import { is } from 'immutable';
import { title } from 'src/_mock/text';
import { deleteInvitation, resendinvitation } from 'src/redux/actions/invite';
import { getClients } from 'src/redux/actions/clientExercise';
import useSocket from 'src/hooks/useSocket';
import { updateOnboarding } from 'src/redux/actions/Onboarding';
import { updateFeedback } from 'src/redux/actions/feedback';

const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  position: 'relative',
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
}));
const UnreadCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isClientSide',
})(({ isClientSide, theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '24px',
  color: '#fff',
  display: 'flex',
  width: '24px',
  height: '24px',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 14,
}));
const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));
// ----------------------------------------------------------------------

export default function MessagesPage() {
  const [isClientSide, setIsClientSide] = useState(true);
  const [allNotification, setAllNotification] = useState([{}, {}, {}, {}, {}, {}]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('clients');
  const [searchKey, setSearchKey] = useState('');
  const [currentView, setCurrentView] = useState('active');
  const [current, setCurrent] = useState(0);
  const { socket, isConnected } = useSocket();
  const handleTabChange = (event, newValue) => {
    console.log(newValue);

    setCurrent(newValue);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChatUsers());
    dispatch(getClients());
  }, []);

  useEffect(() => {
    if (isConnected) {
      socket.on('accept-invite', (data) => {
        dispatch(getClients());
      });
    }
  }, [isConnected]);
  const Profile = useSelector((s) => s.Profile);

  const clients = useSelector((state) => state.ProgramList.clients.clients);

  const pending = useSelector((state) => state.ProgramList.clients.pending);
  const { showConfirmationModal } = useConfirmationModalContext();

  const DeleteInvitation = (id) => {
    showConfirmationModal('Are you sure?', `You are going to delete this invitation`, 'Delete').then((res) => {
      if (res) {
        dispatch(deleteInvitation(id)).then((respon) => {
          dispatch(getClients());
        });
      }
    });
  };
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: '1 min',
      mm: '%d min',
      h: '1 hr',
      hh: '%d hr',
      d: '1 day',
      dd: '%d days',
      M: '1 month',
      MM: '%d months',
      y: '1 year',
      yy: '%d years',
    },
  });

  const resendInvite = (id) => {
    dispatch(resendinvitation({ _id: id })).then((res) => {
      dispatch(getClients());
    });
  };

  const { pendingClients, clientsList } = useMemo(() => {
    if (searchKey == '') {
      return { pendingClients: pending, clientsList: clients };
    }

    const pendingClients = searchItemByKey(pending, ['email'], searchKey);
    const clientsList = searchItemByKey(clients, ['client.name', 'userPurchaseProgram.Program.Title'], searchKey);
    return { pendingClients, clientsList };
  }, [searchKey]);

  return (
    <RootStyle>
      <Page title="Notifications">
        <Container>
          {' '}
          <Header>
            <Box
              pt={2}
              borderRadius={4}
              overflow={'hidden'}
            >
              <Box
                width={'100%'}
                display={'flex'}
                px={2}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="body1"
                    color="text.primary"
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                    >
                      {/* {mode == "edit"
                      ? "Program Overview"
                      : mode === "customize"
                      ? "Client Profile"
                      : "Home"}
                    &nbsp;&gt;&nbsp; */}
                      <Typography
                        color="text.primary"
                        sx={{
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}
                      >
                        Client
                      </Typography>
                    </Box>
                  </Typography>{' '}
                </Box>{' '}
              </Box>
            </Box>
            <Box sx={{ px: 2, mt: 2 }}>
              <TextField
                fullWidth
                placeholder={isClientSide ? 'Search name, tag or program' : 'Search name, tag or program'}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                InputProps={{
                  sx: { height: 48 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Iconify
                          icon={'eva:search-fill'}
                          width={24}
                          height={24}
                          sx={{ color: '#95A3B8' }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              {/* <Tabs
                                variant="fullWidth"
                                value={currentView}
                                onChange={(e, v) => setCurrentView(v)}
                            >
                                <Tab
                                    label={
                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    currentView == 'active'
                                                        ? 'bold'
                                                        : 300,
                                                fontSize: 18,
                                            }}
                                        >
                                            {`Active ( ${
                                                clients.filter(
                                                    (i) => i.isActive
                                                ).length
                                            } )`}
                                        </Typography>
                                    }
                                    value="active"
                                />
                                <Tab
                                    label={
                                        <Typography
                                            sx={{
                                                fontWeight:
                                                    currentView == 'inactive'
                                                        ? 'bold'
                                                        : 300,
                                                fontSize: 18,
                                            }}
                                        >
                                            {`In-active ( ${
                                                clients.filter(
                                                    (i) => !i.isActive
                                                ).length
                                            } )`}
                                        </Typography>
                                    }
                                    value="inactive"
                                />
                            </Tabs> */}
              {/* <Typography
                                variant="body1"
                                color={'text.primary'}
                                sx={{ fontWeight: 600, mb: 1 }}
                            >
                                Clients ( {clients.length} )
                            </Typography> */}
            </Box>
            {/* <Box
                            width={'100%'}
                            height={8}
                            bgcolor={'#F5F7FA'}
                        ></Box> */}
          </Header>{' '}
          <Content
            withoutPadding
            style={{
              paddingTop: 8,
              paddingBottom: 48,

              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              ml={2}
              mb={2}
            >
              {/* <Iconify icon={"ic:round-add"} sx={{color:"primary.main", fontSize:18}}/> */}
              {/* <BottomAction
                      items={[
                        {
                          title: "Mail",
                          icon: <Iconify icon={"fluent:mail-16-regular"} sx={{fontSize:32,mr:1}}/>,
                            onClick: () => {
                                navigate("/invite");
                            },
                        },
                        {
                            title: "Share",
                            icon: <Iconify icon={"solar:share-outline"} sx={{fontSize:32,mr:1}}/>,
                            onClick: () => {
                                navigate("/share");
                            },
                        },
                        {
                            title: "Copy link",
                            icon: <Iconify icon={"ep:link"} sx={{fontSize:32,mr:1}}/>,
                            onClick: () => {
                                navigate("/copyLink");
                            },
                        }
                         
                      ]}
                      > */}
              {/* <Typography
                //onClick={()=>    navigate("/invite")}
                color={'primary'}
                sx={{ fontSize: 18 }}
              >
                <InviteClientDrawer>Invite client</InviteClientDrawer>
              </Typography> */}
              {/* </BottomAction> */}
            </Box>
            {/* <Typography
                         sx={{pl:2,pb:3}}
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Total {clients
                                    .filter((i) =>
                                        currentView == 'active'
                                            ? i.isActive
                                            : !i.isActive
                                    ).length}
                                   
                                </Typography> */}
            {![...clientsList, ...pendingClients].length ? (
              <Box
                height={'100%'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {/* <Typography variant="subtitle2" color="text.secondary">
                  Not available
                </Typography> */}
                <Typography
                  sx={{ maxWidth: 240 }}
                  align={'center'}
                  variant="body1"
                  color="text.secondary"
                >
                  You currently don't have any client.<br/>
                  Clients who accepted your program <br/>
                  will be displayed here.
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={0}
                mt={2}
              >
                {pendingClients.map((i) => (
                  <Grid
                    item
                    xs={12}
                  >
                    <Box
                      width={'100%'}
                      height={'100%'}
                      px={2}
                    >
                      <Stack
                        spacing={0}
                        width={'100%'}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack
                          direction={'row'}
                          spacing={2}
                          width={'100%'}
                        >
                          <Avatar
                            src={i?.client?.profilePic}
                            sx={{
                              width: 48,
                              height: 48,
                            }}
                          />
                          <Stack width={'100%'}>
                            <InviteClientDrawer
                              mode={'Edit'}
                              item={i}
                            >
                              <Stack
                                sx={{ width: '100%' }}
                                width={'100%'}
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                              >
                                <Typography
                                  line={1}
                                  align={'center'}
                                  color={'grey.400'}
                                  sx={{
                                    maxWidth: '65vw',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                  component={'div'}
                                  variant="subtitle1"
                                >
                                  {i?.email}
                                </Typography>

                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    DeleteInvitation(i._id);
                                  }}
                                >
                                  <Iconify
                                    icon="ic:round-close"
                                    sx={{
                                      fontSize: 24,
                                      color: 'error.main',
                                    }}
                                  />
                                </IconButton>
                              </Stack>
                            </InviteClientDrawer>
                            <Stack mt={0.5}>
                              <Stack
                                direction={'row'}
                                justifyContent={'space-between'}
                              >
                                <TextMaxLine
                                  line={2}
                                  variant="body2"
                                  color="text.secondary"
                                  component={'span'}
                                >
                                  (Invite sent)
                                </TextMaxLine>
                                <Typography
                                  variant="caption"
                                  align="center"
                                >
                                  {moment(i.updatedAt).fromNow()}
                                </Typography>
                              </Stack>
                              {new Date().getTime() - new Date(i.updatedAt).getTime() < 120000 ? (
                                <Countdown
                                  autoStart
                                  key={i?._id}
                                  date={
                                    new Date().getTime() +
                                    (90000 - (new Date().getTime() - new Date(i?.updatedAt).getTime()))
                                  }
                                  // onComplete={() => setCompleted(true)}
                                  renderer={({ hours, minutes, seconds, completed }) => {
                                    if (completed) {
                                      return (
                                        <Box display={'flex'}>
                                          <Typography
                                            color="primary.main"
                                            variant="body2"
                                            onClick={() => resendInvite(i._id)}
                                          >
                                            Resend
                                          </Typography>
                                          &nbsp;&nbsp;&nbsp;
                                          <Typography
                                            variant="body2"
                                            color={'primary'}
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                `${window.location.origin}/invite/accept-invite/${i._id}`,
                                              );

                                              dispatch(
                                                updateFeedback({
                                                  snackbar: true,
                                                  severity: 'success',
                                                  message: 'Link copied',
                                                }),
                                              );
                                            }}
                                          >
                                            Copy invite link
                                          </Typography>
                                        </Box>
                                      );
                                    } else {
                                      return (
                                        <Typography
                                          variant="body2"
                                          color={'primary'}
                                        >
                                          {minutes}:{seconds} until resend
                                        </Typography>
                                      );
                                    }
                                  }}
                                />
                              ) : (
                                <Box display={'flex'}>
                                  <Typography
                                    color="primary.main"
                                    variant="body2"
                                    onClick={() => resendInvite(i._id)}
                                  >
                                    Resend
                                  </Typography>
                                  &nbsp;&nbsp;&nbsp;
                                  <Typography
                                    variant="body2"
                                    color={'primary'}
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `${window.location.origin}/invite/accept-invite/${i._id}`,
                                      );

                                      dispatch(
                                        updateFeedback({
                                          snackbar: true,
                                          severity: 'success',
                                          message: 'Link copied',
                                        }),
                                      );
                                    }}
                                  >
                                    Copy invite link
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Stack>
                        </Stack>

                        {/* <ButtonBase
                                                   onClick={() =>
                                                       navigate(
                                                           '/clientProfile/' +
                                                               i._id
                                                       )
                                                   }
                                                   sx={{
                                                       fontSize: 16,
                                                       mt: 1,
                                                       color: 'primary.main',
                                                       fontWeight: 500,
                                                   }}
                                                   color={'primary.main'}
                                               >
                                                   View{' '}
                                                   <Iconify
                                                       icon={
                                                           'eva:arrow-ios-forward-fill'
                                                       }
                                                   />
                                               </ButtonBase> */}
                      </Stack>
                      <Divider
                        sx={{
                          mt: 2,
                          mb: 2,
                          borderColor: '#E1E7F0',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
                {clientsList.map((i) => (
                  <Grid
                    item
                    xs={12}
                  >
                    <Box
                      width={'100%'}
                      height={'100%'}
                      px={2}
                      mb={3}
                      onClick={() => navigate('/clientProfile/' + i._id)}
                    >
                      <Stack
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack
                          direction={'row'}
                          spacing={2}
                        >
                          <Avatar
                            src={i?.client?.profilePic}
                            sx={{
                              width: 48,
                              height: 48,
                            }}
                          />
                          <Stack>
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                            >
                              <TextMaxLine
                                line={1}
                                align={'center'}
                                variant="subtitle1"
                                sx={{
                                  textTransform: 'capitalize',
                                }}
                              >
                                {i?.client?.name}
                              </TextMaxLine>
                              &nbsp;&nbsp;
                              {/* <TextMaxLine
                              align={"center"}
                              line={2}
                              variant="body2"
                              color="text.disabled"
                            >
                              #{i.figgsId || "N/A"}{" "}
                            </TextMaxLine> */}
                            </Stack>

                            <TextMaxLine
                              line={2}
                              variant="body1"
                              color="text.secondary"
                            >
                              {i?.userPurchaseProgram?.Program?.Title || 'No program'}{' '}
                            </TextMaxLine>
                          </Stack>
                        </Stack>
                        {/* <Stack>
                                                    <Typography variant='caption'>
                                                    {moment(i.addedOn).fromNow()}
                                                   </Typography>
                                                    </Stack> */}
                        {/* <IconButton
                                                        onClick={() =>
                                                            navigate(
                                                                '/clientProfile/' +
                                                                    i._id
                                                            )
                                                        }
                                                    >
                                                        <Iconify
                                                            icon={
                                                                'ic:round-keyboard-arrow-right'
                                                            }
                                                            style={{
                                                                border: '1.5px solid #6D7B8F',
                                                                borderRadius:
                                                                    '24px',
                                                            }}
                                                            width={20}
                                                            height={20}
                                                            color="text.secondary"
                                                        />
                                                    </IconButton> */}
                        {/* <ButtonBase
                                                    onClick={() =>
                                                        navigate(
                                                            '/clientProfile/' +
                                                                i._id
                                                        )
                                                    }
                                                    sx={{
                                                        fontSize: 16,
                                                        mt: 1,
                                                        color: 'primary.main',
                                                        fontWeight: 500,
                                                    }}
                                                    color={'primary.main'}
                                                >
                                                    View{' '}
                                                    <Iconify
                                                        icon={
                                                            'eva:arrow-ios-forward-fill'
                                                        }
                                                    />
                                                </ButtonBase> */}
                      </Stack>
                      {/* <Divider
                                                    sx={{
                                                        mt: 2,
                                                        mb: 2,
                                                        borderColor: '#E1E7F0',
                                                    }}
                                                /> */}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Content>
          <FooterBase>
            <BottomNavigation
              sx={{
                borderTop: '1px solid #E1E7F0',
                borderRadius: '8px 8px 0px 0px',
                paddingTop: '12px',
                paddingBottom: '12px',
                height: 'auto',
              }}
              showLabels
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
                if (newValue == 'program') {
                  navigate('/instructor', { replace: true });
                } else if (newValue == 'more') {
                  navigate('/moreMenu', { replace: true });
                } else {
                  navigate('/clientView', { replace: true });
                }
              }}
            >
              <BottomNavigationAction
                sx={[
                  {
                    '&.MuiBottomNavigationAction-root': {
                      color: (theme) => theme.palette.text.secondary,
                      minWidth: 'auto',
                      padding: '6px 12px',
                    },
                    '&.Mui-selected': {
                      color: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      marginTop: '4px',
                      fontWeight: 600,
                    },}
                ]}
                label="Programs"
                value="program"
                color={isClientSide ? 'secondary.main' : 'primary.main'}
                icon={<ProgramIcon />}
              />
              <BottomNavigationAction
                label="Clients"
                value="clients"
                sx={[
                  {
                    '&.MuiBottomNavigationAction-root': {
                      color: (theme) => theme.palette.text.secondary,
                      minWidth: 'auto',
                      padding: '6px 12px',
                    },
                    '&.Mui-selected': {
                      color: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      marginTop: '4px',
                      fontWeight: 600,
                    },}
                ]}
                icon={<ClientIcon sx={{ fontSize: 28 }} />}
              />
               <BottomNavigationAction
              label="More"
              value="more"
              sx={[
                {
                  '&.MuiBottomNavigationAction-root': {
                    color: (theme) => theme.palette.text.secondary,
                    minWidth: 'auto',
                    padding: '6px 12px',
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '12px',
                    marginTop: '4px',
                    fontWeight: 600,
                  },
                },
              ]}
              icon={<DbIcon sx={{ fontSize: '24px' }} />}
            />
            </BottomNavigation>
          </FooterBase>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
