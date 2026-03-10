// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../../Page";
// sections
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  ListItemButton,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { IconButtonAnimate, varFade } from "../../animate";
import Iconify from "../../Iconify";
import { format } from "date-fns";
import { useNavigate } from "react-router";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 22px 22px 18px",

  borderRadius: 4,
  cursor: "pointer",
  ":hover": {
    boxShadow: "0px 4px 54px rgba(225, 231, 240, 1)",
  },
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  //zIndex: 100,
  backgroundColor: "#fff",
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
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

export default function ClientList(props) {
  const { page } = props;
  const navigate = useNavigate();
  const clients = [{}, {}, {}, {}, {}];
  const SpaceBox = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "12px 0",
    padding: "5px",
  }));
  return (
    <Box backgroundColor={"#fff"} height={"100%"}>
      {props.clients.length == 0 && (
        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          height="100%"
        >
          <img src="/images/instructor/instructorNoClients.png" />

          <Typography
            mt={2}
            variant="body1"
            align="center"
            color="text.secondary"
          >
            No client are on this program click
            <br /> on{" "}
            <Typography
              onClick={() => navigate("/sendProgram/" + props._id)}
              color={"primary.main"}
              component={"span"}
              sx={{ textDecoration: "underline" }}
            >
              send program
            </Typography>
            &nbsp; to get clients
          </Typography>
        </Box>
      )}

      <Box pt={1.5}>
        {props.clients.map((item, index) => (
          <Box onClick={() => navigate("/clientProfile/" + item._id)}>
            <Box mb={2} px={2}>
              {/* <Typography variant="h6" color="text.primary">
                {// TODO: Replace moment.calendar()
format(new Date(dateMsg), "PPP")}
              </Typography> */}

              <Box>
                {/* <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        spacing={1}
                      >
                        <Stack>
                          <Typography variant="body" color="text.primary">
                            Program Sent to
                          </Typography>

                          {item?.clientId?.name ? (
                            <Stack direction="row" alignItems="center" mt={1}>
                              <Avatar
                                size={"small"}
                                sx={{ width: 32, height: 32 }}
                                src={item?.clientId?.profilePic}
                              />
                              <Stack>
                                <Typography
                                  variant="body"
                                  color="primary"
                                  sx={{
                                    ml: 1,
                                    textTransform: "capitalize",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.clientId?.name}
                                </Typography>
                              </Stack>
                            </Stack>
                          ) : (
                            <Typography variant="body" color="primary">
                              {item.email}
                            </Typography>
                          )}
                        </Stack>
                        <Typography variant="body2" color={"text.secondary"}>
                          {format(new Date(item.createdAt), "hh:mm a")}
                        </Typography>
                      </Stack>
                      {index !== group[dateMsg]?.length - 1 ? (
                        <Divider sx={{ mt: 2 }} />
                      ) : null} */}

                <SpaceBox sx={{ alignItems: "center" }}>
                  <Avatar
                    src={
                      item?.profilePic ||
                      item?.UserId?.profilePic ||
                      "/images/dummyUser.png"
                    }
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Box>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    >
                      {item.name || item?.UserId?.name || "Unamed"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`Registered on ${format(new Date(item.createdAt), "dd MMM yyyy")}`}
                    </Typography>
                  </Box>
                  <Box flexGrow={1} />
                  <IconButton>
                    <Iconify
                      icon={"ic:round-keyboard-arrow-right"}
                      style={{
                        border: "1.5px solid #6D7B8F",
                        borderRadius: "24px",
                      }}
                      width={20}
                      height={20}
                      color="text.secondary"
                    />
                  </IconButton>
                </SpaceBox>
                <Divider />
              </Box>
            </Box>
            {/* {ri + 1 != Object.keys(group).length && (
              <Divider sx={{ borderBottomWidth: 8, borderColor: "#F5F7FA" }} />
            )} */}
          </Box>
        ))}
      </Box>
    </Box>
  );
  return (
    <BoxHeader pt={1}>
      {props.clients.length == 0 && (
        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          height="100%"
        >
          <img src="/images/instructor/instructorNoClients.png" />

          <Typography
            mt={2}
            variant="body1"
            align="center"
            color="text.secondary"
          >
            No client are on this program click
            <br /> on{" "}
            <Typography
              onClick={() => navigate("/sendProgram/" + props._id)}
              color={"primary.main"}
              component={"span"}
              sx={{ textDecoration: "underline" }}
            >
              send program
            </Typography>
            &nbsp; to get clients
          </Typography>

          {/* <Button
            
            size={"small"}
            sx={{ fontSize: 16 }}
          >
            Send program
          </Button> */}
        </Box>
      )}
      {props.clients.map((item, index) => (
        <>
          <BoxStyle onClick={() => navigate("/clientProfile/" + item._id)}>
            <Box display="flex" alignItems={"center"}>
              <Avatar
                style={{
                  backgroundColor: "#fff",
                }}
                src={
                  item?.profilePic ||
                  item?.UserId?.profilePic ||
                  "/images/dummyUser.png"
                }
              />

              <Box marginLeft={2}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                >
                  {item.name || item?.UserId?.name || "Unamed"}
                </Typography>{" "}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  flexWrap={"wrap"}
                >
                  {page == "programOverview" ? (
                    `Registered on ${format(new Date(item.createdAt), "dd MMM yyyy")}`
                  ) : (
                    <>
                      {item.program}{" "}
                      {index == 0 && (
                        <Typography
                          component={"span"}
                          variant="body1"
                          color="text.primary"
                          flexWrap={"wrap"}
                        ></Typography>
                      )}
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
            {page == "programOverview" && (
              <IconButton>
                <Iconify
                  icon={"ic:round-keyboard-arrow-right"}
                  style={{
                    border: "1.5px solid #6D7B8F",
                    borderRadius: "24px",
                  }}
                  width={20}
                  height={20}
                  color="text.secondary"
                />
              </IconButton>
            )}
          </BoxStyle>
          <Divider width={"100%"} />
        </>
      ))}
    </BoxHeader>
  );
}
