// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          height: 48,
          paddingLeft: 24,
          paddingRight: 24,
          textTransform: "none",
          borderRadius: 8,
          fontSize: 20,
          fontWeight: 500,
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          height: 54,
        },
        sizeSmall: {
          borderRadius: 8,
          height: 40,
        },
        
        // contained
        containedInherit: {
          color: theme.palette.grey[800],
          boxShadow: theme.customShadows.z8,
          "&:hover": {
            backgroundColor: theme.palette.grey[400],
          },
        },
        containedPrimary: {
          "&.Mui-disabled": {
            backgroundColor: theme.palette.primary.lighter,
            color: "#fff"
          }
          // boxShadow: theme.customShadows.primary,
        },
        textPrimary:{
          "&.Mui-disabled": {
         
            color: "rgba(139, 187, 244, 0.4)"
          }
        },
        containedSecondary: {
          // boxShadow: theme.customShadows.secondary,
        },
        containedInfo: {
          // boxShadow: theme.customShadows.info,
        },
        containedSuccess: {
          // boxShadow: theme.customShadows.success,
        },
        containedWarning: {
          // boxShadow: theme.customShadows.warning,
        },
        containedError: {
          // boxShadow: theme.customShadows.error,
        },
        // outlined
        outlined: {
          borderWidth: "1.5px",
          fontWeight: 500,
        },

        outlinedPrimary: {
          borderWidth: "1.5px",
          borderColor: theme.palette.primary.main,
        },
        outlinedInherit: {
          border: `1.5px solid ${theme.palette.grey[500_32]}`,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },

        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
    
      },
    },
  };
}
