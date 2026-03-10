// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  IconButton,
  Button,
  InputAdornment,
  TextField,
  Stack,
  Switch,
  Typography,
  ButtonBase,
} from "@mui/material";
import { useState, useEffect } from "react";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import Label from "../Label";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router";
import SwitchCustom from "../SwitchCustom";
import SendProgramDrawer from "./sendProgramDrawer";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  width: "100%",
  boxShadow: "0px 4px 54px #E1E7F0",
  borderRadius: "24px 24px 0px 0px",
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  //zIndex: 100,
  backgroundColor: "#fff",
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "0px 0px 8px 8px",
}));

const ReplyMessageStyle = styled(Box)(() => ({
  borderRadius: "12px 24px 0px 0px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  padding: "0 15px 0 10px",
  alignItems: "center",
  backgroundColor: "#E1E7F0",
}));
const AudioBox = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  backgroundColor: theme.palette.background.default,
  display: "flex",
  width: "100%",
  padding: "8px 8px 8px 16px",
  justifyContent: "space-between",
  alignItems: "center",
}));

// ----------------------------------------------------------------------

export default function MessagesFooter(props) {
  const navigate = useNavigate();
  const {
    isClientSide,
    handleSendProgram,
    replyToMessage,
    handleCancelReply,
    handleSendText,
  } = props;
  const [addSpecial, setAddSpecial] = useState(false);

  const [inputText, setInputText] = useState("");
  const [recordAudio, setRecordAudio] = useState(false);
  return (
    <BoxStyle>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems="end"
        width={"100%"}
        px={3}
        py={2}
      >
        <Box sx={{ mr: 1 }}>
          {!addSpecial && !recordAudio ? (
            <IconButton
              color="primary"
              variant="contained"
              onClick={() => setAddSpecial(true)}
              sx={{
                height: 48,
                width: 48,
                backgroundColor: (theme) =>
                  theme.palette[isClientSide ? "secondary" : "primary"].main,
                ":hover": {
                  backgroundColor: (theme) =>
                    theme.palette[isClientSide ? "secondary" : "primary"].main,
                },
              }}
            >
              <Iconify
                icon={"fluent:add-24-filled"}
                color="common.white"
                width={24}
                height={24}
              />
            </IconButton>
          ) : (
            <>
              {recordAudio ? (
                <IconButton onClick={() => setRecordAudio(false)}>
                  <Iconify
                    icon={"wpf:delete"}
                    color="error.main"
                    width={24}
                    height={24}
                  />
                </IconButton>
              ) : (
                <IconButton
                  variant="contained"
                  onClick={() => setAddSpecial(false)}
                  sx={{
                    height: 48,
                    width: 48,
                    backgroundColor: "#E1E7F0",
                    ":hover": {
                      backgroundColor: "#E1E7F0",
                    },
                  }}
                >
                  <Iconify
                    icon={"eva:close-fill"}
                    color="text.secondary"
                    width={24}
                    height={24}
                  />
                </IconButton>
              )}
            </>
          )}
        </Box>
        <Box width="100%" position="relative">
          {" "}
          {replyToMessage && (
            <ReplyMessageStyle>
              <Box display={"flex"} alignItems="center">
                <Iconify icon="tabler:arrow-back-up" color="text.secondary" />
                &nbsp;&nbsp;
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  width="180px"
                >
                  Replying to {replyToMessage.text}
                </Typography>
              </Box>
              <ButtonBase onClick={() => handleCancelReply()}>
                <Iconify icon="eva:close-fill" color="text.secondary" />
              </ButtonBase>
            </ReplyMessageStyle>
          )}
          {addSpecial ? (
            <Box display="flex" width="100%">
              {!isClientSide && (
                <SendProgramDrawer
                  sendProgram={(data) => {
                    handleSendProgram(data);
                    setInputText("");
                  }}
                >
                  <Button variant="contained" color="primary" sx={{ px: 2 }}>
                    <Iconify
                      icon="ic:round-ballot"
                      width="24px"
                      height="24px"
                      color="common.white"
                    />
                    <Typography variant="subtitle2" color="common.white">
                      Send program
                    </Typography>
                  </Button>
                </SendProgramDrawer>
              )}
              &nbsp;&nbsp;
              <Button
                variant="contained"
                fullWidth={isClientSide}
                color={isClientSide ? "secondary" : "primary"}
                sx={{ px: 2 }}
              >
                <Iconify
                  icon="bxs:image-alt"
                  width="24px"
                  height="24px"
                  color="common.white"
                />
                <Typography variant="subtitle2" color="common.white">
                  Media
                </Typography>
              </Button>
            </Box>
          ) : (
            <>
              {recordAudio ? (
                <AudioBox>
                  <Typography variant="body1" color="text.secondary">
                    00:06
                  </Typography>
                  <IconButton onClick={() => setRecordAudio(false)}>
                    <Iconify
                      icon={"fluent:send-24-filled"}
                      color="primary.main"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                </AudioBox>
              ) : (
                <TextField
                  fullWidth
                  placeholder="Your message"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendText(inputText, replyToMessage);
                      setInputText("");
                      handleCancelReply();
                    }
                  }}
                  InputProps={{
                    style: {
                      fontSize: 16,
                      height: 48,
                      borderRadius: replyToMessage ? "0 0 24px 24px" : 24,
                      paddingLeft: 10,
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setRecordAudio(true)}>
                          <Iconify
                            icon="fluent:mic-24-regular"
                            color="text.secondary"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </BoxStyle>
  );
}
