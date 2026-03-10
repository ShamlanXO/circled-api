// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';

// components
import Page from '../../components/Page';
import Container from '../../components/Layout/Container';
import Header from '../../components/Layout/Header';
import Content from '../../components/Layout/Content';
import ClientPrograms from 'src/components/client/clientPrograms';
import PopupAcceptDeny from 'src/components/invitation/PopupAcceptDeny';

// hooks
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

// utils
import { searchItemByKey } from 'src/utils/search.js';
import { getLogUnreadCount } from 'src/redux/actions/common';
import Iconify from '../../components/Iconify';
import ArrowLeft from "src/assets/IconSet/ArrowLeft";

// styled components
const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
}));

const BoxHeader = styled(Box)(() => ({
  width: "100%",
  zIndex: 100,
  backgroundColor: "#fff",
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 4px',
}));

// ----------------------------------------------------------------------

export default function MyPrograms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  
  // state
  const [logCount, setLogCount] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [tabValue, setTabValue] = useState('home');
  
  // selectors
  const ProgramList = useSelector((s) => s.AtheletePlan);
  const Profile = useSelector((s) => s.Profile);
  
  // derived state
  const { programsList } = useMemo(() => {
    if (searchKey === '') {
      return { programsList: ProgramList.AllPrograms };
    }
    return { 
      programsList: searchItemByKey(ProgramList.AllPrograms, ['Title'], searchKey) 
    };
  }, [searchKey, ProgramList.AllPrograms]);

  // effects
  useEffect(() => {
    if (ProgramList?.currentPlan) {
      getLogUnreadCount(ProgramList.currentPlan)
        .then((res) => setLogCount(res?.data?.count));
    }
  }, [ProgramList]);

  useEffect(() => {
    let active = ProgramList.AllPrograms.find((item) => item.isActive);
    if (!active?._id && ProgramList.AllPrograms.length > 0) {
      // Handle case when no active program exists
    }
  }, [ProgramList.AllPrograms?.length]);

  // handlers
  const handleSearchChange = (e) => setSearchKey(e.target.value);
  const handleBackNavigation = () => navigate(-1);

  return (
    <Page title="Simplified Online Fitness Training">
      <PopupAcceptDeny />
      <RootStyle>
        <Container>
          <Header
            style={{
              background: '#fff',
              boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
              paddingBottom: 16
            }}
            headerDependency={tabValue}
          >
            <BoxHeader px={2} py={2}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                flexDirection="row"
              >
                <IconButton
                  onClick={handleBackNavigation}
                  sx={{ color: "text.primary" }}
                >
                  <ArrowLeft />
                </IconButton>
                <Typography variant="h6" color="text.primary">
                  My programs
                </Typography>
              </Box>
            </BoxHeader>
            
            <Box px={2}>
              <TextField
                fullWidth
                placeholder="Search for programs"
                value={searchKey}
                onChange={handleSearchChange}
                InputProps={{
                  sx: { height: 48 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Iconify
                          icon="eva:search-fill"
                          width={24}
                          height={24}
                          color="text.secondary"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Header>
          
          <Content
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 16,
              background: '#fff',
            }}
          >
            <Box px={2} height="100%">
              {programsList?.length === 0 ? (
                <Box
                  width="100%"
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="h3"
                    align="center"
                    color="text.secondary"
                  >
                    You don't have any programs!<br />
                    Subscribe to your first program to get started!
                  </Typography>
                </Box>
              ) : (
                <>
                  <BoxStyle>
                    <Typography variant="subtitle1" color="text.primary">
                      Programs {programsList?.length}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Iconify
                        icon="ic:round-sort"
                        color="text.secondary"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      &nbsp;
                      <Typography variant="body1" color="text.secondary">
                        Sort by: Newest
                      </Typography>
                    </Box>
                  </BoxStyle>
                  <ClientPrograms programs={programsList || []} />
                </>
              )}
            </Box>
          </Content>
        </Container>
      </RootStyle>
    </Page>
  );
}
