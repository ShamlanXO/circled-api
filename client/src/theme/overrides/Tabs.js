// ----------------------------------------------------------------------

export default function Tabs(theme) {
    return {
        MuiTabs: {
            styleOverrides: {
                root: {
                    padding: 0,
                    width: '100%',
                    //borderRadius: 18,
                    zIndex: 100,
                    minHeight: 36,

                    //backgroundColor: "#fff",
                },
                indicator: {
                    borderRadius: '10px',
                    height: 4,
                    zIndex: 1000,
                    width: '80%',
                    mx: 2,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    padding: '0 12px',
                   // fontWeight: theme.typography.fontWeightMedium,
                    //borderRadius: 18,
                    minHeight: 36,
                    fontSize: 16,

                    fontWeight: 300,
                    color: '#C3CBD9',

                    '&.Mui-selected': {
                        // backgroundColor: theme.palette.primary.main,
                        // color: "#fff",

                        fontSize: 16,
                        // boxShadow: "0px 1px 7px #E1E7F0",
                        // border:"1px solid #E1E7F0"
                    },
                },
                labelIcon: {
                    minHeight: 36,
                    flexDirection: 'row',
                    '& > *:first-of-type': {
                        marginBottom: 0,
                        marginRight: theme.spacing(1),
                    },
                },
                wrapper: {
                    flexDirection: 'row',
                    whiteSpace: 'nowrap',
                },
                textColorInherit: {
                    opacity: 1,
                    color: theme.palette.text.secondary,
                },
            },
        },
        MuiTabPanel: {
            styleOverrides: {
                root: {
                    padding: 0,
                },
            },
        },
        MuiTabScrollButton: {
            styleOverrides: {
                root: {
                    width: 48,
                    borderRadius: '50%',
                },
            },
        },
    }
}
