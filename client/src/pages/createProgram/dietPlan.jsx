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
import { updateOnboarding } from "../../redux/actions/Onboarding";
import LinearProgress from "@mui/material/LinearProgress";
import Iconify from "../../components/Iconify";
import LabeledInput from "../../components/core/LabeledInput";
import FooterBase from "../../components/Layout/Footer";
import NewProgramForm from "src/components/instructor/newProgramForm";
import Progress from "src/components/progress";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import Footer from "src/components/onboarding/footer";
import axios from "axios";
import api from "src/utils/api";
import { useOutletContext } from "react-router-dom";
import { computePath } from "src/utils/routepath";
import IconDietPlan from "src/assets/clientProfile/Icon_DietPlan";
import Slate from "src/utils/dietEditor";
import ProgramDescriptionModal from "src/components/instructor/ProgramDescriptionModal";
const RootStyle = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  flexGrow: 1,
  height: "100vh",
}));

const BoxStyle = styled(Box)(() => ({
  position: "relative",
}));

const InsideBoxStyle = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  paddingTop: 52,
  paddingBottom: 24,
  zIndex: 100,
  top: 0,
}));
const SocialButton = styled(ButtonBase)(({ theme }) => ({
  height: 45,

  borderRadius: 16,
  background: "#F9FCFD",
  fontFamily: "Proxima Nova",
  /* Dark primary / 50% */
  color: "#172A44",
  fontSize: 18,
  fontWeight: "bold",
  width: "100%",
  marginBottom: 8,
  border: "2px solid rgba(23, 42, 68, 0.5)",
}));

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
    Description: Yup.string(),
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

  useEffect(() => {
    ref.current = {
      errors,
      touched,
      handleSubmit,
      isSubmitting,

      validateForm,
      getFieldProps,
      setFieldValue,
      values,
    };
  }, []);

  return (
    <>
      {showDiet ? (
        <Content
          flex
          withoutPadding
          style={{ paddingTop: 0, paddingBottom: 24, background: "#fff" }}
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
    </>
  );
});

{
  /* <FooterBase>
              <Footer next={values.Title||values.Description} skip={!values.Title&&!values.Description} back type={"submit"} backClick={handleBack} />
            </FooterBase> */
}
