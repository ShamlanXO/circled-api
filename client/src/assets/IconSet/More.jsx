import { SvgIcon } from "@mui/material";
export default function More(props) {
  return (
    <SvgIcon
      width="32"
      height="9"
      viewBox="0 0 32 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="5"
        cy="4.5"
        r="3.5"
        transform="rotate(-90 5 4.5)"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle
        cx="16"
        cy="4.5"
        r="3.5"
        transform="rotate(-90 16 4.5)"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
      <circle
        cx="27"
        cy="4.5"
        r="3.5"
        transform="rotate(-90 27 4.5)"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      />
    </SvgIcon>
  );
}
