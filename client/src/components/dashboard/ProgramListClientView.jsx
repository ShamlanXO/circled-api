// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";

import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import { useNavigate } from "react-router";
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  margin: "12px 0",
  marginTop: 0,
  maxWidth: "xs",
  zIndex: 100,
}));

// ----------------------------------------------------------------------

export default function ProgramList(props) {
  const { page } = props;
  const navigate = useNavigate();
  return (
    <Box>
      {props.programs.map((item) => (
        <>
          <BoxStyle
            onClick={() =>
              props.onClickItem
                ? props.onClickItem()
                : navigate(`/public/workout-program/${item._id}`)
            }
          >
            <Stack spacing={0.5} width="auto">
              <Typography
                color="text.primary"
                sx={{ textTransform: "capitalize", display: "flex" }}
              >
                Name : &nbsp;
                <Typography color="text.secondary">{item.Title}</Typography>
              </Typography>{" "}
              <Typography color="text.primary" sx={{ display: "flex" }}>
                Progress : &nbsp;
                <Typography color="text.secondary">
                  week {props.currentweek}
                </Typography>
              </Typography>{" "}
              <Typography color="text.primary" sx={{ display: "flex" }}>
                Status : &nbsp;
                <Typography color="text.secondary">subscribed</Typography>
              </Typography>{" "}
            </Stack>
            <Avatar
              variant="rounded"
              style={{
                width: page == "clientProfile" ? "96px" : "130px",
                height: page == "clientProfile" ? "72px" : "112px",
                backgroundColor: "#fff",
              }}
              src={item?.BannerImage || "/images/instructor/programImage.png"}
            />
          </BoxStyle>
          {/* <Divider sx={{ py: 0.5, borderColor: "#E1E7F0" }} /> */}
        </>
      ))}
    </Box>
  );
}
