import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Radio,
  SwipeableDrawer,
  TextField,
  Typography,
  Tabs,
  Tab,
  styled,
  Stack,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../Iconify';
import Label from '../Label';
import { updateProgram } from 'src/redux/actions/createProgram';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import ClientPrograms from '../client/clientPrograms';
import { TabContext, TabPanel } from '@mui/lab';
import ProgramsToSend from './ProgramsToSend';
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));
function SendProgramDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Program = useSelector((s) => s.NewProgram);
  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };

  const onRestDay = (week, day) => {
    let plan = JSON.parse(JSON.stringify(Program.ExercisePlan));
    plan[week][day].IsRest = !plan[week][day].IsRest;
    dispatch(updateProgram({ ExercisePlan: plan }));
    // toggleDrawer(false);
  };

  const [current, setCurrent] = useState(0);
  const handleTabChange = (event, newValue) => {
    setCurrent(newValue);
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
        <Box
          display="flex"
          justifyContent={'center'}
          sx={{ mb: 1 }}
        >
          <img
            src={'/images/bottomDrawerIndicator.png'}
            width={'170px'}
            height="5px"
          />
        </Box>
        <Box
          padding={'16px'}
          style={{
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            backgroundColor: '#fff',
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Search for programs"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Iconify
                        icon={'eva:search-fill'}
                        width={24}
                        height={24}
                        color="text.secondary"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TabContext value={current}>
              <TabContainer>
                <Tabs
                  variant="fullWidth"
                  value={current}
                  onChange={handleTabChange}
                  aria-label=""
                  sx={{
                    p: 0.4,
                    backgroundColor: (theme) => theme.palette.background.default,
                  }}
                >
                  <Tab
                    label={'My Programs'}
                    sx={{
                      'minWidth': '142px',
                      'px': 1,
                      '&.Mui-selected': {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 7px #E1E7F0',
                        border: '1px solid #E1E7F0',
                      },
                    }}
                  />
                  <Tab
                    label={'All Programs'}
                    sx={{
                      'minWidth': '140px',
                      'px': 1,
                      '&.Mui-selected': {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: '#fff',
                        boxShadow: '0px 1px 7px #E1E7F0',
                        border: '1px solid #E1E7F0',
                      },
                    }}
                  />
                </Tabs>
              </TabContainer>
            </TabContext>
            <ProgramsToSend
              handleSendProgram={(programData) => {
                props.sendProgram(programData);
                setDrawerOpen(false);
              }}
            />
          </Stack>
        </Box>
      </SwipeableDrawer>
      <div onClick={() => setDrawerOpen(true)}>{props.children}</div>
    </div>
  );
}

export default SendProgramDrawer;
