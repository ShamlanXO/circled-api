import * as React from "react";
import clsx from "clsx";
import { styled } from "@mui/system";
import { useSwitch } from "@mui/base";

const blue = {
  700: "#0059B2",
};

const grey = {
  400: "#BFC7CF",
  800: "#2F3A45",
};

const SwitchRoot = styled("span")`
  display: inline-block;
  position: relative;
  width: 54px;
  height: 27px;
`;

const SwitchInput = styled("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled("span")`
  position: absolute;
  display: block;
  background-color: ${"#fff"};
  width: 23px;
  height: 23px;
  border-radius: 30px;
  top: 2px;
  left: 3px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &.focusVisible {
    background-color: #79b;
  }

  &.checked {
    transform: translateX(24px);
  }
`;

const SwitchTrack = styled("span", {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "checked",
})(({ color, checked, theme }) => ({
  backgroundColor: theme.palette.grey[400],
  borderRadius: 36,
  width: "100%",
  height: "100%",
  display: "block",
  ...(checked && {
    backgroundColor: theme.palette[color].main,
  }),
}));

function MUISwitch(props) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);
  const { color = "primary" } = props;

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  };

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack color={color} checked={checked}>
        <SwitchThumb className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} aria-label="Demo switch" />
    </SwitchRoot>
  );
}

export default function SwitchCustom(props) {
let [checked,setChecked]=React.useState(false)
  React.useEffect(()=>{
    setChecked(props.checked)
  },[props.checked])
  return (
    <MUISwitch
      //  defaultChecked
      {...props}
    />
  );
}
