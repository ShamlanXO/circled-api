// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Button,
  BottomNavigation,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import { searchItemByKey } from 'src/utils/search.js';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import Stepper from '../../components/progress';
import Image from '../../components/Image';
import Preview1 from '../../assets/onboarding/overview.svg';
import Preview2 from '../../assets/onboarding/overview2.svg';
import Preview3 from '../../assets/onboarding/overview3.svg';
import Iconify from '../../components/Iconify';
import Container from '../../components/Layout/Container';
import FooterBase from '../../components/Layout/Footer';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import InstructorHeader from 'src/components/home/HomeHeader';
import { useState, useEffect } from 'react';
import InstructorPrograms from 'src/components/instructor/instructorPrograms';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import DraftedProgramBottomDrawer from 'src/components/instructor/DraftedProgramBottomDrawer';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import AddIcon from 'src/assets/IconSet/Add';
import DbIcon from 'src/assets/IconSet/MoreIcon';
import { updateProgram, getAllPrograms, deleteProgram } from 'src/redux/actions/createProgram';
import { createStyles } from '@mui/styles';
import { orderBy } from 'lodash';
import VideoDialog from '../../components/instructor/VideoDialog';
const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexGrow: 1,
  height: '100vh',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 16px',
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
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '0 20px',
  justifyContent: 'center',
}));

const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '12px',
    marginTop: '4px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
  minWidth: 0,
  padding: '6px 12px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

// ----------------------------------------------------------------------

