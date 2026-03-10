// @mui
import { styled } from '@mui/material/styles';
import { useState } from 'react';
// components
import Page from 'src/components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  InputAdornment,
  IconButton,
  StepLabel,
  StepContent,
  Step,
  Divider,
  Stepper,
} from '@mui/material';

import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation, useOutletContext } from 'react-router';
import LoginDrawer from 'src/components/common/LoginDrawer';
import { useDispatch, useSelector } from 'react-redux';

import LabeledInput from 'src/components/core/LabeledInput';
import Footer from 'src/components/onboarding/footer';
import ExerciseCard from 'src/components/instructor/exerciseCard';
import FooterBase from 'src/components/Layout/Footer';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { indexof } from 'stylis';

const RootStyle = styled('div')(() => ({
  backgroundColor: '#F5F7FA',
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
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
// ----------------------------------------------------------------------

export default function MyWorkoutDayPage() {
  const { state, pathname } = useLocation();
  const [workoutData, token] = useOutletContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  let ex = workoutData?.Exercise;
  const days = ['Saturday', 'Sunday', 'Moday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday'];
  return (
    <RootStyle>
      <LoginDrawer
        open={open}
        type={'workout'}
        onClose={() => setOpen(false)}
      />
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          {' '}
          <Header noColor>
            <BoxHeader
              px={2}
              py={2}
            >
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                flexDirection={'row'}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                >
                  Exercises
                </Typography>
              </Box>
            </BoxHeader>
          </Header>{' '}
          {/* {token ? (
                        ''
                    ) : (
                        <Box
                            position={'absolute'}
                            width={'100vw'}
                            bgcolor={'rgba(0,0,0,0.1)'}
                            top={0}
                            left={0}
                            height={'100%'}
                            zIndex={100}
                        />
                    )} */}
          <Content
            style={{
              paddingTop: 16,
              paddingBottom: 32,
              overflowY: 'auto',
              paddingLeft: 0,
              paddingRight: 0,
              position: 'relative',
            }}
          >
            <Box
              bgcolor={'#fff'}
              px={3}
              py={2}
              mt={-1}
              mb={1}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={'center'}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Avatar
                    sx={{ width: 60, height: 60, mr: 1.5 }}
                    src={workoutData?.CreatedBy?.profilePic}
                  />
                  <Stack>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {workoutData?.CreatedBy?.name}
                    </Typography>
                  </Stack>
                </Box>
                <Button
                  variant="text"
                  onClick={() => navigate(`/public/instructor-profile/${workoutData?.CreatedBy?._id}`)}
                  sx={{ pr: 0 }}
                >
                  View profile
                </Button>
              </Stack>
            </Box>
            <Box
              bgcolor={'#fff'}
              px={3}
              pt={2}
            >
              <LabeledInput
                fullWidth
                placeholder="Example: Chest day"
                clabel="Workout name"
                value={workoutData?.Title}
                name={'title'}
                InputProps={{
                  readOnly: true,
                  style: {
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 54px rgb(225 231 240 / 50%)',
                  },
                }}
              />

              {ex?.map((step, index) => (
                <Box
                  key={index}
                  border={'2px solid rgba(225, 231, 240, 1)'}
                  borderRadius={1}
                  bgcolor={'white'}
                  p={2}
                  mt={4}
                >
                  {token || index < 1 ? (
                    <ExerciseCard
                      mode={'workout'}
                      clientSide
                      plan={step}
                      d={0}
                      index={index}
                      w={0}
                    />
                  ) : (
                    <Box style={{ filter: 'blur(4px)' }}>
                      <ExerciseCard
                        mode={'workout'}
                        clientSide
                        plan={step}
                        d={0}
                        index={index}
                        w={0}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Content>
          {!token ? (
            <FooterBase
              borderRadius={24}
              outerbg={'#F9FAFD'}
              withboxShadow
              style={{ borderRadius: 24, overflow: 'hidden' }}
            >
              <Box
                py={2}
                px={2}
                display={'flex'}
                justifyContent={'space-between'}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Avatar
                    sx={{ mr: 1.5 }}
                    src={workoutData?.CreatedBy?.profilePic}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      By {workoutData?.CreatedBy?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{ px: 3 }}
                    onClick={() =>
                      token
                        ? navigate('viewExercise', {
                            state: {
                              index: 0,
                            },
                          })
                        : setOpen(true)
                    }
                  >
                    Start
                  </Button>
                </Box>
              </Box>
            </FooterBase>
          ) : null}
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
