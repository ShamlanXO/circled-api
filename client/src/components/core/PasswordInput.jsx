import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// ----------------------------------------------------------------------

export default function LabeledInput(props) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  return (
    <Box width={"100%"}>
      <Typography sx={{ pb: 1, pl: 1, fontWeight: 600 }}>
        {props.clabel}
      </Typography>
      <TextField
        fullWidth
        {...props}
        InputProps={{
          type: !showPass ? "password" : "text",
          endAdornment: showPass ? (
            <InputAdornment position="start">
              <VisibilityOffIcon onClick={() => setShowPass(false)} />
            </InputAdornment>
          ) : (
            <InputAdornment position="start">
              {" "}
              <VisibilityIcon onClick={() => setShowPass(true)} />{" "}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
