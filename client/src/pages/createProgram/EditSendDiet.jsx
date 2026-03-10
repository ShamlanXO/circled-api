// @mui
import { styled } from "@mui/material/styles";
import { useState, useEffect, forwardRef } from "react";
// components
import Page from "../../components/Page";
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Container from "../../components/Layout/Container";
import Content from "../../components/Layout/Content";
import Header from "../../components/Layout/Header";
import { useNavigate, useLocation } from "react-router";
import { updateFeedback } from "../../redux/actions/feedback";
import { useDispatch, useSelector } from "react-redux";
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

import { useOutletContext } from "react-router-dom";
import { computePath } from "src/utils/routepath";
import IconDietPlan from "src/assets/clientProfile/Icon_DietPlan";
import Slate from "src/utils/dietEditor";


const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,

    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [Program, updateProgram, mode] = useOutletContext();
  const { search } = useLocation();
  const [showDiet, setShowDiet] = useState(
    Program.DietPlan.Title || Program.DietPlan.Description ? true : false
  );
  const query = new URLSearchParams(search);

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    Title: Yup.string().max(50, "Title too long"),
    Description: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      Title: Program.DietPlan.Title || "",
      Description: Program.DietPlan.Description || "",
    },
    validationSchema: RegisterSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      dispatch(
        updateProgram({
          DietPlan: { Title: values.Title, Description: values.Description },
        })
      );
      // navigate(computePath(mode,mode=="send"?"/":"/publishProgram",Program._id));
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    validateForm,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    values,
  } = formik;

  const handleBack = () => {
    navigate(-1);
  };

//   useEffect(() => {
//     ref.current = {
//       errors,
//       touched,
//       handleSubmit,
//       isSubmitting,

//       validateForm,
//       getFieldProps,
//       setFieldValue,
//       values,
//     };
//   }, []);

useEffect(()=>{
    return()=>{
        handleSubmit()
    }
},[])
  return (
    <Container>
          <Header noColor boxShadow>
                                    <BoxHeader px={2} py={2}>
                                        <Box
                                            width={'100%'}
                                            display={'flex'}
                                            alignItems={'center'}
                                            justifyContent={'space-between'}
                                        >
                                            <Box
                                                display={'flex'}
                                                alignItems={'center'}
                                            >
                                                {' '}
                                                <IconButton
                                                    onClick={() => navigate(-1)}
                                                    sx={{
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    <ArrowLeft />
                                                </IconButton>
                                                <Typography
                                                    variant="body1"
                                                    color="text.primary"
                                                >
                                                    {/* Program Overview &nbsp;&gt;&nbsp; */}
                                                    <Typography
                                                        component={'span'}
                                                        variant="subtitle1"
                                                        color="text.primary"
                                                    >
                                                        Edit meal plan
                                                    </Typography>
                                                </Typography>
                                            </Box>{' '}
                                        </Box>
                                    </BoxHeader>
                                </Header>
      {showDiet ? (
        <Content
          flex
          withoutPadding
          style={{ paddingTop: 24, paddingBottom: 24, background: "#fff" }}
        >
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
              style={{ height: "100%" }}
            >
              {/* <Stack spacing={1} sx={{ width: "100%" }} alignItems="center">
                <Typography variant="h4">Diet Plan</Typography>
              </Stack> */}

              {/* <LabeledInput
                  fullWidth
                  placeholder="Example: yoga "
                  clabel="Plan title"
                  {...getFieldProps("Title")}
                  onChange={(e) => {
                    getFieldProps("Title").onChange(e);
                    handleSubmit();
                  }}
                  inputProps={{
                    maxLength: 50,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">
                          {(formik.values.Title + "").length + "/50"}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.Title && errors.Title)}
                  helperText={touched.Title && errors.Title}
                /> */}

              <Slate
                onChange={(data) => setFieldValue("Description", data)}
                value={
                  values.Description && values.Description[0] == "["
                    ? JSON.parse(values.Description)
                    : [
                        {
                          type: "paragraph",
                          children: [
                            {
                              text: "",
                            },
                          ],
                        },
                      ]
                }
              />

              {/* <ProgramDescriptionModal
                  headerSubTitle="Diet Plan"
                  fullWidth
                  placeholder="Example: yoga "
                  clabel="Diet Details"
                  {...getFieldProps("Description")}
                  onChange={(e) => {
                    getFieldProps("Description").onChange(e);
                    handleSubmit();
                  }}
                  error={Boolean(touched.Description && errors.Description)}
                  helperText={touched.Description && errors.Description}
                  multiline
                  minRows={9}
                  maxRows={9}
                >
                  <LabeledInput
                    fullWidth
                    placeholder="Example: yoga "
                    clabel="Diet Details"
                    {...getFieldProps("Description")}
                    onChange={(e) => {
                      getFieldProps("Description").onChange(e);
                      handleSubmit();
                    }}
                    error={Boolean(touched.Description && errors.Description)}
                    helperText={touched.Description && errors.Description}
                    multiline
                    minRows={9}
                    maxRows={9}
                  />
                </ProgramDescriptionModal> */}
            
            </Form>
          </FormikProvider>{" "}
        </Content>
      ) : (
        <Box
          flexGrow={1}
          pb={16}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <IconDietPlan sx={{ mb: 0, fontSize: 48 }} />
          <Typography color={"text.secondary"} align="center" sx={{ mt: 1 }}>
            Adding meal plan is optional.
          </Typography>
          <Button
            size={"large"}
            sx={{ fontSize: 16 }}
            onClick={() => setShowDiet(true)}
          >
            Add now
          </Button>
        </Box>
      )}
    </Container>
  );
});

{
  /* <FooterBase>
              <Footer next={values.Title||values.Description} skip={!values.Title&&!values.Description} back type={"submit"} backClick={handleBack} />
            </FooterBase> */
}
