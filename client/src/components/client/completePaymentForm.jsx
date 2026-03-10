// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  Radio,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import axios from "axios";
import api from "src/utils/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import LabeledInput from "../core/LabeledInput";
import { MobileDatePicker } from "@mui/lab";
import Label from "../Label";
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

const CardBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "10px",
  borderRadius: "8px",
  border: `1px solid #E1E7F0`,
  ":focus-within": {
    // '& .FocusedContent': {
    //   display: 'block',
    // },
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: "0px 4px 24px #E1E7F0",
  },
}));

// ----------------------------------------------------------------------

export default function CompletePaymentForm(props) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("VISA");
  const [codeStatus, setCodeStatus] = useState("none");
  const [discountCode, setDiscountCode] = useState("");
  const handleApplyDiscountCode = () => {
    if (discountCode == "1") {
      setCodeStatus("Expired");
    } else if (discountCode == "2") {
      setCodeStatus("Incorrect");
    } else {
      setCodeStatus("Applied");
    }
  };
  const RegisterSchema = Yup.object().shape({
    postalCode: Yup.string()
      .required("Postal Code is required")
      .max(10, "Enter a valid postalCode"),
    cardNo: Yup.string().required("Card no is required"),
    cardExpiry: Yup.string().required("Expiry is required"),
    cvv: Yup.string().required("CVV is required"),
    billingAddress: Yup.string().required("Billling Address"),
  });

  const [filePicked, setFilePicked] = useState(null);
  const formik = useFormik({
    initialValues: {
      postalCode: "",
      cardNo: "",
      cardExpiry: "",
      billingAddress: "0",
      cvv: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      //   dispatch(
      //     updateFeedback({
      //       loading: true,
      //     })
      //   );
      // axios
      //   .post(`${api.protocol}${api.baseUrl}${api.SendVerifyMail}`, {
      //     postalCode: values.postalCode,
      //   })
      //   .then((response) => {
      //   dispatch(
      //     updateOnboarding({
      //       authType: 1,
      //       postalCode: values.postalCode,
      //       bio: values.bio,
      //       type: null,
      //     })
      //   );
      //   dispatch(
      //     updateFeedback({
      //       loading: false,
      //       snackbar: true,
      //       message: "Verification mail sent to your postalCode!",
      //       severity: "success",
      //     })
      //   );
      // })
      // .catch((error) => {
      //   if (error.response.status === 406) {
      //   }
      // return dispatch(
      //   updateFeedback({
      //     loading: false,
      //     snackbar: true,
      //     message: "Acccount with give postalCode address already exists!",
      //     severity: "error",
      //   })
      // );
      // else {
      // }
      // return dispatch(
      //   updateFeedback({
      //     loading: false,
      //     snackbar: true,
      //     message: "Oops caught some error! Please try again",
      //     severity: "error",
      //   })
      // );
      // });
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
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Stack>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Billing address
            </Typography>
            <Select
              fullWidth
              defaultValue={"0"}
              {...getFieldProps("billingAddress")}
              error={touched.billingAddress && errors.billingAddress}
              // sx={{
              //   "& .MuiSvgIcon-root": {
              //     color: "primary.main",
              //   },
              // }}
            >
              <MenuItem value={"0"} disabled selected>
                <Typography variant="body1" color="text.secondary">
                  {" "}
                  Choose Address
                </Typography>
              </MenuItem>
              <MenuItem value={"United Kingdom"}>United Kingdom</MenuItem>
              <MenuItem value={"United States"}>United States</MenuItem>
            </Select>
          </Stack>
          <LabeledInput
            fullWidth
            placeholder="e.g. 1354GZ12"
            clabel="Postal code"
            {...getFieldProps("postalCode")}
            error={Boolean(touched.postalCode && errors.postalCode)}
            helperText={touched.postalCode && errors.postalCode}
          />
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.primary">
              Payment method
            </Typography>
            <CardBox>
              <Radio
                color="secondary"
                checked={paymentMethod === "VISA"}
                onChange={() => setPaymentMethod("VISA")}
              />{" "}
              <Typography
                variant="subtitle1"
                color={
                  paymentMethod === "VISA" ? "text.primary" : "text.secondary"
                }
              >
                VISA
              </Typography>
            </CardBox>
            <CardBox>
              <Radio
                color="secondary"
                checked={paymentMethod === "Credit Card"}
                onChange={() => setPaymentMethod("Credit Card")}
              />{" "}
              <Typography
                variant="subtitle1"
                color={
                  paymentMethod === "Credit Card"
                    ? "text.primary"
                    : "text.secondary"
                }
              >
                Credit Card
              </Typography>
            </CardBox>
          </Stack>
          <LabeledInput
            fullWidth
            placeholder=""
            clabel="Credit Card Number"
            {...getFieldProps("cardNo")}
            error={Boolean(touched.cardNo && errors.cardNo)}
            helperText={touched.cardNo && errors.cardNo}
          />
          <Stack direction={"row"} spacing={2}>
            <LabeledInput
              fullWidth
              placeholder="mm/yy"
              clabel="Expiry date"
              {...getFieldProps("cardExpiry")}
              error={Boolean(touched.cardExpiry && errors.cardExpiry)}
              helperText={touched.cardExpiry && errors.cardExpiry}
            />
            <LabeledInput
              fullWidth
              placeholder="****"
              clabel="CVV"
              type="number"
              {...getFieldProps("cvv")}
              error={Boolean(touched.cvv && errors.cvv)}
              helperText={touched.cvv && errors.cvv}
            />
          </Stack>
          <LabeledInput
            fullWidth
            placeholder="e.g. 1354GZ12"
            clabel="Discount code"
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value);
              setCodeStatus("none");
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {codeStatus == "none" && (
                    <Box sx={{ color: "#53647A" }}>
                      <Button
                        variant="contained"
                        color="info"
                        sx={{ height: 24, p: 1 }}
                        onClick={() => handleApplyDiscountCode()}
                      >
                        Check
                      </Button>
                    </Box>
                  )}
                  {codeStatus == "Expired" && (
                    <Box>
                      <Label variant="filled" color="warning">
                        <Typography variant="body2" color="inherit">
                          Expired
                        </Typography>
                      </Label>
                    </Box>
                  )}
                  {codeStatus == "Incorrect" && (
                    <Box>
                      <Label variant="filled" color="error">
                        <Typography variant="body2" color="inherit">
                          Incorrect
                        </Typography>
                      </Label>
                    </Box>
                  )}
                  {codeStatus == "Applied" && (
                    <Box>
                      <Label variant="filled" color="success">
                        <Typography variant="body2" color="inherit">
                          Applied
                        </Typography>
                      </Label>
                    </Box>
                  )}
                </InputAdornment>
              ),
              style: {
                border:
                  codeStatus == "Expired"
                    ? "1px solid #FFB400"
                    : codeStatus == "Incorrect"
                    ? "1px solid #EE3737"
                    : codeStatus == "Applied"
                    ? "1px solid #36E968"
                    : "",
              },
            }}
          />
        </Stack>{" "}
      </Form>
    </FormikProvider>
  );
}
