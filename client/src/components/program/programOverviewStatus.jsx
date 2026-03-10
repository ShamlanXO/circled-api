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
  Typography,
} from "@mui/material";

import Iconify from "../Iconify";
import { useNavigate } from "react-router";
import ChartLine from "src/pages/overview/extra/chart/ChartLine";
import ChartRadarBar from "src/pages/overview/extra/chart/ChartRadarBar";
import ChartArea from "src/pages/overview/extra/chart/ChartArea";
import { useState } from "react";
import ChartBar from "src/pages/overview/extra/chart/ChartBar";
import ChartColumnSingle from "src/pages/overview/extra/chart/ChartColumnSingle";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 10px",
  maxWidth: "xs",
  zIndex: 100,
}));
const TabBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "activeChart",
})(({ activeChart, theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  justifyContent: "space-between",
  zIndex: 100,
  boxShadow: "0px 4px 16px rgba(225, 231, 240, 0.5)",
  padding: "12px",
  cursor: "pointer",
  margin: "0 6px",
  borderRadius: "8px",
  color: theme.palette.text.secondary,
  backgroundColor: "#fff",
  border: "1px solid #E1E7F0",
  ...(activeChart && {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0px 8px 13px rgba(139, 187, 244, 0.5)",
  }),
}));

// ----------------------------------------------------------------------

export default function ProgramOverviewStatus() {
  const navigate = useNavigate();
  const [activeChart, setActiveChart] = useState("revenue");

  return (
    <Box backgroundColor={"#fff"} height={"100%"}>
      {activeChart == "revenue" ? <ChartArea /> : <ChartColumnSingle />}
      <BoxStyle>
        <TabBox
          activeChart={activeChart == "revenue"}
          onClick={() => setActiveChart("revenue")}
        >
          <Typography variant="body1" color="inherit">
            Total revenue
          </Typography>
          <Typography
            variant="h6"
            color={activeChart != "revenue" ? "primary.main" : "inherit"}
          >
            $3,992
          </Typography>
        </TabBox>
        <TabBox
          activeChart={activeChart == "customers"}
          onClick={() => setActiveChart("customers")}
        >
          <Typography variant="body1" color="inherit">
            Active Customers
          </Typography>
          <Typography
            variant="h6"
            color={activeChart != "customers" ? "error.light" : "inherit"}
          >
            12
          </Typography>
        </TabBox>
      </BoxStyle>
    </Box>
  );
}
