// @mui
import { styled } from "@mui/material/styles";
import { useState } from "react";
// components
import Page from "../../components/Page";
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
  TextField,
} from "@mui/material";

import Container from "../../components/Layout/Container";
import Content from "../../components/Layout/Content";
import Header from "../../components/Layout/Header";
import { useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import Iconify from "../../components/Iconify";
import FooterBase from "../../components/Layout/Footer";
import MessagesWindow from "src/components/messages/messagesWindow";
import SendProgramDrawer from "src/components/messages/sendProgramDrawer";
import MessagesFooter from "src/components/messages/messagesFooter";
import React, { Component, useRef } from "react";
import { fetchUser } from "src/redux/actions/common";
import { getChats } from "src/redux/actions/chat";
import { connect } from "react-redux";
import { withNavigation } from "src/HOC/Navigation";

const RootStyle = styled("div")(() => ({
  backgroundColor: "#fff",
  height: "100%",
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
const TabContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "center",
}));

// ----------------------------------------------------------------------

// export default function ChatWindowPage() {

//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([
//     {
//       mode: "incoming",
//       type: "audio",
//       content: {
//         url: "/images/audio1.mp3",
//       },
//     },
//     {
//       mode: "incoming",
//       type: "text",
//       content: {
//         text: "I completely understand your conditions & I am trying to customize a good workout plan for you.",
//       },
//     },
//     {
//       mode: "outgoing",
//       type: "text",
//       content: {
//         text: "I completely understand your conditions & I am trying to customize a good workout plan for you.",
//       },
//     },
//     {
//       mode: "incoming",
//       type: "program",
//       content: {
//         text: "12 Weeks Workout Plan",
//         imageUrl: "/images/instructor/programOverview.jpg",
//         price: 132,
//       },
//     },
//     {
//       mode: "incoming",
//       type: "text",
//       isReplyToMessage: { text: "Some" },
//       content: {
//         text: "hello hello",
//       },
//     },
//   ]);

//   const handleSendProgram = (programData) => {
//     let allMessages = [...messages];
//     allMessages.push({
//       mode: "outgoing",
//       type: "program",
//       content: {
//         text: "12 Weeks Workout Plan",
//         imageUrl: "/images/instructor/programOverview.jpg",
//         price: 132,
//       },
//     });
//     setMessages(allMessages);
//   };

//   const [replyToMessage, setReplyToMessage] = useState(null);

//   const handleSendText = (inputText, isReplyToMessage) => {
//     console.log(isReplyToMessage);
//     let allMessages = [...messages];
//     allMessages.push({
//       mode: "outgoing",
//       type: "text",
//       isReplyToMessage: isReplyToMessage,
//       content: {
//         text: inputText,
//       },
//     });
//     setMessages(allMessages);
//   };

//   return (
//     <RootStyle>
//       <Page title=" An easy-to-use tool to build and manage your client’s fitness programs">
//         <Container>
//           {" "}
//           <Header noColor>
//             <BoxHeader px={2} py={2}>
//               <Box
//                 width={"100%"}
//                 display={"flex"}
//                 alignItems={"center"}
//                 justifyContent={"space-between"}
//               >
//                 <Box display={"flex"} alignItems={"center"}>
//                   {" "}
//                   <IconButton onClick={() => navigate(-1)}>
//                     <Iconify
//                       icon={"ic:round-keyboard-arrow-left"}
//                       style={{
//                         border: "1.5px solid #6D7B8F",
//                         borderRadius: "24px",
//                       }}
//                       width={20}
//                       height={20}
//                       color="text.secondary"
//                     />
//                   </IconButton>
//                   <Avatar src="/images/dummyUser.png" />
//                   <Stack sx={{ ml: 1 }}>
//                     <Typography variant="subtitle1" color="text.primary">
//                       Shamlan
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{ lineHeight: 1 }}
//                     >
//                       ... is typing
//                     </Typography>
//                   </Stack>
//                 </Box>
//                 <IconButton>
//                   <Iconify
//                     icon="mdi-light:dots-vertical"
//                     width="24px"
//                     height="24px"
//                     color="text.secondary"
//                   />
//                 </IconButton>
//               </Box>
//             </BoxHeader>
//           </Header>
//           <Content
//             style={{ paddingTop: 12, paddingBottom: 24, overflowY: "auto" }}
//           >
//             <MessagesWindow
//               chatMessages={messages}
//               isClientSide={isClientSide}
//               handleReplyToMessage={(d, index) =>
//                 setReplyToMessage({
//                   text: d.text,
//                 })
//               }
//             />
//           </Content>
//           <FooterBase>
//             <MessagesFooter
//               isClientSide={isClientSide}
//               handleSendProgram={handleSendProgram}
//               replyToMessage={replyToMessage}
//               handleCancelReply={() => setReplyToMessage(null)}
//               handleSendText={handleSendText}
//             />
//           </FooterBase>
//         </Container>{" "}
//       </Page>
//     </RootStyle>
//   );
// }

class ChatWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      value: "",
      hasMore: true,
      recorder: null,
      recordTime: 0,
      record: false,
      UploadFile: null,
      imageUrl: null,
      Images: [],
    };
    this.scrollRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount = () => {
    console.log(this.props);
    if (!this.props.Chat.chatUsers[this.props.params.id]) {
      fetchUser(this.props.params.id).then((result) => {
        this.props.setUserChatDetails(result);
        this.props.getChats(this.props.params.id).then(
          (res) => {
            if (res.length < 50) {
              this.setState({ hasMore: false });
            }

            // setTimeout(() => {
            //   this.props.Chat.scrollRef &&
            //     this.props.Chat.scrollRef.current &&
            //     (this.props.Chat.scrollRef.current.scrollTop =
            //       this.props.Chat.scrollRef.current.scrollHeight + 500);
            // }, 200);
          },
          (err) => {
            if (err == 404) this.setState({ hasMore: false });
          }
        );
      });
    } else {
      this.props.getChats(this.props.params.id).then(
        (res) => {
          if (res.length < 50) {
            this.setState({ hasMore: false });
          }

          // setTimeout(() => {
          //   this.props.Chat.scrollRef &&
          //     this.props.Chat.scrollRef.current &&
          //     (this.props.Chat.scrollRef.current.scrollTop =
          //       this.props.Chat.scrollRef.current.scrollHeight + 500);
          // }, 200);
        },
        (err) => {
          if (err == 404) this.setState({ hasMore: false });
        }
      );
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props?.Chat.chatUsers[this.props.params.id].messages.length !==
      this.prevProps?.Chat.chatUsers[this.props.params.id].messages.length
    ) {
      this.scrollRef.current.scrollTo(100, this.scrollRef.current.scrollHeight);
    }
  }

  // onClick = () => {
  //   this.setState({ value: "", drawer: false, Images: [], UploadFile: null });

  //   if (this.state.Images.length > 0) {
  //     return this.props.AddChatData(
  //       {
  //         Message: this.state.value,
  //         uploadType: "image",
  //         Images: this.state.Images,
  //         UploadFile: null,
  //       },
  //       this.props.id
  //     );
  //   }

  //   if (this.state.uploadType == "audio") {
  //     this.state.recorder
  //       .stop()
  //       .getMp3()
  //       .then(([buffer, blob]) => {
  //         // do what ever you want with buffer and blob
  //         // Example: Create a mp3 file and play
  //         const file = new File(buffer, "me-at-thevoice.mp3", {
  //           type: blob.type,
  //           lastModified: Date.now(),
  //         });

  //         setTimeout(() => {
  //           this.props.createAttachment(
  //             {
  //               Message: this.state.value,
  //               UploadFile: blob,
  //               IsUploading: false,
  //               uploadType: this.state.uploadType,
  //             },
  //             this.props.id
  //           );
  //         }, 200);

  //         setTimeout(() => {
  //           this.props.Chat.scrollRef &&
  //             (this.props.Chat.scrollRef.current.scrollTop =
  //               this.props.Chat.scrollRef.current.scrollHeight + 500);
  //         }, 200);
  //       });

  //     return true;
  //   }

  //   if (this.state.UploadFile && this.state.uploadType !== "audio") {
  //     this.props.createAttachment(
  //       {
  //         Message: this.state.value,
  //         UploadFile: this.state.UploadFile,
  //         IsUploading: false,
  //         uploadType: this.state.uploadType,
  //       },
  //       this.props.id
  //     );
  //     this.setState({ UploadFile: null });
  //     setTimeout(() => {
  //       this.props.Chat.scrollRef &&
  //         (this.props.Chat.scrollRef.current.scrollTop =
  //           this.props.Chat.scrollRef.current.scrollHeight + 500);
  //     }, 200);
  //   } else if (this.state.value && !this.state.UploadFile) {
  //     this.props.createChat(this.state.value, this.props.id).then(
  //       (result) => {
  //         setTimeout(() => {
  //           this.props.Chat.scrollRef &&
  //             (this.props.Chat.scrollRef.current.scrollTop =
  //               this.props.Chat.scrollRef.current.scrollHeight + 500);
  //         }, 200);

  //         console.log(result);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   }
  // };

  // handleEnter = (e) => {
  //   // if(this.state.uploadType=="audio"){
  //   //   this.stopRecording()
  //   // }
  //   if (e.key === "Enter" || e.keyCode === 13) {
  //     setTimeout(() => {
  //       this.props.Chat.scrollRef &&
  //         this.props.Chat.scrollRef.current &&
  //         (this.props.Chat.scrollRef.current.scrollTop =
  //           this.props.Chat.scrollRef.current.scrollHeight + 500);
  //     }, 200);

  //     if (this.state.Images.length > 0) {
  //       return this.props.AddChatData(
  //         {
  //           Message: this.state.value,
  //           uploadType: "image",
  //           Images: this.state.Images,
  //           UploadFile: null,
  //         },
  //         this.props.id
  //       );
  //     }

  //     if (this.state.uploadType == "audio") {
  //       this.state.recorder
  //         .stop()
  //         .getMp3()
  //         .then(([buffer, blob]) => {
  //           console.log(blob);
  //           // do what ever you want with buffer and blob
  //           // Example: Create a mp3 file and play
  //           const file = new File(buffer, "me-at-thevoice.mp3", {
  //             type: blob.type,
  //             lastModified: Date.now(),
  //           });
  //           this.props.createAttachment(
  //             {
  //               Message: this.state.value,
  //               UploadFile: file,
  //               IsUploading: false,
  //               uploadType: this.state.uploadType,
  //             },
  //             this.props.id
  //           );
  //           this.setState({ uploadType: null, record: null });

  //           setTimeout(() => {
  //             this.props.Chat.scrollRef &&
  //               (this.props.Chat.scrollRef.current.scrollTop =
  //                 this.props.Chat.scrollRef.current.scrollHeight + 500);
  //           }, 200);
  //         });

  //       return true;
  //     }

  //     if (this.state.UploadFile) {
  //       this.props.createAttachment(
  //         {
  //           Message: this.state.value,
  //           UploadFile: this.state.UploadFile,
  //           IsUploading: false,
  //           uploadType: this.state.uploadType,
  //         },
  //         this.props.id
  //       );
  //       this.setState({ value: "", drawer: false, UploadFile: null });
  //       setTimeout(() => {
  //         this.props.Chat.scrollRef &&
  //           (this.props.Chat.scrollRef.current.scrollTop =
  //             this.props.Chat.scrollRef.current.scrollHeight + 500);
  //       }, 200);
  //     } else if (this.state.value) {
  //       this.props.createChat(this.state.value, this.props.id).then(
  //         (result) => {
  //           setTimeout(() => {
  //             this.props.Chat.scrollRef &&
  //               this.props.Chat.scrollRef.current &&
  //               (this.props.Chat.scrollRef.current.scrollTop =
  //                 this.props.Chat.scrollRef.current.scrollHeight + 500);
  //           }, 200);
  //           this.setState({ value: "", drawer: false });
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   }
  // };

  // startRecording = () => {
  //   this.setState({ record: false, uploadType: "audio" });

  //   const recorder = new MicRecorder({
  //     bitRate: 128,
  //   });
  //   this.setState({ recorder: recorder });

  //   recorder
  //     .start()
  //     .then(() => {
  //       this.setState({ record: true });
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

  // stopRecording = () => {
  //   this.state.recorder.stop();

  //   this.setState({ recorder: null, uploadType: null, record: false });
  // };

  loadmore = (page) => {
    this.props
      .getChats(this.props.id)
      .then((chats) => {
        return chats;
      })
      .then(
        (res) => {},
        (err) => {
          if (err == 404) this.setState({ hasMore: false });
        }
      );
  };

  // handleClickFile = (event) => {
  //   const { target = {} } = event || {};
  //   target.value = "";
  // };

  // handleAddAttach = (type) => {
  //   this.setState({ uploadType: type }, () => {
  //     this.inputRef.current.click();
  //   });
  // };

  render() {
    return (
      <RootStyle>
        <Page title=" An easy-to-use tool to build and manage your client’s fitness programs">
          <Container>
            {" "}
            <Header noColor>
              <BoxHeader px={2} py={2}>
                <Box
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    {" "}
                    <IconButton onClick={() => this.props.navigate(-1)}>
                      <Iconify
                        icon={"ic:round-keyboard-arrow-left"}
                        style={{
                          border: "1.5px solid #6D7B8F",
                          borderRadius: "24px",
                        }}
                        width={20}
                        height={20}
                        color="text.secondary"
                      />
                    </IconButton>
                    <Avatar
                      src={
                        this.props.Chat.chatUsers?.[this.props.params.id]
                          .details.profilePic
                      }
                    />
                    <Stack sx={{ ml: 1 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        {
                          this.props.Chat.chatUsers?.[this.props.params.id]
                            .details.name
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1 }}
                      >
                        ... is typing
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton>
                    <Iconify
                      icon="mdi-light:dots-vertical"
                      width="24px"
                      height="24px"
                      color="text.secondary"
                    />
                  </IconButton>
                </Box>
              </BoxHeader>
            </Header>
            {/* <Content flex ref={this.scrollRef}>
              <MessagesWindow
                chatMessages={
                  this.props.Chat.chatUsers[this.props.params.id].messages
                }
                Profile={this.props.Profile}
                hasMore={this.state.hasMore}
                loadmore={this.loadmore}
             
              />
            </Content> */}
            <FooterBase>
              <MessagesFooter

              // handleSendProgram={handleSendProgram}
              // replyToMessage={replyToMessage}
              // handleCancelReply={() => setReplyToMessage(null)}
              // handleSendText={handleSendText}
              />
            </FooterBase>
          </Container>{" "}
        </Page>
      </RootStyle>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    Chat: state.Chat,
    Profile: state.Profile,
  };
};

export default connect(mapStatetoProps, { fetchUser, getChats })(
  withNavigation(ChatWindow)
);
