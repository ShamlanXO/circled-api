// @mui
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
// components
import Page from "../../components/Page";
import moment from "moment";
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
  Tabs,
  Tab,
  Badge,
  TextField,
  ListItem,
  BottomNavigation,
  ListItemButton,
} from "@mui/material";

import Container from "../../components/Layout/Container";
import Content from "../../components/Layout/Content";
import Header from "../../components/Layout/Header";
import { useNavigate, useLocation } from "react-router";
import Iconify from "../../components/Iconify";

import FooterBase from "../../components/Layout/Footer";
import { TabContext, TabPanel } from "@mui/lab";
import InstructorHeader from "src/components/home/HomeHeader";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { getChatUsers } from "src/redux/actions/chat";
import { useDispatch, useSelector } from "react-redux";
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
const UnreadCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isClientSide",
})(({ isClientSide, theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "24px",
  color: "#fff",
  display: "flex",
  width: "24px",
  height: "24px",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 14,
}));
const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  " &.Mui-selected": {
    fontWeight: 600,
  },
});
const TabContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "center",
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  zIndex: 100,
  backgroundColor: "#fff",
}));
// ----------------------------------------------------------------------

export default function MessagesPage() {
  const [isClientSide, setIsClientSide] = useState(true);
  const [allNotification, setAllNotification] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
  ]);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState("messages");
  const [current, setCurrent] = useState(0);
  const handleTabChange = (event, newValue) => {
    setCurrent(newValue);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChatUsers());
  }, []);
  const Profile = useSelector((s) => s.Profile);

  const allRecentChatsUsers = useSelector(
    (state) => state.Chat.recentChatUsers
  );

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
                  Messages
                </Typography>{" "}
              </Box>{" "}
              {/* <IconButton>
                <Iconify
                  width={28}
                  height={28}
                  icon={"bx:message-rounded-add"}
                  color="text.primary"
                />
              </IconButton> */}
            </BoxHeader>

            {/* <Box sx={{ px: 2 }}>
              <TextField
                fullWidth
                placeholder={isClientSide ? "Search" : "Search"}
                InputProps={{
                  style: {
                    height: 48,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Iconify
                          icon={"eva:search-fill"}
                          width={24}
                          height={24}
                          color="text.secondary"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, height: 48 }}
              />
              {!isClientSide && (
                <TabContext value={current}>
                  <TabContainer>
                    <Tabs
                      variant="fullWidth"
                      value={current}
                      onChange={handleTabChange}
                      aria-label=""
                      sx={{
                        p: 0.4,
                        backgroundColor: (theme) =>
                          theme.palette.background.default,
                      }}
                    >
                      <Tab
                        label={"Clients"}
                        sx={{
                          minWidth: "142px",
                          px: 1,
                          "&.Mui-selected": {
                            color: (theme) => theme.palette.primary.main,
                            backgroundColor: "#fff",
                            boxShadow: "0px 1px 7px #E1E7F0",
                            border: "1px solid #E1E7F0",
                          },
                        }}
                      />
                      <Tab
                        label={"Non-clients"}
                        sx={{
                          minWidth: "140px",
                          px: 1,
                          "&.Mui-selected": {
                            color: (theme) => theme.palette.primary.main,
                            backgroundColor: "#fff",
                            boxShadow: "0px 1px 7px #E1E7F0",
                            border: "1px solid #E1E7F0",
                          },
                        }}
                      />
                    </Tabs>
                  </TabContainer>
                </TabContext>
              )}
            </Box> */}
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
          {/* <Content
            style={{
              paddingTop: isClientSide ? 0 : 16,
              paddingBottom: 48,
              overflowY: "auto",
              position: "relative",
            }}
          >
            <TabContext value={current}>
              <TabPanel value={0} index={0}>
                {allRecentChatsUsers.map((item, index) => (
                  <ListItemButton
                    divider
                    disableGutters
                    alignItems="flex-start"
                    onClick={() => navigate(`chatWindow/${item._id}`)}
                  >
                    <Avatar src={item?.profilePic} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                      <Typography variant="subtitle2" color="text.primary">
                        {item.name || "Unamed"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.Message || "I need a link to the program"}
                      </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Stack alignItems={"end"}>
                      <Typography
                        align="right"
                        variant="caption"
                        color="text.secondary"
                      >
                        {moment(item.createdAt).format("LT")}
                      </Typography>

                      {item.unread == 0 ? (
                        <Iconify
                          icon="akar-icons:double-check"
                          color={"primary.main"}
                          width="20px"
                          height="20px"
                          style={{ marginTop: "5px" }}
                        />
                      ) : (
                        <UnreadCircle>{item.unread}</UnreadCircle>
                      )}
                    </Stack>
                  </ListItemButton>
                ))}
              </TabPanel>
              <TabPanel value={1} index={1}>
                {allNotification.map((item, index) => (
                  <ListItemButton
                    divider
                    disableGutters
                    alignItems="flex-start"
                    onClick={() => navigate(`chatWindow/${item._id}`)}
                  >
                    <Avatar src={"/images/dummyUser.png"} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                      <Typography variant="subtitle2" color="text.primary">
                        Anita Akhtari
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        I need a link to the program
                      </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Stack alignItems={"end"}>
                      <Typography
                        align="right"
                        variant="caption"
                        color="text.secondary"
                      >
                        13:08
                      </Typography>

                      {item.count == 0 ? (
                        <Iconify
                          icon="akar-icons:double-check"
                          color={"primary.main"}
                          width="20px"
                          height="20px"
                          style={{ marginTop: "5px" }}
                        />
                      ) : (
                        <UnreadCircle>{item.count}</UnreadCircle>
                      )}
                    </Stack>
                  </ListItemButton>
                ))}
              </TabPanel>
            </TabContext>
            <Box position="fixed" bottom={32} right={16}></Box>
          </Content> */}
        </Container>{" "}
      </Page>
    </RootStyle>
  );
}
