// @mui
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
// components
import Page from "./../components/Page";

// sections
import { Box, Typography, ButtonBase, IconButton } from "@mui/material";

import Container from "./../components/Layout/Container";
import Content from "./../components/Layout/Content";
import Header from "./../components/Layout/Header";
import { useNavigate, useLocation } from "react-router";
import Iconify from "./../components/Iconify";

import { getChatUsers } from "src/redux/actions/chat";
import { useDispatch, useSelector } from "react-redux";
import ArrowLeft from "src/assets/IconSet/ArrowLeft";
const RootStyle = styled("div")(() => ({
  backgroundColor: "#fff",
  height: "100%",
}));

const BoxHeader = styled(Box)(() => ({
  width: "100%",
  zIndex: 100,
  backgroundColor: "#fff",
}));
// ----------------------------------------------------------------------

export default function MessagesPage({ title }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChatUsers());
  }, []);

  return (
    <RootStyle>
      <Page title="Notifications">
        <Container>
          {" "}
          <Header
            style={{
              boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
              borderRadius: "0px 0px 8px 8px",
              overflow: "hidden",
            }}
          >
            <BoxHeader
              px={2}
              py={2}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box display={"flex"} alignItems={"center"}>
                {" "}
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ color: "text.primary" }}
                >
                  <ArrowLeft />
                </IconButton>
                <Typography variant="h6" color="text.primary">
                  {title}
                </Typography>{" "}
              </Box>{" "}
            </BoxHeader>
          </Header>{" "}
          <Content flex>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
              height={"100%"}
            >
              <Typography style={{ fontSize: 80 }}>🚧</Typography>

              <Typography align="center">
                Feature is under development we will <br />
                notify you up on release
              </Typography>
            </Box>
          </Content>
        </Container>{" "}
      </Page>
    </RootStyle>
  );
}
