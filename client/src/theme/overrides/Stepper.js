// ----------------------------------------------------------------------

export default function Stepper(theme) {
  return {
    MuiStep: {
      styleOverrides: {},
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          position: "absolute",
          left: "calc(-50% + 14px)",
          right: "calc(50% + 14px)",
          top: "10px",
          borderColor: "#C3CBD9",
          "&.Mui-completed": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-active": {
            borderColor: theme.palette.primary.main,
          },
        },
        line: {
          borderColor: "inherit",
          borderWidth: "2px",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          "&.MuiStepLabel-alternativeLabel": {
            marginTop: "2px",
            color: "#C3CBD9",
            fontSize: 14,
          },
          "&.Mui-completed": {
            color: "#C3CBD9",
            fontWeight: "normal",
          },
          "&.Mui-active": {
            color: theme.palette.primary.main,
            fontWeight: "bold",
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: "#fff",
          border: "2px solid #C3CBD9",
          borderRadius: "50%",
          "&.Mui-completed": {
            border: "0px",
          },
          "&.Mui-active": {
            color: "#fff",
            border: "2px solid",
            borderColor: theme.palette.primary.main,
            borderRadius: "50%",
          },
        },
        text: {
          fill: "#C3CBD9",
          fontWeight: "bold",
          "&.Mui-completed": {
            fill: "#fff",
          },
        },
      },
    },
  };
}
