import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

const RootStyle = styled("span")(({ theme, ownerState }) => {
  const isLight = theme.palette.mode === "light";
  const { color, variant } = ownerState;

  const styleFilled = (color) => ({
    // color: theme.palette[color].contrastText,
    // backgroundColor: theme.palette[color].main,
    color: theme.palette[color].main,
    backgroundColor: alpha(theme.palette[color].main, 0.16),
  });
  const styleContained = (color) => ({
    color: theme.palette[color].contrastText,
    backgroundColor: theme.palette[color].main,
  });

  const styleOutlined = (color) => ({
    color: theme.palette[color].main,
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette[color].main}`,
  });

  const styleGhost = (color) => ({
    color: theme.palette[color][isLight ? "main" : "light"],
    backgroundColor: alpha(theme.palette[color].main, 0.16),
  });
  const styleNumber = (color) => ({
    color: theme.palette.common.white,
    padding: theme.spacing(0, 1),
    backgroundColor: alpha(theme.palette[color].main, 0.21),
  });

  return {
    minHeight: 24,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 24,
    cursor: "default",
    alignItems: "center",
    whiteSpace: "nowrap",
    display: "inline-flex",
    justifyContent: "center",
    padding: theme.spacing(0.5, 1.5),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,

    ...(color !== "default"
      ? {
          ...(variant === "filled" && { ...styleFilled(color) }),
          ...(variant === "contained" && { ...styleContained(color) }),
          ...(variant === "outlined" && { ...styleOutlined(color) }),
          ...(variant === "ghost" && { ...styleGhost(color) }),
          ...(variant === "number" && { ...styleNumber(color) }),
        }
      : {
          ...(variant === "outlined" && {
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.grey[500_32]}`,
          }),
          ...(variant === "ghost" && {
            color: isLight
              ? theme.palette.text.secondary
              : theme.palette.common.white,
            backgroundColor: theme.palette.grey[500],
            padding: theme.spacing(0.2, 1),
          }),
        }),
  };
});

// ----------------------------------------------------------------------

Label.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  variant: PropTypes.oneOf(["filled", "outlined", "ghost"]),
};

export default function Label({
  color = "default",
  variant = "ghost",
  children,
  ...other
}) {
  return (
    <RootStyle ownerState={{ color, variant }} {...other}>
      {children}
    </RootStyle>
  );
}