export default function InstructorPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { state } = useLocation();
  const ProgramList = useSelector((s) => s.ProgramList);
  const Profile = useSelector((s) => s.Profile);
  const query = new URLSearchParams(search);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('desc');
  const [tabValue, setTabValue] = useState('programs');
  const [searchKey, setSearchKey] = useState('');
  const [current, setCurrent] = useState('Published');
  const [currentTab, setCurrentTab] = useState('programs');
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    console.log(newValue);
    if (newValue == 0) {
      setCurrent('Published');
    } else {
      setCurrent('Draft');
    }
  };
  useEffect(() => {
    dispatch(getAllPrograms());
    console.log(ProgramList.Programs);
  }, []);
  let programs =
    ProgramList?.Programs.filter((item) => {
      if (current == 'Published') {
        if(currentTab == 'programs'){
          return item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false;
        }
        if(currentTab == 'public'){
          return item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false && item.ProgramType == "Public";
        }
        if(currentTab == 'private'){
          return item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false && item.ProgramType == "Private";
        }
      }
      if (current == 'Draft') {
        return item.IsDraft == true && item.IsDeleted == false;
      }
    }) || [];
  programs = searchKey ? searchItemByKey(programs, ['Title'], searchKey) : programs;
  const handleCreateProgram = () => {
    const shouldShowVideo = localStorage.getItem('showCreateProgramVideo');
    if (shouldShowVideo !== 'false') {
      setVideoDialogOpen(true);
    } else {
      dispatch({
        type: 'INIT_NEW_PROGRAM',
        payload: {},
      });
      navigate('/createProgram');
    }
  };
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header>
          <InstructorHeader title={Profile.profileName || Profile.name} />
         
            <Box sx={{ mt: 2, backgroundColor: '#fff',boxShadow: '0px 4px 4px rgba(127, 127, 127, 0.1)' }}>
              <TextField
                fullWidth
                placeholder={'Search by program'}
                onChange={(e) => setSearchKey(e.target.value)}
                InputProps={{
                  sx: { 
                    height: 48,
                    '& .MuiInputAdornment-root': {
                      marginRight: '8px',
                    },
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton sx={{ padding: '8px' }}>
                        <Iconify
                          icon={'eva:search-fill'}
                          width={20}
                          height={20}
                          color="text.secondary"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ px: 2 }}
              />
              
                 <Tabs
                 sx={{mt: 2}}
                 centered
              value={currentTab}
              onChange={(e, v) => setCurrentTab(v)}
              aria-label="wrapped label tabs example"
              
            >
              <Tab
                label={
                  <Typography
                    sx={{
                      fontSize: 18,
                      px:2,
                      fontWeight: currentTab == 'programs' ? 'bold' : 300,
                    }}
                  >
                    {`All programs`}
                  </Typography>
                }
                value="programs"
              />
              <Tab
                label={
                  <Typography
                    sx={{
                      fontSize: 18,
                      px:2,
                      fontWeight: currentTab == 'public' ? 'bold' : 300,
                    }}
                  >
                    {`Public`}
                  </Typography>
                }
                value="public"
              />
              <Tab
                label={
                  <Typography
                    sx={{
                      fontWeight: currentTab == 'private' ? 'bold' : 300,
                      fontSize: 18,
                      px:2,
                    }}
                  >
                    {`Private`}
                  </Typography>
                }
                value="private"
              />
            </Tabs>
          
             
            </Box>
      
        </Header>
        <Content style={{ paddingTop: 0, position: 'relative' }}>

           {programs.length > 0 && <BoxStyle
                sx={{ 
                  pt: 3, 
                  px: 2,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'background.paper',
                  zIndex: 10,
              
                  borderColor: 'divider'
                }}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <ButtonBase
                  variant="text"
                  color="primary"
                  onClick={handleCreateProgram}
                  sx={{
                    color: 'primary.main',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      color: 'primary.main',
                      fontWeight: 600,
                 
                    }}
                  >
                    Create program
                  </Typography>
                </ButtonBase>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSortOrder(sortOrder == 'desc' ? 'asc' : 'desc')}
                >
                  <Iconify
                    icon="ic:round-sort"
                    sx={{ 
                      transform: 'scaleX(-1)',
                      fontSize: '20px',
                      marginRight: '4px',
                    }}
                  />
                  <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 500 }}>
                    Sort: {sortOrder == 'desc' ? 'Newest' : 'Oldest'}
                  </Typography>
                </Box>
              </BoxStyle>}
          {programs.length == 0 && !searchKey ? (
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              px={2}
              width={'100%'}
              height={'100%'}
              pb={8}
            >
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection="column"
                alignItems={'center'}
              >
                {current != 'Draft' && (
                  <img
                    src={'/images/instructor/instructorNoProgram.png'}
                    style={{
                      alignSelf: 'center',
                      width: 120,
                      height: 120,
                    }}
                  />
                )}
                <Box mt={current == 'Draft' ? -4 : 1}>
                  <Typography
                    variant="body1"
                    align={'center'}
                    sx={{ fontWeight: 550 }}
                    color="text.secondary"
                  >
                    {current == 'Draft' ? 'No drafts' : ''}
                  </Typography>
                  <Typography
                    variant="body1"
                    align={'center'}
                    sx={{ maxWidth: 280 }}
                    color="text.secondary"
                  >
                    {current == 'Draft' ? '' :currentTab == 'private' ? 'No available private programs' : currentTab == 'public' ? 'No available public programs' : 'No available programs'}
                  </Typography>   
                </Box>
                {current !== 'Draft' && programs.length == 0 && currentTab == 'programs' && (
                  <Button
                    variant="text"
                    sx={{
                      display: 'flex',

                      justifyContent: 'space-between',
                    }}
                    onClick={handleCreateProgram}
                  >
                    Create program
                  </Button>
                )}
                
              </Box>
            </Box>
          ) : (
            <Box
              position="relative"
              paddingBottom={16}
            >
              <InstructorPrograms programs={orderBy(programs, (i) => new Date(i.createdAt), [sortOrder])} />
            </Box>
          )}
          {programs.length ? (
            <Box
              py={4}
              height={'100%'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-end'}
            >
              <Typography
                color={'text.secondary'}
                align="center"
              >
                {programs.length} Total programs
              </Typography>
            </Box>
          ) : (
            ''
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
              label="Programs"
              value="programs"
              sx={[
                {
                  '&.MuiBottomNavigationAction-root': {
                    color: (theme) => theme.palette.primary.main,
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
              icon={<ProgramIcon sx={{ fontSize: '24px' }} />}
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
                  },
                },
              ]}
              icon={<ClientIcon sx={{ fontSize: '24px' }} />}
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
      </Container>
      <VideoDialog
        open={videoDialogOpen}
        onClose={() => {
          setVideoDialogOpen(false);
          dispatch({
            type: 'INIT_NEW_PROGRAM',
            payload: {},
          });
          navigate('/createProgram');
        }}
      />
    </Page>
  );
}

