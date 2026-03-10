import { m } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Box,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
  ButtonBase,
} from "@mui/material";
// routes
import { PATH_AUTH, PATH_DASHBOARD } from "../../routes/paths";
// components
import Image from "../../components/Image";
import Iconify from "../../components/Iconify";
import TextIconLabel from "../../components/TextIconLabel";
import { MotionContainer, varFade } from "../../components/animate";
import Backsvg from "src/assets/onboarding/Hero2";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";
import axios from "../../utils/axios";
import api from "../../utils/api";
import { updateFeedback } from "../../redux/actions/feedback";
import { useDispatch } from "react-redux";
import { updateOnboarding } from "../../redux/actions/Onboarding";
import { useConfirmationModalContext } from "../../utils/Modal";
import Logo from "../../assets/figgslogo.png";
// ----------------------------------------------------------------------
import { useLocation } from "react-router";
const RootStyle = styled(m.div)(({ theme }) => ({
  width: "100%",

  display: "flex",
  alignItems: "center",
}));

const ContentStyle = styled((props) => <Stack spacing={2} {...props} />)(
  ({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "space-around",
    justifyContent: "space-around",
    maxWidth: 520,
    margin: "auto",
    textAlign: "center",

    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  })
);

const UnderlinedText = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginRight: 1,
  "&:after": {
    content: "''",
    position: "absolute",
    bottom: "-5px",
    left: 0,
    height: "7px",
    width: "100%",
    border: "solid 2px #cb1829",
    borderColor: "#cb1829 transparent transparent transparent",
    borderTopColor: theme.palette.primary.main,
    borderRadius: "50%",
  },
}));

const SocialButton = styled(ButtonBase)(({ theme }) => ({
  height: 45,

  borderRadius: 40,
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

// ----------------------------------------------------------------------

export default function HomeHero() {
  const dispatch = useDispatch();
  const modalContext = useConfirmationModalContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const responseGoogle = (res) => {
    dispatch(
      updateFeedback({
        loading: true,
      })
    );
    axios
      .get(
        `${api.protocol}${api.baseUrl}${api.checkUserExistence}email=${res?.profileObj.email}`
      )
      .then((response) => {
        dispatch(
          updateFeedback({
            loading: false,
          })
        );
        if (response.data.authType.includes("gmail")) {
          dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: "User already exists",
              severity: "error",
            })
          );
        } else {
          modalContext
            .showConfirmationModal(
              "Alert!",
              "This email is already registered with other auth provide , would you like to link gmail with this account?",
              "Yes",
              "No"
            )
            .then((result) => {
              if (result) {
                dispatch(
                  updateFeedback({
                    loading: true,
                  })
                );
                axios
                  .patch(`${api.protocol}${api.baseUrl}${api.updateAuth}`, {
                    email: response.data.email,
                    authType: "gmail",
                  })
                  .then((response) => {
                    updateFeedback({
                      loading: false,
                      snackbar: true,
                      message: "Account linked with gmail , login to continue",
                      severity: "success",
                    });
                  });
              } else {
              }
            });
        }
      })
      .catch((error) => {
        dispatch(
          updateFeedback({
            loading: false,
          })
        );
        if (error.response.status === 404) {
          dispatch(
            updateOnboarding({
              name: res?.profileObj.name,
              email: res?.profileObj.email,
              profilePic: res?.profileObj.imageUrl,
              token: res.tokenId,
              type: "gmail",
            })
          );
          navigate(`/onboarding/info`);
        }
      });
  };

  return (
    <MotionContainer>
      <RootStyle>
        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Box
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Image src={Logo} />
              </Box>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography variant="h2" color="grey.700">
                Your{" "}
                <UnderlinedText
                  variant="h2"
                  component={"span"}
                  color="primary.main"
                >
                  online
                </UnderlinedText>
                &nbsp;fitness
                <br />
                training tool and platform
              </Typography>
              <Box sx={{ py: 1.5, pl: 2, pr: 2 }}>
                <Typography variant="body" color="grey.700">
                  A fitness training platform made for both instructor and their
                  clients.
                </Typography>
              </Box>
            </m.div>

            <m.div variants={varFade().inRight} px={2}>
              <Box px={2}>
                <Backsvg />
              </Box>
              {/* <Image  src={Backsvg} /> */}
            </m.div>
            {/* <m.div variants={varFade().inRight}>
       <Typography variant="h3">Create new account as  </Typography>
            </m.div> */}
            <m.div variants={varFade().inRight}>
              <Stack spacing={1}>
                {" "}
                {/* <Button fullWidth color={"secondary"} variant="contained"  onClick={() => navigate("/onboarding/client",{state})}>
                  Athlete
                </Button> */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/Login", { state })}
                >
                  Login
                </Button>
                <Divider>
                  <Typography color={"text.secondary"} sx={{ px: 1 }}>
                    OR
                  </Typography>
                </Divider>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/sign-up-options", { state })}
                >
                  Create account
                </Button>
              </Stack>
              {/* <Stack spacing={2.5} sx={{ my: 3 }}>
                <m.div variants={varFade().inRight}>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Already have an account?&nbsp;
                   
                    <Link
                      variant="subtitle2"
                      to={"/Login"}
                      state={state}
                      component={RouterLink}
                    >
                      Login
                    </Link>
                  </Typography>
                </m.div>
              </Stack> */}
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
    </MotionContainer>
  );
}
