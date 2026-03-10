/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import {
  ListItemButton,
  Popover,
  Popper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Box,
  InputBase,
  ButtonBase,
  Divider,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Iconify from "../Iconify";
import MenuPopover from "../MenuPopover";

const RootStyle = styled(Box)(({ theme }) => ({
  padding: "0 16px 6px",
  border: "1px solid #E1E7F0",
}));
const ProfilePic = styled("div")(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "24px",
}));

const CustomButtton = styled(Button)(({ theme }) => ({
  // padding: '10px 20px',
  height: "44px",
  borderRadius: "4px",
  color: theme.palette.error.light,
  backgroundColor: theme.palette.error.lighter,
  margin: "10px 10px 0 0",
}));
const SpaceBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "12px 0",
}));

export default function UpdateWorkoutDay(props) {
  const [openedPopover, setOpenedPopover] = useState(false);
  const popoverAnchor = useRef(null);
  const { newCard } = props;
  const [exerciseName, setExerciseName] = useState("");
  const [media, setmedia] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState("");
  useEffect(() => {
    if (!newCard) {
      setExerciseName("Warmup");
      setExerciseDetails(
        `15 mins fixed bicycle\n10 mins jumprope\n2x20 torso twists (30sec rest between sessions)`
      );
      setmedia([{}, {}]);
    } else {
      setOpenedPopover(true);
    }
  }, [newCard]);

  //    const [topic, setTopic] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    //  props.selectTopic(topic);
    setOpenedPopover(false);
  };
  return (
    <>
      <ButtonBase
        size="small"
        variant="text"
        color="error"
        ref={popoverAnchor}
        onClick={() => setOpenedPopover(true)}
      >
        <Typography variant="body1" color="text.secondary">
          Edit
        </Typography>
        &nbsp;{" "}
        <Iconify
          icon={"eva:edit-outline"}
          color="text.secondary"
          width={24}
          height={24}
        />
      </ButtonBase>

      <MenuPopover
        open={openedPopover}
        // onClose={() => {
        //   setOpenedPopover(false);
        // }}
        anchorEl={popoverAnchor.current}
        sx={{
          width: "calc(100% - 68px)",
          mt: -7,
          ml: -0.5,
          boxShadow: "0px 24px 32px rgba(195, 203, 217, 0.5)",
          borderRadius: "16px",
        }}
  
      >
        <RootStyle>
          <Box>
            <SpaceBox>
              <InputBase
                placeholder="Exercise name"
                fullWidth
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
              {/* <Typography variant="subtitle1" color="text.primary">
                Warmup
              </Typography> */}
              &nbsp;
              <ButtonBase onClick={() => setOpenedPopover(false)}>
                <Typography variant="body1" color="primary">
                  Done
                </Typography>
                &nbsp;
                <Iconify icon="akar-icons:check" color="primary.main" />
              </ButtonBase>
            </SpaceBox>
            <Divider />
            <Box sx={{ mt: 1 }}>
              <InputBase
                placeholder="Write exercise details"
                value={exerciseDetails}
                onChange={(e) => setExerciseDetails(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                maxRows={4}
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              {media.map((item, index) => (
                <SpaceBox>
                  <Typography variant="body1" color="text.primary">
                    {index + 1}.
                  </Typography>
                  &nbsp;&nbsp;
                  <img
                    src={"/images/instructor/programImage.png"}
                    style={{
                      width: "84px",
                      height: "54px",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  &nbsp;&nbsp;
                  <Typography variant="body2" color="text.primary">
                  Media {index +1}
                  </Typography>
                  <Box flexGrow={1} />
                  <IconButton>
                    <Iconify
                      icon={"wpf:delete"}
                      color="error.main"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  <Iconify
                    icon={"entypo:select-arrows"}
                    color="text.secondary"
                    width={24}
                    height={24}
                  />
                </SpaceBox>
              ))}
            </Box>
            <Box
              display="flex"
              justifyContent={media.length > 0 ? "center" : "flex-start"}
              sx={{ my: 1 }}
            >
              <ButtonBase>
                <Iconify
                  icon={
                    media.length > 0
                      ? "fluent:add-24-filled"
                      : "ri:image-2-fill"
                  }
                  color="primary.main"
                  width={20}
                  height={20}
                />
                &nbsp;
                <Typography variant="body1" color="textSecondaey">
                  {media.length > 0 ? "Add Media" : "Upload media"}
                </Typography>
              </ButtonBase>
            </Box>
          </Box>
        </RootStyle>
      </MenuPopover>
    </>
  );
}
