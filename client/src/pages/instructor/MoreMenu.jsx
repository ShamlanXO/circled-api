// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import {
  Box,
  BottomNavigation,
  Typography,
  Grid,
  Stack,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Container from '../../components/Layout/Container';
import FooterBase from '../../components/Layout/Footer';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import InstructorHeader from 'src/components/home/HomeHeader';
import { useState } from 'react';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import DbIcon from 'src/assets/IconSet/MoreIcon';
import { updateFeedback } from '../../redux/actions/feedback';
import { updateProfile } from '../../redux/actions/Profile';
import { signOut } from 'src/redux/actions/common';
import {
  PublicExercise,
  Videos,
  Workouts,
  Archives,
  PersonalInfo,
  Payments,
  Athlete,
  Invite,
  Feedback,
  Bug,
  Guide,
  Draft
} from 'src/assets/IconSet/latest/LatestIcons.js'

const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});

const MenuItemBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  paddingBottom:theme.spacing(1),
  paddingTop:theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '22px',
  marginLeft:8,
  marginTop: theme.spacing(3),
  color: theme.palette.text.primary,
  '&:first-of-type': {
    marginTop: theme.spacing(2),
  },
}));

const MenuItemIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& svg': {
    width: 28,
    height: 28,
    color: theme.palette.primary.main,
  },
}));
const Divider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 10,
  backgroundColor: "#fff",
  boxShadow: '0px 4px 4px 0px rgba(43, 64, 87, 0.05)',
  margin: theme.spacing(2, 0),
}));
const MenuItemText = styled(Typography)(({ theme }) => ({
  
  color: theme.palette.text.primary,
  textAlign: 'center',
  lineHeight: 1.2,
}));

const SignOutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  textTransform: 'none',
  fontWeight: 500,
  padding: theme.spacing(2),
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.error.lighter,
  },
}));

// ----------------------------------------------------------------------

export default function MoreMenu() {
  const { state } = useLocation();
  const Profile = useSelector((s) => s.Profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState('more');

  const handleSignOut = () => {
    dispatch(signOut());
  };
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
  const menuItems = {
    trainingCenter: [
      {
        icon: <PublicExercise />,
        label: 'Public exercise',
        onClick: () => navigate('/library/public')
      },
      {
        icon: <Videos />,
        label: 'My videos',
          onClick: () => navigate('/library/uploads')
      },
      {
        icon: <Workouts />,
        label: 'Workouts',
        onClick: () => navigate('/library/workouts')
      },
      {
        icon :<Draft/>,
        label :'Draft',
        onClick :()=>navigate('/drafts')
      },
      {
        icon: <Archives />,
        label: 'Archived',
        onClick: () => navigate('/archives')
      }
    ],
    accountSettings: [
      {
        icon: <PersonalInfo />,
        label: 'Personal info',
        onClick: () => navigate('/instructor/profile')
      },
      {
        icon: <Payments />,
        label: 'Payments',
        onClick: () => navigate('/payment')
      },
      {
        icon: <Athlete />,
        label: 'Athlete mode',
        onClick: () => swichAccount()
      }
    ],
    referrals: [
      {
        icon: <Invite />,
        label: 'Invite trainers',
        onClick: () => navigate('/invite')
      }
    ],
    support: [
      {
        icon: <Feedback />,
        label: 'Feedback',
        onClick: () => navigate('/feedback')
      },
      {
        icon: <Bug />,
        label: 'Bug report',
        onClick: () => navigate('/bugreport')
      },
      {
        icon: <Guide />,
        label: 'Guide',
        onClick: () => navigate('/help')
      }
    ]
  };

  

  const renderMenuItem = (item, index) => (
    <Grid item xs={4} key={index}>
      <MenuItemBox onClick={item.onClick}>
        <Stack spacing={1} alignItems="center">
          <MenuItemIcon>
            {item.icon}
          </MenuItemIcon>
          <MenuItemText>
            {item.label}
          </MenuItemText>
        </Stack>
      </MenuItemBox>
    </Grid>
  );

  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header boxShadow>
          <InstructorHeader title={Profile.profileName || Profile.name} />
        </Header>
        <Content withoutPadding style={{ paddingTop: 0, position: 'relative' }}>
          <Box sx={{ px:2,mt:2 }}>
            {/* Training center section */}
            <SectionTitle variant="h6">
              Training center
            </SectionTitle>
            <Grid container spacing={1}>
              {menuItems.trainingCenter.map(renderMenuItem)}
            </Grid>
           
          </Box>
<Box> <Divider/></Box>
<Box sx={{  px: 2 }}>
            {/* Account settings section */}
            <SectionTitle variant="h6">
              Account settings
            </SectionTitle>
            <Grid container spacing={1}>
              {menuItems.accountSettings.map(renderMenuItem)}
            </Grid>
          
            </Box>
<Box> <Divider/></Box>


            <Box sx={{  px: 2 }}>
            {/* Referrals section */}
            <SectionTitle variant="h6">
              Referrals
            </SectionTitle>
            <Grid container spacing={1}>
              {menuItems.referrals.map(renderMenuItem)}
            </Grid>
       
            </Box>
<Box> <Divider/></Box>
            <Box sx={{  px: 2 }}>
            {/* Support section */}
            <SectionTitle variant="h6">
              Support
            </SectionTitle>
            <Grid container spacing={1}>
              {menuItems.support.map(renderMenuItem)}
            </Grid>
          
            </Box>

<Box> <Divider/></Box>    
            {/* Sign out button */}
            <Box sx={{ mt: 4, px: 2 }}>
              <SignOutButton
                fullWidth
                startIcon={
                  <Box
                    component="svg"
                    sx={{ width: 20, height: 20 }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </Box>
                }
                onClick={handleSignOut}
              >
                Sign out
              </SignOutButton>
            </Box>
      
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
              if (newValue === 'programs') {
                navigate('/instructor', { replace: true });
              } else if (newValue === 'more') {
                navigate('/moreMenu', { replace: true });
              } else if (newValue === 'clients') {
                navigate('/clientView', { replace: true });
              }
            }}
          >
            <BottomNavigationAction
              label="Programs"
              value="programs"
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
                  },}
              ]}
              icon={<DbIcon sx={{ fontSize: 24 }} />}
            />
          </BottomNavigation>
        </FooterBase>
      </Container>
    </Page>
  );
}

