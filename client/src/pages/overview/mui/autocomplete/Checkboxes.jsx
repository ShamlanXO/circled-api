import PropTypes from 'prop-types';
// @mui
import { Checkbox, TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

Checkboxes.propTypes = {
  options: PropTypes.array,
};

export default function Checkboxes({ options }) {
  return (
    <Autocomplete
      fullWidth
      multiple
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox checked={selected} />
          {option.title}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Checkboxes" placeholder="Favorites" />}
    />
  );
}
