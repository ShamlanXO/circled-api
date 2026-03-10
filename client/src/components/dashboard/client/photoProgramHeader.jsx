// @mui
import { styled } from "@mui/material/styles";
// components
// sections
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Iconify from "../../Iconify";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router";
import ProgramList from "./../ProgramList";
import ArrowLeft from "src/assets/IconSet/ArrowLeft";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  borderRadius: "0px 0px 8px 8px",
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  //zIndex: 100,
  backgroundColor: "#fff",
  boxShadow: "0px 4px 54px #E1E7F0",
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

export default function PhotoProgramHeader({ setHeaderDependency }) {
  const [mini, setMini] = useState(false);
  const navigate = useNavigate();
  const minimize = () => {
    setMini(!mini);
    setTimeout(() => {
      setHeaderDependency(mini);
    }, 300);
  };
  return (
    <BoxHeader>
      {mini && (
        <Fade in={mini}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
            padding={"20px 10px 0 20px"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: "text.primary" }}
              >
                <ArrowLeft />
              </IconButton>
              &nbsp;
              <Typography variant="h5" color="text.primary">
                Photos
                <Typography
                  component={"span"}
                  variant="body1"
                  color="primary.main"
                >
                  
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}
      {
        <Collapse in={!mini}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent="space-between"
            padding={"20px 10px 0 20px"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: "text.primary" }}
              >
                <ArrowLeft />
              </IconButton>
              &nbsp;
              <Typography variant="h5" color="text.primary">
                Client’s Profile
                <Typography
                  component={"span"}
                  variant="body1"
                  color="primary.main"
                >
                  &nbsp;/&nbsp;Photos&nbsp;/&nbsp;Fat burner
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box width="auto" margin="30px 20px 20px">
            <BoxStyle>
              <Avatar
                variant="rounded"
                style={{
                  width: "130px",
                  height: "112px",
                  backgroundColor: "#fff",
                }}
                src={"/images/instructor/programImage.png"}
              />

              <Box marginLeft={2}>
                <Typography variant="h5" color="text.primary" gutterBottom>
                  Yoga 🔥
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate("planDetail")}
                  sx={{ height: 30, padding: "4px 8px" }}
                >
                  <Iconify
                    icon={"akar-icons:eye"}
                    width={20}
                    height={20}
                    color="primary.main"
                  />
                  &nbsp;&nbsp;
                  <Typography variant="body1" color="primary.main">
                    View Plan
                  </Typography>
                </Button>
              </Box>
            </BoxStyle>
          </Box>
        </Collapse>
      }
      <Box display="flex" justifyContent={"center"}>
        <IconButton onClick={minimize}>
          <Iconify
            icon={
              mini
                ? "ic:round-keyboard-arrow-down"
                : "ic:round-keyboard-arrow-up"
            }
            width="24px"
            height="24px"
          />
        </IconButton>
      </Box>
    </BoxHeader>
  );
}
