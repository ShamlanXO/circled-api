// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import Label from "../Label";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router";
import SwitchCustom from "../SwitchCustom";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 0 10px 0",
  padding: "5px",
  borderRadius: 4,
  cursor: "pointer",
  ":hover": {
    boxShadow: "0px 4px 54px rgba(225, 231, 240, 1)",
  },
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  //zIndex: 100,
  backgroundColor: "#fff",
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "0px 0px 8px 8px",
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

export default function ProgramsToSend(props) {
  const navigate = useNavigate();
  const programs = [{}, {}, {}, {}];
  return (
    <BoxHeader>
      {programs.map((item) => (
        <BoxStyle>
          <Box
            display={"flex"}
            alignItems="center"
            onClick={() => props.handleSendProgram(item)}
          >
            <Avatar
              variant="rounded"
              style={{
                width: "120px",
                height: "112px",
                backgroundColor: "#F3F5F8",
              }}
              src={"/images/instructor/programImage.png"}
            />

            <Box width="auto" marginLeft={2}>
              <Typography variant="h5" color="text.primary">
                {item.Title ?? "Fat Toaster"}
              </Typography>{" "}
              <Typography variant="body2" color="text.secondary">
                Price : $299.00
              </Typography>
            </Box>
          </Box>
        </BoxStyle>
      ))}
    </BoxHeader>
  );
}
