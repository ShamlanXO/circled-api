// @mui
import { styled } from "@mui/material/styles";
import { useState } from "react";
// components
import Page from "../components/Page";
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
  Stepper,
} from "@mui/material";

import Container from "../components/Layout/Container";
import Content from "../components/Layout/Content";
import Header from "../components/Layout/Header";
import { useNavigate, useLocation } from "react-router";
import Iconify from "../components/Iconify";
import LabeledInput from "../components/core/LabeledInput";
import ExerciseCard from "src/components/instructor/exerciseCard";
import Label from "src/components/Label";
import ArrowLeft from "src/assets/IconSet/ArrowLeft";

const RootStyle = styled("div")(() => ({
  backgroundColor: "#fff",
  height: "100%",
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
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  zIndex: 100,
  backgroundColor: "#fff",
  boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "0px 0px 8px 8px",
}));
const SpaceBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "12px 0",
  padding: "5px",
  boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
}));
// ----------------------------------------------------------------------

export default function Notifications() {
  const [exercises, setExercises] = useState([{}, {}]);
  const navigate = useNavigate();

  const handleAddNewCard = () => {
    let newEx = [...exercises];
    newEx.push({
      isNew: true,
    });
    setExercises(newEx);
  };
  const handleBack = () => {
    navigate("/workoutCalendar");
  };

  return (
    <RootStyle>
      <Page title="Notifications">
        <Container>
          {" "}
          <Header noColor>
            <BoxHeader px={2} py={2}>
              <Box
                width={"100%"}
                display={"flex"}
                alignItems={"center"}
                flexDirection={"row"}
              >
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ color: "text.primary" }}
                >
                  <ArrowLeft />
                </IconButton>
                <Typography variant="h6" color="text.primary">
                  Notifications
                </Typography>
              </Box>
            </BoxHeader>
          </Header>{" "}
          <Content
            style={{
              paddingTop: 16,
              paddingBottom: 48,
              overflowY: "auto",
            }}
          >
            <SpaceBox>
              <Avatar src={"/images/dummyUser.png"} />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  gutterBottom
                >
                  Brad Ainston.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sent you a program
                </Typography>

                <Typography variant="body2" color="text.primary">
                  25 days bodybuilding
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Box
                display={"flex"}
                flexDirection="column"
                sx={{ width: "84px" }}
              >
                <Avatar
                  variant="rounded"
                  style={{
                    width: "100%",
                    height: "56px",
                    marginBottom: "5px",
                  }}
                  src={"/images/instructor/programOverview.jpg"}
                />
                <Typography
                  align="right"
                  variant="caption"
                  color="text.secondary"
                >
                  3 min ago
                </Typography>
              </Box>
            </SpaceBox>
          </Content>
        </Container>{" "}
      </Page>
    </RootStyle>
  );
}
