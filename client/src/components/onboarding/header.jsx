// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../../components/Page";
// sections
import { Box, Typography, IconButton ,Button} from "@mui/material";

import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import { useTheme } from "@mui/styles";
import { useNavigate, useLocation } from "react-router";
import Header from "../../components/Layout/Header";
import ArrowLeft from "src/assets/IconSet/ArrowLeft";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
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

// ----------------------------------------------------------------------

export default function HeaderOn({ title, onClose ,onSkip}) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Header
      style={{
        borderRadius: "0px 0px 32px 32px",
        backgroundColor: "white",
        boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
        overflow: "hidden",
      }}
    >
      <Box pt={2} borderRadius={4} overflow={"hidden"}>
        <Box
          width={"100%"}
          display={"flex"}
          px={2}
          mb={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} alignItems={"center"}>
            {" "}
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: "text.primary" }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="body1" color="text.primary">
              <Box display={"flex"} alignItems={"center"}>
                {/* {mode == "edit"
                      ? "Program Overview"
                      : mode === "customize"
                      ? "Client Profile"
                      : "Home"}
                    &nbsp;&gt;&nbsp; */}
                <Typography
                  color="text.primary"
                  sx={{ fontSize: 18, fontWeight: "bold" }}
                >
                  {" "}
                  {title}
                </Typography>
              </Box>
            </Typography>{" "}
          </Box>{" "}
        {onSkip&&  <Button type={"text"} sx={{py:0}} onClick={onSkip}>
            Skip
          </Button>}
        </Box>
        {/* <Box
        display={"flex"}
        justifyContent="center"
        alignItems={"center"}
        mt={4}
      >
        <Typography variant="h3" sx={{ color: "grey.700" }}>
          Circled.fit
        </Typography>
        <Box
          sx={{
            ml: 1,
            px: 1,
            backgroundColor: "primary.lighter",
            borderRadius: "30px",
          }}
        >
          {" "}
          <Box sx={{ color: "primary.main", fontSize: 10, py: 0.3 }}>Beta</Box>
        </Box>
      </Box> */}
      </Box>
    </Header>
  );
}
