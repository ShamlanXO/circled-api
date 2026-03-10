import {
  Avatar,
  Box,
  Divider,
  SwipeableDrawer,
  TextField,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
  ButtonBase,
  Grid,
} from "@mui/material";

import React, { useState, useEffect, forwardRef } from "react";
import Log from "src/assets/IconSet/Log";
import AddCircled from "src/assets/IconSet/AddCircled";
import { styled } from "@mui/material/styles";
import Iconify from "../Iconify";
import LabeledInput from "../core/LabeledInput";
function MuscleHighlighterDrawer(props, ref) {
  const [drawerOpen, setDrawerOpen] = useState(props.openLogs);
  const [selected, setSelected] = useState({});
  const toggleDrawer = (isOpen) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(isOpen);
    setSelected({});
  };

  const AddLink = styled(ButtonBase)(({ theme }) => ({
    height: 50,
    border: "1px solid #73AEF2",
    boxShadow:
      "0px 11px 12px rgba(195, 203, 217, 0.15), 0px 0px 9px rgba(195, 203, 217, 0.25)",
    borderRadius: 12,
    padding: 12,
    fontWeight: 600,
    fontSize: 14,
    color: theme.palette.primary.main,
    width: "100%",
  }));

  const SocialButton = styled(ButtonBase)(({ theme }) => ({
    height: 50,
    border: "1px solid #E1E7F0",
    boxShadow:
      "0px 11px 12px rgba(195, 203, 217, 0.15), 0px 0px 9px rgba(195, 203, 217, 0.25)",
    borderRadius: 12,
    padding: 12,
    fontWeight: 600,
    fontSize: 14,
    color: theme.palette.primary.main,
    width: "100%",
    justifyContent: "flex-start",
    paddingLeft: 18,
  }));

  const SocialData = [
    {
      type: "instagram",
      icon: "skill-icons:instagram",
    },
    {
      type: "twitter",
      icon: "devicon:twitter",
    },
    {
      type: "facebook",
      icon: "devicon:facebook",
    },
    {
      type: "youtube",
      icon: "logos:youtube-icon",
    },
    {
      type: "spotify",
      icon: "logos:spotify-icon",
    },
    {
      type: "soundcloud",
      icon: "logos:soundcloud",
    },
    {
      type: "reddit",
      icon: "logos:reddit-icon",
    },

    {
      type: "custom",
      icon: "mdi:web-plus",
    },
  ];

  return (
    <div>
      <SwipeableDrawer
        anchor={"bottom"}
        PaperProps={{
          style: {
            backgroundColor: "#fff",
            boxShadow: "none",
            borderRadius: "24px 24px 0 0",
            padding: "20px",
            minHeight: "60vh",
            maxHeight: "90vh",
          },
        }}
        disableBackdropTransition
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Typography ml={1} sx={{ fontSize: 18, fontWeight: "600" }}>
            Add social links
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          flexGrow={1}
          overflow={"auto"}
        >
          {!selected.type ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {SocialData.map((item, index) => (
                <Grid item xs={6}>
                  <SocialButton onClick={() => setSelected(item)}>
                    <Iconify
                      icon={item.icon}
                      sx={{ fontSize: 24, mr: 1, width: 24 }}
                    />
                    <Typography
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.type}
                    </Typography>
                  </SocialButton>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box mt={2}>
              <LabeledInput
                fullWidth
                labelIcon={
                  <Iconify
                    icon={selected.icon}
                    sx={{ fontSize: 24, mr: 1, width: 24 }}
                  />
                }
                placeholder={"Your instagram profile link"}
                clabel={selected.type}
              />
            </Box>
          )}
        </Box>
      </SwipeableDrawer>
      <div onClick={() => setDrawerOpen(true)}>
        <AddLink>
          <AddCircled style={{ fontSize: 16, mr: 1 }} />
          <Typography sx={{ fontWeight: "600", fontSize: 14, ml: 1 }}>
            Add social links
          </Typography>
        </AddLink>
      </div>
    </div>
  );
}

export default forwardRef(MuscleHighlighterDrawer);
