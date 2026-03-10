import { Box, Typography, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// ----------------------------------------------------------------------

export default function LabeledPhoneInput(props) {
  return (
    <Box width={"100%"}>
      <Typography sx={{ pb: 1, pl: 1, fontWeight: 600 }}>
        {props.clabel}
      </Typography>
      <TextField
        fullWidth
        sx={{ paddingTop: 0 }}
        variant="outlined"
        error={props.error}
        InputProps={{
          inputComponent: PhoneInput,
          inputProps: {
            onChange: (e) => props.setFieldValue("phone", e),
            onBlur: props.onBlur,
            value: props.value,
            country: 'in',
            inputStyle: { background: "none", border: "none", height: "56px", fontSize: 14 },
            buttonStyle: { border: "none", background: "none" },
            dropdownStyle: { color: "#0b0a0a", fontFamily: 'circular' },
          },
        }}
      />
      {/* <PhoneInput
        country={"in"}
        {...props}
        //onChange={(phone) => {props.setFieldValue("phone",phone)}}
  
        containerStyle={{
          background: "#F5F7FA",
          borderRadius: "8px",
          padding: "10px 0",
        }}
        inputStyle={{
          background: "#F5F7FA",
          border: "none",
          width: "100%",
        }}
      /> */}
    </Box>
  );
}
