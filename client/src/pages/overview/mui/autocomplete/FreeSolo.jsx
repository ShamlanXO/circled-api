import PropTypes from 'prop-types';
// @mui
import { TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

FreeSolo.propTypes = {
  options: PropTypes.array,
};

export default function FreeSolo({ options }) {
  return (
    <>
      <Autocomplete
        fullWidth
        freeSolo
        options={options.map((option) => option.title)}
        renderInput={(params) => <TextField {...params} label="freeSolo" margin="normal" />}
      />
      <Autocomplete
        fullWidth
        freeSolo
        disableClearable
        options={options.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            margin="normal"
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
      />
    </>
  );
}
