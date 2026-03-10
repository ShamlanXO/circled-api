import { Box, Typography, TextField } from "@mui/material";

// ----------------------------------------------------------------------

export default function LabeledInput(props) {
  function capitalizeFirstLetter(string) {
    if(!string||typeof string != "string")return string
  
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}
  return (
    <Box width={"100%"}>
      <Typography
        sx={{
          pb: 1,
          fontWeight: 600,
          //textTransform: "capitalize",
          display: "flex",
          alignItems: "center",
        }}
      >
        {props.labelIcon}
        {capitalizeFirstLetter(props.clabel||"")}
      </Typography>
      <TextField {...props} />
    </Box>
  );
}
