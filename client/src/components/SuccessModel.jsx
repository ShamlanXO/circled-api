import React, { useState, useEffect } from "react";
import Container from "./Layout/Container";
import animationData from "src/assets/lottie/lf30_editor_iaocbu1z.json";
import animationData2 from "src/assets/lottie/LfVm8mOifF.json";
import Lottie from "lottie-react";
import { Dialog } from "@mui/material";
import { connect } from "react-redux";
import { updateFeedback } from "src/redux/actions/feedback";
import Content from "./Layout/Content";
import { Button, Box, Typography, Stack } from "@mui/material";
import Logo from "src/assets/circle.png";
function Success(props) {
  const [open, close] = useState(false);

  const { sAnimate, message, profileType,description } = props.Feedback;
  const { type } = props.Profile;
  useEffect(() => {
    sAnimate &&
      setTimeout(() => {
        props.updateFeedback({ sAnimate: false });
      }, 3000);
  }, [sAnimate]);
  return (
    <Dialog fullScreen open={sAnimate} sx={{ margin: 0 }}>
      <Box
        flexDirection={"row"}
        flexGrow={1}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack justifyContent={"center"} alignItems={"center"} spacing={2}>
          <Box width={"70vw"}>
            {profileType && (
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <img src={Logo} height={46}  />
              </Box>
            )}
            {profileType && (
              <Box width={"center"} mt={2}>
                <Typography variant="h5" align="center">
                  Switching to{" "}
                  <Typography
                    variant="h5"
                    component={"span"}
                    color={"primary"}
                   
                  >
                    {profileType.toLowerCase() == "instructor"
                      ? "Trainer"
                      : "Athlete"}{" "}
                    Mode
                  </Typography>
                </Typography>
              </Box>
            )}
            {!profileType && (
              <Lottie
                animationData={
                  animationData
                }
                loop={false}
                height={120}
                width={120}
              />
            )}
          </Box>
          <center>
            <Typography align="center" sx={{ maxWidth: "80vw" }} variant={"h2"} gutterBottom>
              {message}
            </Typography>
            <Typography align="center" sx={{ maxWidth: "80vw" }} variant={"body"}>
           {description}
                </Typography>
          </center>
          {/* <Button
              onClick={() => props.updateFeedback({ sAnimate: false })}
              variant="contained"
              fullWidth
              size="lg"
             
              
            >
              Done
            </Button> */}
        </Stack>
      </Box>
    </Dialog>
  );
}
const mapStateToProps = (state) => {
  return {
    Feedback: state.Feedback,
    Profile: state.Profile,
  };
};

export default connect(mapStateToProps, { updateFeedback })(Success);
