import PropTypes from 'prop-types';
// @mui
import { TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

MultipleValues.propTypes = {
  options: PropTypes.array,
};

export default function MultipleValues({ options }) {
  return (
    <Autocomplete
      multiple
      fullWidth
      options={options}
      getOptionLabel={(option) => option.title}
      defaultValue={[options[13]]}
      filterSelectedOptions
      renderInput={(params) => <TextField {...params} label="filterSelectedOptions" placeholder="Favorites" />}
    />
  );
}
