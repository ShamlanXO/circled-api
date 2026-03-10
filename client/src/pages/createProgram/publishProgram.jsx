// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState, forwardRef } from 'react';
// components
import Page from '../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  Alert,
  Badge,
  InputAdornment,
  ListItemButton,
  IconButton,
} from '@mui/material';
import { handleuploadImage } from 'src/utils/uploader';
import Input from 'src/components/Labs/Cropper';
import ImageFill from 'src/assets/createProgram/ImageFill';
import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { IconButtonAnimate } from 'src/components/animate';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import FooterBase from '../../components/Layout/Footer';
import Progress from 'src/components/progress';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Footer from 'src/components/onboarding/footer';
import axios from 'axios';
import api from 'src/utils/api';
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader';
import WorkoutWeek from 'src/components/instructor/workoutWeek';
import Label from 'src/components/Label';
import SendProgramEmails from 'src/components/instructor/sendProgramEmails';
import SubscriptionTypePopover from 'src/components/instructor/subscriptionTypePopover';
import { computePath } from 'src/utils/routepath';
import { checkIsDraft } from 'src/utils/getProgramStatus';
import { createProgram, saveProgram } from 'src/redux/actions/createProgram';
import UpdateProgramForm from 'src/components/instructor/updateProgramForm';
import { useOutletContext } from 'react-router-dom';
import ProgramDescriptionModal from 'src/components/instructor/ProgramDescriptionModal';
import AddImage from 'src/assets/IconSet/AddImage';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
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

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
  padding: '20px 10px',
  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
}));

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const [Program, updateProgram, mode] = useOutletContext();

  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const handelNext = () => {
    dispatch(
      updateFeedback({
        loading: true,
      }),
    );
    updateProgram({
      Price: values.price,
      BannerImage: values.BannerImage,
      Title: values.title,
      Description: values.description,
      PaymentType: values.PaymentType,
      IsDraft: false,
    });
    dispatch(
      saveProgram({
        ...Program,
        IsDraft: false,
        SendTo: [],
        Price: values.price,
        BannerImage: values.BannerImage,
        Title: values.title,
        Description: values.description,
        PaymentType: values.PaymentType,
      }),
    ).then((program) => {
      dispatch(
        updateFeedback({
          loading: false,
          sAnimate: true,
          message: 'Program published succesfully',
          severity: 'success',
        }),
      );
      navigate('/instructor');
    });
  };
  const handleBack = () => {
    navigate(-1);
  };

  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(24, 'Title too long'),
    description: Yup.string().max(1000, 'Description too long'),
    price: Yup.number().required('Price is required'),
    BannerImage: '',
    SendTo: Yup.array().of(Yup.string().email()),
  });

  const [filePicked, setFilePicked] = useState(null);
  const formik = useFormik({
    initialValues: {
      price: Program.Price,
      BannerImage: Program.BannerImage,
      title: Program.Title,
      description: Program.Description,
      BannerImage: Program.BannerImage,
      PaymentType: Program.PaymentType || 'Free',
      SendTo: Program.SendTo.length ? Program.SendTo : [''],
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      // dispatch(
      //   updateProgram({
      //     Price: values.price,
      //     BannerImage: values.BannerImage,
      //     Title: values.title,
      //     Description: values.description,
      //     PaymentType: values.PaymentType,

      //   })
      // );

      if (mode == 'create') {
        dispatch(
          updateFeedback({
            loading: true,
            sAnimate: true,
            message: 'Program created successfully',
            severity: 'success',
          }),
        );
        dispatch(
          saveProgram({
            ...Program,
            Price: values.price,
            BannerImage: values.BannerImage,
            Title: values.title,
            Description: values.description,
            PaymentType: values.PaymentType,
            SendTo: checkIsDraft(Program) ? [] : Program.SendTo,
            IsDraft: checkIsDraft(Program),
            IsPublished: !checkIsDraft(Program),
            Price: values.price,
            BannerImage: values.BannerImage,
            Title: values.title,
            Description: values.description,
            PaymentType: values.PaymentType,
          }),
        ).then((program) => {
          dispatch(
            updateFeedback({
              loading: false,
              sAnimate: true,
              snackbar: true,
              message: 'Program created successfully',
              severity: 'success',
            }),
          );
        });
      }

      if (mode == 'edit') {
        dispatch(
          updateProgram({
            Price: values.price,
            BannerImage: values.BannerImage,
            Title: values.title,
            Description: values.description,
            PaymentType: values.PaymentType,
            SendTo: checkIsDraft(Program) ? [] : Program.SendTo,
          }),
        );

        //   dispatch(saveProgram({
        //     ...Program,
        // IsDraft:false,
        //     SendTo: [],
        //   }))
        //       .then((program) => {
        //        dispatch(updateFeedback({
        //           loading: false,
        //           sAnimate: true,
        //           message: "Program created succesfully",
        //           severity: "success",
        //         }));

        //       });
      }
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, validateForm, values } = formik;

  useEffect(() => {
    if (!Program.Title) setFieldValue('title', null);
    if (!Program.Description) setFieldValue('description', null);
    if (!Program.BannerImage) setFieldValue('BannerImage', null);

    setFieldValue('title', Program.Title);

    setFieldValue('description', Program.Description);

    setFieldValue('BannerImage', Program.BannerImage);
    setFieldValue('price', Program.Price);
    setFieldValue('PaymentType', Program.PaymentType || 'Subscription');
  }, [Program]);

  useEffect(() => {
    ref.current = {
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      handelNext,
      validateForm,
      getFieldProps,
      setFieldValue,
      values,
    };
  }, []);

  return (
    <Content
      withoutPadding
      style={{ paddingBottom: 24, overflowY: 'auto' }}
    >
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          <Input
            hidden
            accept="image/*"
            type="file"
            id="bannerImage"
            onChange={(e) => {
              handleuploadImage(e)
                .then((res) => {
                  setFieldValue('BannerImage', res.data.Location);
                  dispatch(updateFeedback({ loading: false }));
                })
                .catch((err) => {
                  dispatch(updateFeedback({ loading: false }));
                });
            }}
            cropShape={'rect'}
            aspect={1.5}
          />
          <br/>
             <Box
                        position="relative"
                        width="100%"
                        height={values.BannerImage ? 'auto' : '210px'}
                        mt={2}
                        borderRadius={1}
                        border={`1px solid ${values.BannerImage ? 'transparent' : '#E1E7F0'}`}
             
                    >
                        {values.BannerImage && (
                            <img
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    backgroundColor: '#fff',
                                }}
                                onClick={(e) => {
                                    document
                                        ?.getElementById('bannerImage')
                                        ?.click()
                                }}
                                src={values.BannerImage}
                            />
                        )}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                width: '100%',
                                height: '100%',
                               
                                zIndex: 10,
                                display: 'flex',
                                paddingTop: 6,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                            // onClick={(e) => {
                            //   document?.getElementById("bannerImage")?.click();
                            // }}
                        >
                            
                                {/* <ImageFill
                                    icon={'bi:image-fill'}
                                    sx={{ fontSize: 36 }}
                                    color="#95A3B8"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        document
                                            ?.getElementById('bannerImage')
                                            ?.click()
                                    }}
                                /> */}

                                <Iconify
                                    icon={'fluent:image-32-regular'}
                                    width={48}
                                    height={48}
                                   sx={{
                                    color:"text.secondary",
                                    cursor:"pointer"
                                   }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        document
                                            ?.getElementById('bannerImage')
                                            ?.click()
                                    }}
                                />
                            
                            {/* {Profile.banner && (
                <IconButtonAnimate
                  onClick={(e) => {
                    removeBanner();
                  }}
                  sx={{
                    backgroundColor: "red",
                    padding: 0,
                    border: "2px solid #fff",
                    ml: 3,
                  }}
                  onChange={uploadBannerImage}
                >
                  <Iconify
                    icon={"iconoir:cancel"}
                    width={24}
                    height={24}
                    color="common.white"
                  />
                </IconButtonAnimate>
              )} */}

                            <Typography sx={{ mt: 1,textDecoration:'underline', fontSize:14, fontWeight:600}} color="text.secondary">
                            Add cover image
                            </Typography>

                            <Typography color="text.secondary">
                           Optional
                            </Typography>
                        </Box>
                    </Box>
          <Box px={2}>
            {checkIsDraft(Program) && (
              <Alert
                alignItems={'center'}
                severity="warning"
                sx={{ mb: 2 }}
              >
                You must have exercise in every week to publish your program.
              </Alert>
            )}
            <UpdateProgramForm
              submitTriggered={isSubmit}
              Program={Program}
              values={formik.values}
              updateProgram={updateProgram}
            />
          </Box>
        </Form>

        {mode == 'create' && (
          <Box marginTop={2}>
            <ButtonBase>
              <Iconify
                icon="bi:arrow-up-right-circle"
                sx={{ fontSize: 18 }}
                color={'text.primary'}
                ml={0.5}
              />
              &nbsp;&nbsp;
              <Typography
                variant="subtitle1"
                color="text.primary"
              >
                Send to
              </Typography>
            </ButtonBase>
            <SendProgramEmails
              allRecievers={values.SendTo}
              setAllRecievers={(arr) => setFieldValue('SendTo', arr)}
              errors={errors.SendTo}
              errorObj={{}}
              modal
              setErrorObj={() => {}}
            />
          </Box>
        )}
      </FormikProvider>
      {/* <SendProgramEmails /> */}
      <br />
    </Content>
    // <FooterBase>
    //   <Footer
    //     confirm
    //     next
    //     back
    //     nextText={mode == "edit" ? "Save" : "Publish"}
    //     nextClick={handelNext}
    //     backClick={handleBack}
    //   />
    // </FooterBase>
  );
});
