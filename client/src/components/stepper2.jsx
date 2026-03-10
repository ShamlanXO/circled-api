import { Box, IconButton, Typography } from "@mui/material";

import { useNavigate } from "react-router";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Iconify from "./Iconify";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[600],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "#fff",
  },
}));
export default function Stepper({
  steps = 4,
  active = 1,
  handleClose,
  noClose,
  noBack,
  children,
  label,
  progress = 100,
}) {
  const navigate = useNavigate();

  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"row"}
      // sx={{ background: noBack?"rgba(0,0,0,0)" :"#fff"}}
    >
      {!noClose && (
        <Box sx={{ mr: 0.5 }} onClick={handleClose}>
          <Iconify icon={"clarity:window-close-line"} width={24} height={24} />
        </Box>
      )}
      <Box display={"flex"} flexGrow={1} pt={2}>
        {Array(steps)
          .fill(0)
          .map((i, index) => {
            return (
              <Box
                key={index}
                flex={index + 1 == active ? undefined : 1}
                flexGrow={index + 1 == active ? 1 : undefined}
                sx={{ maxWidth: index + 1 == active ? undefined : 60 }}
              >
                {noBack ? (
                  <BorderLinearProgress
                    variant="determinate"
                    value={index + 1 == active ? progress : 0}
                    sx={{ mx: 0.5 }}
                  />
                ) : (
                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={index + 1 == active ? progress : 0}
                      sx={{ mx: 0.5 }}
                    />
                    <center>
                      <Typography
                        mt={0.5}
                        sx={{
                          width: "100%",
                          fontWeight: "500",
                          color:
                            index + 1 == active ? "primary.main" : "grey.400",
                        }}
                        variant={index + 1 == active ? "body1" : "caption"}
                        align="center"
                      >
                        {label?.[index]}
                      </Typography>
                    </center>
                  </Box>
                )}
              </Box>
            );
          })}
      </Box>
      {children}
    </Box>
  );
}
