import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "./CustomIcons";

// ----------------------------------------------------------------------

export default function Alert(theme) {
  const isLight = theme.palette.mode === "light";

  const standardStyle = (color) => ({
    color: "white",
    //color: theme.palette[color][isLight ? "darker" : "lighter"],
    backgroundColor: theme.palette[color][isLight ? "lighter" : "darker"],
    "& .MuiAlert-icon": {
      color: "white",
      //color: theme.palette[color][isLight ? "main" : "light"],
    },
  });

  const filledStyle = (color) => ({
    color: theme.palette[color].white,
  });

  const outlinedStyle = (color) => ({
    color: theme.palette[color][isLight ? "darker" : "lighter"],
    border: `solid 1px ${theme.palette[color][isLight ? "light" : "dark"]}`,
    backgroundColor: theme.palette[color][isLight ? "lighter" : "darker"],
    "& .MuiAlert-icon": {
      color: "white",
      //color: theme.palette[color][isLight ? "main" : "light"],
    },
  });

  return {
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          info: <InfoIcon />,
          success: <SuccessIcon style={{ color: "white" }} />,
          warning: <WarningIcon />,
          error: <ErrorIcon />,
        },
      },

      styleOverrides: {
        message: {
          color: "white",
          "& .MuiAlertTitle-root": {
            marginBottom: theme.spacing(0.5),
          },
        },
        action: {
          color: "white",
          "& button:not(:first-of-type)": {
            marginLeft: theme.spacing(1),
          },
        },

        standardInfo: standardStyle("info"),
        standardSuccess: standardStyle("success"),
        standardWarning: standardStyle("warning"),
        standardError: standardStyle("error"),

        filledInfo: filledStyle("info"),
        filledSuccess: filledStyle("success"),
        filledWarning: filledStyle("warning"),
        filledError: filledStyle("error"),

        outlinedInfo: outlinedStyle("info"),
        outlinedSuccess: outlinedStyle("success"),
        outlinedWarning: outlinedStyle("warning"),
        outlinedError: outlinedStyle("error"),
      },
    },
  };
}
