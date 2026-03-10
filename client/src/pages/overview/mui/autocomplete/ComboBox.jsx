import PropTypes from 'prop-types';
// @mui
import { TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

ComboBox.propTypes = {
  options: PropTypes.array,
};

export default function ComboBox({ options }) {
  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => <TextField {...params} label="Combo box" margin="none" />}
    />
  );
}
