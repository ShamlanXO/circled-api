// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import { Box, Typography, Stack, ButtonBase, Button } from '@mui/material';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';

import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import Stepper from '../../components/progress';
import Image from '../../components/Image';
import Preview1 from '../../assets/onboarding/overview';
import Preview2 from '../../assets/onboarding/overview2';
import Preview3 from '../../assets/onboarding/overview3';
import Iconify from '../../components/Iconify';
import { Divider } from '@mui/material';
import Container from '../../components/Layout/Container';
import FooterBase from '../../components/Layout/Footer';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import Logo from '../../assets/figgslogo.png';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { IconButton } from '@mui/material';
const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexGrow: 1,
  height: '100vh',
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

// ----------------------------------------------------------------------

export default function HomePage({ mode }) {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { state } = useLocation();

  const query = new URLSearchParams(search);

  const slideData = {
    1: {
      image: <image src={'/images/AppImages/instructor.png'} />,
      title: 'Create your profile',
      sub: 'Set-up and write all the important details of the program you are building',
    },
    2: {
      image: <img src={'/images/AppImages/program.png'} />,
      title: 'Build fitness programs',
      sub: 'Set-up and write all the important details of the program you are building',
    },
    3: {
      image: <img src={'/images/AppImages/money.png'} />,
      title: 'Get paid',
      sub: 'Publish your program in your profile and marketplace',
    },
  };
  const rePass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')

      .matches(
        rePass,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),

    confirmPass: Yup.string()
      .required('confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPass: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      dispatch(
        updateFeedback({
          loading: true,
        }),
      );
      axios
        .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
          email: values.email,
        })
        .then((response) => {
          dispatch(
            updateOnboarding({
              authType: 1,
              email: values.email,
              password: values.password,
              type: null,
            }),
          );

          dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Verification mail sent to your email!',
              severity: 'success',
            }),
          );
          navigate(`/onboarding/${mode == 'client' ? 'client/' : ''}verification`, { state });
        })
        .catch((error) => {
          if (error.response.status === 406)
            return dispatch(
              updateFeedback({
                loading: false,
                snackbar: true,
                message: 'Acccount with give email address already exists!',
                severity: 'error',
              }),
            );
          else
            return dispatch(
              updateFeedback({
                loading: false,
                snackbar: true,
                message: 'Oops caught some error! Please try again',
                severity: 'error',
              }),
            );
        });
    },
  });
  const handelNext = () => {
    if (Number(query.get('slide')) == 3) {
      return navigate('/onboarding', { state });
    }
    navigate('/onboarding/preview?slide=' + (query.get('slide') ? Number(query.get('slide')) + 1 : 2));
  };
  const navigate = useNavigate();
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;
  return (
    <Page title=" Simplified Online Fitness Training ">
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          <Container>
            <Header>
              <Box
                px={2}
                py={2}
              >
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ color: 'text.primary' }}
                >
                  <ArrowLeft />
                </IconButton>
              </Box>
            </Header>
            <Content flex>
              <Box
                display={'flex'}
           
                mt={4}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: 28,
                    fontWeight: 600,
                  }}
                  align={'left'}
                >
                How circled works as <br/>
a trainer.

                </Typography>
              </Box>
              <Box
                flexGrow={'1'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                mt={4}
              >
                <Stack
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                  px={1}
                  spacing={3}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                   
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                    
                    <Box
                      width={'100%'}
                      mt={1}
                    
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                        
                      >
                        {slideData[1].title}
                      </Typography>

                      <Typography
                        variant="body"
                        align={'left'}
                        color={'text.secondary'}
                      >
                        {slideData[1].sub}
                      </Typography>
                    </Box>
        
                    <Box width={'35%'}>
                      {slideData?.[query.get('slide')]?.image || <img src={'/images/AppImages/instructor.png'} />}
                    </Box>
                  </Box>

                  <Divider sx={{width:'100%'}} />


                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                   
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                  
                    <Box
                      width={'100%'}
                      mt={1}
                    
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                      >
                        {slideData[2].title}
                      </Typography>

                      <Typography
                        variant="body"
                        align={'left'}

                        color={'text.secondary'}
                      >
                        {slideData[2].sub}
                      </Typography>
                    </Box>
                    <Box
                      width={'35%'}
                    
                    >
                      {slideData?.[query.get('slide')]?.image || <img src={'/images/AppImages/program.png'} />}
                    </Box>
                  </Box>
                  <Divider sx={{width:'100%'}} />
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    flexGrow={1}
                
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                  >
                 
                    <Box
                      width={'100%'}
                      mt={1}
                      
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: 24,
                          fontWeight: 500,
                        }}
                        textAlign={'left'}
                      >
                        {slideData[3].title}
                      </Typography>
                      <Box>
                        <Typography
                          variant="body"
                          align={'left'}
                          color={'text.secondary'}
                        >
                          {slideData[3].sub}
                        </Typography>
                      </Box>
                    </Box>
                    <Box width={'35%'}>
                      {slideData?.[query.get('slide')]?.image || <img src={'/images/AppImages/money.png'} />}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Content>

            <FooterBase>
              <Box px={3} py={3}>
              <Button fullWidth variant='contained' color='primary' onClick={() => navigate('/onboarding/info', { state })}>
               
                Continue
              
              </Button>
              </Box>
              {/* <Footer
                next
                nextClick={() => navigate('/onboarding/info', { state })}
              /> */}
            </FooterBase>
          </Container>
        </Form>
      </FormikProvider>
    </Page>
  );
}
