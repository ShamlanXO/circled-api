// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import { Avatar, Box, InputAdornment, Stack, Typography } from "@mui/material";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import axios from "axios";
import api from "src/utils/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import LabeledInput from "../core/LabeledInput";
import Icon_AddProgramImg from "src/assets/createProgram/Icon_AddProgramImg";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",
}));

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 10px",
  zIndex: 100,
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

// ----------------------------------------------------------------------

export default function NewProgramForm(props) {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").max(24, "Title too long"),
    description: Yup.string().max(100, "Description too long"),
    avatar: Yup.mixed()
      .required("You need to provide a file")
      .test(
        "type",
        "Only the following formats are accepted: .jpeg, .jpg, .png",
        (value) =>
          value &&
          (value.type === "image/jpeg" ||
            value.type === "image/bmp" ||
            value.type === "image/png" ||
            value.type === "application/pdf" ||
            value.type === "application/msword")
      )
      .test(
        "fileSize",
        "The file is too large",
        (value) => value && value.size <= 2000000
      ),
  });

  const [filePicked, setFilePicked] = useState(null);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      avatar: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      //   dispatch(
      //     updateFeedback({
      //       loading: true,
      //     })
      //   );
      axios
        .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
          title: values.title,
        })
        .then((response) => {
          //   dispatch(
          //     updateOnboarding({
          //       authType: 1,
          //       title: values.title,
          //       description: values.description,
          //       type: null,
          //     })
          //   );
          //   dispatch(
          //     updateFeedback({
          //       loading: false,
          //       snackbar: true,
          //       message: "Verification mail sent to your title!",
          //       severity: "success",
          //     })
          //   );
        })
        .catch((error) => {
          if (error.response.status === 406) {
          }
          // return dispatch(
          //   updateFeedback({
          //     loading: false,
          //     snackbar: true,
          //     message: "Acccount with give title address already exists!",
          //     severity: "error",
          //   })
          // );
          else {
          }
          // return dispatch(
          //   updateFeedback({
          //     loading: false,
          //     snackbar: true,
          //     message: "Oops caught some error! Please try again",
          //     severity: "error",
          //   })
          // );
        });
    },
  });

  const imageHandler = (event) => {
    if (!event.target.files[0]) return false;

    setFilePicked(URL.createObjectURL(event.target.files[0]));

    setFieldValue("avatar", event.target.files[0]);
  };
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    values,
  } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <br />
        <br />
        <Stack spacing={1} sx={{ width: "100%" }} alignItems="center">
          <Typography variant="h5">Create Your Program</Typography>
          <Typography variant="body2" color="text.secondary">
            Build your fitness program and send to <br />
            your clients and monetize of your work.
          </Typography>
        </Stack>
        <br />
        <br />
        <Stack spacing={3} sx={{ width: "100%" }}>
          <Box width="100%" display="flex" alignItems="center">
            <input
              accept="image/*"
              id="programPicUpload"
              type="file"
              style={{ display: "none" }}
              onClick={(e) => {
                e.target.value = "";
              }}
              onChange={(event) => imageHandler(event)}
            />
            <label htmlFor="programPicUpload">
              <Avatar
                variant="rounded"
                style={{
                  width: "130px",
                  height: "112px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  boxShadow: "0px 0px 7px #777777",
                  border: "1px solid #E1E7F0",
                }}
              >
                {filePicked ? (
                  <img
                    src={filePicked}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Icon_AddProgramImg />
                )}
              </Avatar>
            </label>

            <Box display="flex" flexDirection={"column"} sx={{ marginLeft: 2 }}>
              <Typography variant="h6">
                Choose an image for your program
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a photo of at least{" "}
              </Typography>
            </Box>
          </Box>
          <LabeledInput
            fullWidth
            placeholder="Example: yoga "
            clabel="Program Title*"
            {...getFieldProps("title")}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    {(formik.values.title + "").length + "/24"}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
          <LabeledInput
            fullWidth
            placeholder="Example: yoga "
            clabel="Program Description"
            {...getFieldProps("description")}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            multiline
            minRows={4}
            maxRows={4}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    display={"flex"}
                    flexDirection="column"
                    justifyContent={"flex-end"}
                    marginTop={10}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {(formik.values.description + "").length + "/100"}
                    </Typography>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>{" "}
      </Form>
    </FormikProvider>
  );
}
