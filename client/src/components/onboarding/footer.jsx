// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../../components/Page";
// sections
import { Box, Typography, Button, Checkbox } from "@mui/material";

import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import { Stack } from "immutable";
import { useNavigate } from "react-router";
import { useState } from "react";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",
}));

const BoxStyle = styled(Box)(() => ({
  width: "100%",
  //boxShadow: "0px 4px 54px #E1E7F0",
  borderRadius: "24px 24px 0px 0px",
}));

const InsideBoxStyle = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  paddingTop: 52,
  paddingBottom: 24,
}));

// ----------------------------------------------------------------------

export default function Header({
  back,
  confirm,
  next,
  skip,
  nextClick,
  backClick,
  skipClick,
  disabledNext,
  disabledBack,
  disabledSkip,
  nextText,
}) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  return (
    <BoxStyle
      sx={{
        py: 2,
        px: 2,
        background: "#fff",
        borderTop: 1,
        borderTopColor: "grey.300",
      }}
    >
      <Box>
        {confirm && (
          <Box display={"flex"} alignItems={"center"} sx={{ pb: 1 }}>
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            &nbsp;
            <Typography variant="body2" color="text.primary">
              I confirm all of the information above is correct.
            </Typography>
          </Box>
        )}
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box
            display={"flex"}
            flex={1}
            sx={{ pr: 0.5, color: (theme) => theme.palette.grey[700] }}
          >
            {back && (
              <Button
                color="inherit"
                size={"small"}
                variant="outlined"
                onClick={backClick}
                sx={{ minWidth: 132 }}
                disabled={disabledBack}
              >
                Back
              </Button>
            )}
          </Box>

          <Box
            display={"flex"}
            flex={1}
            size={"small"}
            justifyContent={"flex-end"}
            sx={{ pr: 0.5 }}
          >
            {next && (
              <Button
                type={!nextClick ? "submit" : undefined}
                onClick={nextClick}
                fullWidth
                disabled={disabledNext || (confirm && !checked)}
                variant="contained"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: 40,
                  maxWidth: 132,
                }}
              >
                {nextText ? nextText : "Next"}{" "}
                <Iconify
                  icon={"akar-icons:circle-chevron-right"}
                  color="white"
                  width={20}
                  height={20}
                />
              </Button>
            )}
            {skip && (
              <Button
                type={!skipClick ? "submit" : undefined}
                onClick={skipClick}
                fullWidth
                disabled={disabledSkip}
                variant="contained"
                sx={{
                  display: "flex",
                  height: 40,
                  justifyContent: "space-between",
                }}
              >
                Skip{" "}
                <Iconify
                  icon={"akar-icons:circle-chevron-right"}
                  color="white"
                  width={20}
                  height={20}
                />
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </BoxStyle>
  );
}
