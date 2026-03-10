//
import {
  CheckboxIcon,
  CheckboxCheckedIcon,
  CheckboxIndeterminateIcon,
} from "./CustomIcons";
import RestIcon from "src/assets/IconSet/RestDay";
// ----------------------------------------------------------------------

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      defaultProps: {
        icon: <RestIcon />,
        checkedIcon: (
          <CheckboxCheckedIcon style={{ fontSize: 82, height: 45 }} />
        ),
        indeterminateIcon: <CheckboxIndeterminateIcon />,
      },

      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          width: 34,
          height: 34,
          "&.Mui-checked.Mui-disabled, &.Mui-disabled": {
            color: theme.palette.action.disabled,
          },

          "& .MuiSvgIcon-fontSizeMedium": {
            width: 32,
            height: 24,
            marginLeft: -4,
          },
          "&.Mui-checked": {
            width: 34,
            height: 34,
          },
          "& .MuiSvgIcon-fontSizeSmall": {
            width: 20,
            height: 20,
          },
          svg: {
            fontSize: 24,

            "&[font-size=small]": {
              fontSize: 20,
            },
          },
        },
      },
    },
  };
}
