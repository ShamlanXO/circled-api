import React, { useState, useEffect } from "react";
import Container from "components/Layout/Container";
import animationData from "assets/lottie/lf30_editor_iaocbu1z.json";
import Lottie from "react-lottie";
import Dialog from "@material-ui/core/Dialog";
import { connect } from "react-redux";
import { updateFeedback } from "store/actions/feedback";
import Content from "components/Layout/Content";
import Button from "components/CustomButtons/Button";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import ArrowRight from "assets/svg/ArrowRight";
import InsAthlete from "components/Card/InsAthlete";
import "react-phone-input-2/lib/style.css";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px 30px 0px 30px",
  },
  title: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    marginBlockStart: 0,
    marginBottom: 5,
    paddingTop: 10,
    color: "#172A44",
    paddingLeft: 32,
  },
  mainDiv: {
    paddingLeft: 32,
    paddingRight: 32,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    fontFamily: "Proxima Nova",
  },
  child1: {
    display: "flex",
    paddingBottom: "10px",
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  child2: {
    flex: 2,
    paddingTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },

  Footer: {
    margin: "0px 20px 20px 20px",
  },
  list: {
    width: "100%",
  },
  primary: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: "18px",
  },
  secondary: {
    fontFamily: "Proxima Nova",
    marginTop: 18,
    color: "#172A44",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "24px",

    /* or 129% */
  },
  titleContainer: {
    width: "95%",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

function Success(props) {
  const classes = useStyles();
  const [open, close] = useState(false);

  const { sAnimate, message } = props.Feedback;

  useEffect(() => {
    sAnimate &&
      setTimeout(() => {
        props.updateFeedback({ sAnimate: false });
      }, 4000);
  }, [sAnimate]);
  return (
    <Dialog fullScreen open={sAnimate}>
      <Container>
        <Content flex>
          <div className={classes.mainDiv}>
            <div style={{ height: "100vh", width: "100%" }}>
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
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
                  <Box sx={{ color: "primary.main", fontSize: 10, py: 0.3 }}>
                    Beta
                  </Box>
                </Box>
              </Box>
              {/* <InsAthlete
                selected
                Title={message}
                Icon={(cls) => (
                  <Lottie
                    options={{
                      loop: false,
                      autoplay: true,
                      animationData: animationData,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                    height={150}
                    width={150}
                  />
                )}
              /> */}
            </div>
          </div>
          {/* <div style={{ padding: 32 }}>
            <Button
              onClick={() => props.updateFeedback({ sAnimate: false })}
              variant="contained"
              fullWidth
              size="lg"
              bold
              startIcon={<span style={{ marginLeft: 10 }}></span>}
              sideIcons
              endIcon={<ArrowRight />}
            >
              Done
            </Button>
          </div> */}
        </Content>
      </Container>
    </Dialog>
  );
}
const mapStateToProps = (state) => {
  return {
    Feedback: state.Feedback,
  };
};

export default connect(mapStateToProps, { updateFeedback })(Success);
