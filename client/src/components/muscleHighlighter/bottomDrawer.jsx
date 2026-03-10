import { Box, Button, Divider, Drawer, Typography, ButtonBase, IconButton, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../Iconify';
import Label from '../Label';
import { updateProgram } from 'src/redux/actions/createProgram';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import { TabContext, TabPanel } from '@mui/lab';
import Model from '../body-highlight2/src';
import { Close } from '@mui/icons-material';
import { use } from 'i18next';
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));

function MuscleHighlighterDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSide, setCurrentSide] = useState(0);
  const handleTabChange = (newValue) => {
    setCurrentSide(newValue);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Program = useSelector((s) => s.NewProgram);
  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };

  const [data, setData] = useState(props.data);
  const handleClick = (exercise) => {
    const { muscle } = exercise;
    // const { exercises, frequency } = exercise.data;
    // alert(
    //   `You clicked the ${muscle}! You've worked out this muscle ${frequency}
    //   times through the following exercises: ${JSON.stringify(exercises)}`
    // );
    if (!props.viewMode) {
      let newData = [...data];
      let removeIndex = null;

      newData.map((item, index) => {
        if (item.muscles[0] == muscle) {
          removeIndex = index;
          return;
        }
      });
      if (removeIndex !== null) {
        newData.splice(removeIndex, 1);
      } else {
        newData.push({
          name: 'Some Exercise',
          muscles: [muscle],
          frequency: 1,
        });
      }
      setData(newData);
    }
  };

  useEffect(() => {
    if (data) {
      let allM = [];
      data.map((i) => (allM = [...allM, ...i?.muscles]));
      props.setMData(allM);
    }
  }, [data]);

  // useEffect(() => {
  //     if (props.data) {
  //         setData(props.data)
  //     }
  // }
  // , [props.data])

  return (
    <div>
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
        <br />
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <Close />
        </IconButton>
        <div
          style={{
            height: '75vh',
            overflowY: 'auto',
          }}
        >
          <TabContext value={currentSide}>
            <TabPanel
              value={0}
              index={0}
            >
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                px={2}
                width={'100%'}
                flexGrow={'1'}
              >
                <center>
                  <Model
                    data={props.data}
                    onClick={props.viewMode ? null : handleClick}
                    style={{ width: '85%', padding: '5px' }}
                    highlightedColors={[
                      // "#b4ceed",
                      // "#a6c7ed",
                      // "#8bb9ed",
                      // "#73AEF2",
                      '#EE3737',
                    ]}
                  />
                </center>
              </Box>
            </TabPanel>
            <TabPanel
              value={1}
              index={1}
            >
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                px={2}
                width={'100%'}
                flexGrow={'1'}
              >
                <Model
                  type="posterior"
                  data={props.data}
                  style={{ width: '85%', padding: '5px' }}
                  // style={{ width: '50rem', padding: '5rem' }}
                  // style={{ width: "100px", padding: "5px" }}
                  highlightedColors={[
                    // "#fccd9f",
                    // "#fcbe80",
                    // "#ffb668",
                    // "#FFAB4C",
                    '#EE3737',
                  ]}
                  onClick={handleClick}
                />
              </Box>
            </TabPanel>
          </TabContext>
        </div>
        <Box
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          pb={2}
        >
          <Tabs
            value={currentSide}
            onChange={(e, v) => handleTabChange(v)}
            aria-label="wrapped label tabs example"
            centered
          >
            <Tab
              label={
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: currentSide == 0 ? 'bold' : 300,
                  }}
                >
                  Front side
                </Typography>
              }
              value={0}
            />
            <Tab
              label={
                <Typography
                  sx={{
                    fontWeight: currentSide == 1 ? 'bold' : 300,
                    fontSize: 18,
                  }}
                >
                  Back side
                </Typography>
              }
              value={1}
            />
          </Tabs>
          {/* <ButtonBase onClick={() => handleTabChange(0)}>
                        <Typography
                            variant="subtitle1"
                            color={
                                currentSide == 0 ? 'primary' : 'text.secondary'
                            }
                        >
                            Front side
                        </Typography>
                    </ButtonBase>
                    <Divider
                        orientation="vertical"
                        sx={{ mx: 1, height: '30px', width: '2px' }}
                    />
                    <ButtonBase onClick={() => handleTabChange(1)}>
                        <Typography
                            variant="subtitle1"
                            color={
                                currentSide == 1 ? 'primary' : 'text.secondary'
                            }
                        >
                            Back side
                        </Typography>
                    </ButtonBase> */}
        </Box>
      </Drawer>
      <div
        onClick={() => setDrawerOpen(true)}
        style={props.width ? { width: props.width || 130 } : {}}
      >
        {props.children}
      </div>
    </div>
  );
}

export default MuscleHighlighterDrawer;
