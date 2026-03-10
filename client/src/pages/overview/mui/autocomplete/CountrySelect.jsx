import PropTypes from 'prop-types';
// @mui
import { Box, TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

CountrySelect.propTypes = {
  options: PropTypes.array,
};

export default function CountrySelect({ options }) {
  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiAutocomplete-option': {
          typography: 'body2',
          '& > span': { mr: 1, fontSize: 20 },
        },
      }}
    >
      <Autocomplete
        fullWidth
        disablePortal
        autoHighlight
        options={options}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <li {...props}>
            <span>{countryToFlag(option.code)}</span>
            {option.label} ({option.code}) +{option.phone}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />
    </Box>
  );
}
