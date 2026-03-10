// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  ButtonBase,
  InputAdornment,
  Radio,
  Stack,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import axios from "axios";
import api from "src/utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LabeledInput from "../core/LabeledInput";
import { MobileDatePicker } from "@mui/lab";
import ProgramDescriptionModal from "src/components/instructor/ProgramDescriptionModal";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",
}));

const UploadBox = styled(Box)(({ theme }) => ({
  width: "150px",
  height: "150px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: `1px dashed ${theme.palette.secondary.main}`,
  borderRadius: 12,
  cursor: "pointer",
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

export default function BodySystemForm({ data, setData, saveData }) {
  const navigate = useNavigate();
  const RegisterSchema = Yup.object().shape({
    medication: Yup.string(),
    supplements: Yup.string(),
    notes: Yup.string(),
    performanceEnhancers: Yup.string(),
  });

  const [filePicked, setFilePicked] = useState(null);
  const formik = useFormik({
    initialValues: {
      medication: "",
      supplements: "",
      notes: "",
      performanceEnhancers: "",

      ...data,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setData({ ...data, ...values });
      saveData({ ...data, ...values });
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

  useEffect(() => {
    return () => {
      handleSubmit();
    };
  }, []);
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ width: "100%" }}>
          <LabeledInput
            fullWidth
            placeholder="Write here"
            clabel="Medication"
            {...getFieldProps("medication")}
            error={Boolean(touched.medication && errors.medication)}
            helperText={touched.medication && errors.medication}
            InputProps={{
              style: {
                //backgroundColor: "#E1E7F0",
              },
            }}
          />
          <LabeledInput
            fullWidth
            placeholder="Write here"
            clabel="Supplements"
            {...getFieldProps("supplements")}
            error={Boolean(touched.supplements && errors.supplements)}
            helperText={touched.supplements && errors.supplements}
            InputProps={{
              style: {
                // backgroundColor: "#E1E7F0",
              },
            }}
          />
          <LabeledInput
            fullWidth
            placeholder="Write here"
            clabel="Performance enhancers "
            {...getFieldProps("performanceEnhancers")}
            error={Boolean(
              touched.performanceEnhancers && errors.performanceEnhancers
            )}
            helperText={
              touched.performanceEnhancers && errors.performanceEnhancers
            }
            InputProps={{
              style: {
                // backgroundColor: "#E1E7F0",
              },
            }}
          />{" "}
          <ProgramDescriptionModal
            fullWidth
            placeholder="Write here"
            headerSubTitle="Additional Notes"
            multiline={true}
            minRows={3}
            {...getFieldProps("notes")}
            error={Boolean(touched.notes && errors.notes)}
            helperText={touched.notes && errors.notes}
            InputProps={{
              style: {
                // backgroundColor: "#E1E7F0",
              },
            }}
          >
            <LabeledInput
              fullWidth
              placeholder="Write here"
              clabel="Additional Notes"
              multiline={true}
              minRows={3}
              {...getFieldProps("notes")}
              error={Boolean(touched.notes && errors.notes)}
              helperText={touched.notes && errors.notes}
              InputProps={{
                style: {
                  // backgroundColor: "#E1E7F0",
                },
              }}
            />
          </ProgramDescriptionModal>
        </Stack>{" "}
      </Form>
    </FormikProvider>
  );
}
