// ----------------------------------------------------------------------

export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
            'color': 'rgba(109, 123, 143, 1)',
          },
        },
        input: {
          '&::placeholder': {
            color: 'rgba(109, 123, 143, 0.8)',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: '#E1E7F0',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          'backgroundColor': theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          'border': '1px solid #C3CBD9',
          'backgroundColor': '#F5F7FA',
          'borderRadius': '8px',

          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',

            borderColor: theme.palette.grey[500_32],
          },
          '&.Mui-error': {
            border: '1px solid red',
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.grey[500_32],
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
      },
    },
  };
}
