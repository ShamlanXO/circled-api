// @mui
import { styled } from '@mui/material/styles';

// components
import Page from 'src/components/Page';
// sections
import { Box, Typography, Stack, Button, Checkbox, Drawer } from '@mui/material';

import { useLocation, useNavigate } from 'react-router';
import TextField from 'src/components/core/LabeledInput';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Countdown from 'react-countdown';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import FooterBase from 'src/components/Layout/Footer';
import { getClients } from 'src/redux/actions/clientExercise';
import Logo from 'src/assets/figgslogo.png';

// ----------------------------------------------------------------------
import Header from 'src/components/onboarding/header';
import { useEffect, useState } from 'react';
import { updateFeedback } from 'src/redux/actions/feedback';
import { sendinvitation, resendinvitation } from 'src/redux/actions/invite';
import Iconify from '../Iconify';
function WorkoutDayBottomDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setloading] = useState(false);
  const [id, setId] = useState(null);

  const InviteSchema = Yup.object().shape({
    email: Yup.string().email('enter a valid email').required('Email is required'),
    message: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      email: props?.item?.email,
    },
    validationSchema: InviteSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      setloading(true);
      dispatch(props?.mode == 'Edit' ? resendinvitation({ _id: props?.item?._id }) : sendinvitation(values))
        .then((id) => {
          setloading(false);
          resetForm();
          dispatch(getClients());
          setId(id);
        })
        .catch((err) => {
          if (err.status == 403) {
            setErrors({
              email: err.data.message,
            });
          }
        });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, resetForm, values } = formik;

  useEffect(() => {
    if (drawerOpen) {
      setId(null);
      resetForm();
      setloading(false);
    }
  }, [drawerOpen]);

  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    event.stopPropagation();
    setDrawerOpen(isOpen);
  };

  return (
    <div>
      <Drawer
        anchor={'bottom'}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
        }}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          padding={'16px 24px 36px'}
          style={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
            >
              {!id && (
                <>
                  <Typography
                    variant="h3"
                    align="left"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Enter your clients email address
                  </Typography>
                  <Typography color={'text.secondary'}>
                    By entering the clients email address you <br />
                    will invite him to your client list
                  </Typography>
                </>
              )}

              <Stack
                spacing={2}
                mt={2}
                sx={{ width: '100%' }}
              >
                {!id ? (
                  <TextField
                    fullWidth
                    placeholder={'Example@email.com'}
                    disabled={props?.mode == 'Edit'}
                    clabel={<Typography variant="subtitle1">Email</Typography>}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                ) : (
                  ''
                )}

                {id && (
                  <>
                    {' '}
                    <center>
                      <Iconify
                        icon={'lets-icons:check-fill'}
                        sx={{ fontSize: 80 }}
                      />
                    </center>
                    <Typography
                      variant="h2"
                      align="center"
                    >
                      Invitaion sent successfully
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                    >
                      We have sent an invitaion to the email address you provided. You can also copy invitation link and
                      send via other modes
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/invite/accept-invite/${id}`);
                        dispatch(
                          updateFeedback({ snackbar: true, message: 'Link copied to clipboard', severity: 'success' }),
                        );
                      }}
                    >
                      Copy invitation link
                    </Button>
                  </>
                )}
              </Stack>

              <Box sx={{ width: '100%', mt: 6 }}>
                {/* <Box >
                                <Typography sx={{alignItems:"center"}} variant='body2'>
                                    <Checkbox size='small' checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} />
                                I confirm all of the information above is correct.
                                </Typography>
                            </Box> */}
                <Box
                  display={'flex'}
                  justifyContent={'flex-end'}
                >
                  {props?.mode == 'Edit' ? (
                    <Countdown
                      autoStart
                      date={
                        new Date().getTime() +
                        (90000 - (new Date().getTime() - new Date(props?.item?.updatedAt).getTime()))
                      }
                      // onComplete={() => setCompleted(true)}
                      renderer={({ hours, minutes, seconds, completed }) => {
                        if (completed) {
                          return (
                            <Button
                              variant="contained"
                              type="submit"
                              sx={{ px: 4 }}
                            >
                              Resend
                            </Button>
                          );
                        } else {
                          return (
                            <Typography
                              variant='"body2'
                              color={'primary'}
                            >
                              {minutes}:{seconds} until resend
                            </Typography>
                          );
                        }
                      }}
                    />
                  ) : (
                    <>
                      {id ? (
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          onClick={() => setDrawerOpen(false)}
                          sx={{ px: 4, borderRadius: 1 }}
                        >
                          Close
                        </Button>
                      ) : (
                        <LoadingButton
                          loading={loading}
                          variant="contained"
                          type="submit"
                          fullWidth
                          disabled={!values.email}
                          sx={{ px: 4, borderRadius: 1 }}
                          //disabled={!confirmed}
                        >
                          Send invite
                        </LoadingButton>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      </Drawer>
      <div
        onClick={(e) => {
          setDrawerOpen(true);
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

export default WorkoutDayBottomDrawer;
