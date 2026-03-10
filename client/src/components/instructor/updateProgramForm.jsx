// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  InputAdornment,
  ListItemButton,
  Badge,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ImageFill from "src/assets/createProgram/ImageFill";
import * as Yup from "yup";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import DurationPopover from "./durationPopover";
import { useNavigate } from "react-router";
import axios from "axios";
import { useFormikContext, Formik, Form, Field } from "formik";
import { createRef, useEffect, useRef, useState } from "react";
import api from "src/utils/api";
import LabeledInput from "../core/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import ProgramDescriptionModal from "src/components/instructor/ProgramDescriptionModal";
import SubscriptionTypePopover from "./subscriptionTypePopover";
import { updateFeedback } from "src/redux/actions/feedback";
import { handleuploadImage } from "src/utils/uploader";
import Input from "../Labs/Cropper";
import Icon_AddProgramImg from "src/assets/createProgram/Icon_AddProgramImg";
// ----------------------------------------------------------------------

const WorkoutDay = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 100,
  backgroundColor: "#fff",
  padding: "5px 10px",
  margin: "12px 0",
  boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "8px",
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
const BoxStyle = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  // alignItems: "center",
  zIndex: 100,
  borderRadius: "8px",
}));
// ----------------------------------------------------------------------

export default function UpdateProgramForm(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Program, updateProgram } = props;
  const [selectedSubscriptionType, setSubscriptionType] = useState(
    Program.PaymentType
  );

  const imageHandler = (event) => {
    if (!event.target.files[0]) return false;

    //  setFilePicked(URL.createObjectURL(event.target.files[0]));

    setFieldValue("BannerImage", event.target.files[0]);
  };

  const handleDeleteImage = () => {
    dispatch(
      updateProgram({
        BannerImage: "",
      })
    );
  };
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    values,
  } = useFormikContext();

  const handleSubscriptionType = (val) => {
    setSubscriptionType(val);
    if (val == "Free") {
      setFieldValue("price", 0);
      setFieldValue("PaymentType", val);
      dispatch(
        updateProgram({
          Price: 0,
          PaymentType: val,
        })
      );
    } else {
      setFieldValue("PaymentType", val);
      dispatch(
        updateProgram({
          PaymentType: val,
        })
      );
    }
  };
  return (
    <>
      <br />
      <Stack spacing={3} sx={{ width: "100%" }}>
        <LabeledInput
          fullWidth
          placeholder="example: Yoga "
          clabel="Program Title"
          {...getFieldProps("title")}
          error={Boolean(touched.title && errors.title)}
          helperText={touched.title && errors.title}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2" color="text.secondary">
                  {(values.title + "").length + "/24"}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
        {/* <BoxStyle style={{ alignItems: "end" }}>
          <Box width="60%">
            <Box display="flex" alignItems={"center"} sx={{ mb: 0.5 }}>
              <Typography variant="h6" color="text.primary">
                Pricing model
              </Typography>{" "}
            </Box>

            <SubscriptionTypePopover
              selectedSubscriptionType={values.PaymentType}
              setSubscriptionType={handleSubscriptionType}
            ></SubscriptionTypePopover>
          </Box>
          &nbsp;&nbsp;
          {values.PaymentType !== "Free" ? (
            <Box width="40%">
              <Box
                display="flex"
                alignItems={"center"}
                sx={{ mb: 0.5, color: "common.white" }}
              >
                <Typography variant="h6" sx={{ color: "common.white" }}>
                  Price
                </Typography>{" "}
              </Box>
              <TextField
                fullWidth
                placeholder="price"
                {...getFieldProps("price")}
                disabled={values.PaymentType == "Free"}
                error={Boolean(touched.price && errors.price)}
                helperText={touched.price && errors.price}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={"uil:dollar-alt"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ) : null}{" "}
        </BoxStyle> */}
        <ProgramDescriptionModal
          headerTitle="Create program"
          headerSubTitle="Description"
          fullWidth
          placeholder="Write about your progam...."
          clabel="Description"
          {...getFieldProps("description")}
          error={Boolean(touched.description && errors.description)}
          helperText={touched.description && errors.description}
          multiline
          minRows={6}
          inputProps={{
            maxLength: 1000,
          }}
          endAdornment={
            <InputAdornment position="end">
              <Box
                position={"absolute"}
                bottom={-16}
                right={16}
                display={"flex"}
                flexDirection="column"
                justifyContent={"flex-end"}
                // marginTop={10}
              >
                <Typography variant="body2" color="text.secondary">
                  {(values.description + "").length + "/1000"}
                </Typography>
              </Box>
            </InputAdornment>
          }
          // InputProps={{

          // }}
        >
          <LabeledInput
            fullWidth
            placeholder="Write about your progam...."
            clabel="Program Description"
            {...getFieldProps("description")}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            multiline
            minRows={4}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    position={"absolute"}
                    bottom={12}
                    right={16}
                    display={"flex"}
                    flexDirection="column"
                    justifyContent={"flex-end"}
                    // marginTop={10}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {(values.description + "").length + "/1000"}
                    </Typography>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </ProgramDescriptionModal>

        <br />
      </Stack>{" "}
    </>
  );
}
