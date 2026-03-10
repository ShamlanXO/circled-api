import { useState } from 'react';
// @mui
import {
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Masonry } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

const CURRENCIES = [
  { value: 'USD', placeholder: '$' },
  { value: 'EUR', placeholder: '€' },
  { value: 'BTC', placeholder: '฿' },
  { value: 'JPY', placeholder: '¥' },
];

const style = {
  '& > *': { my: '8px !important' },
};

// ----------------------------------------------------------------------

export default function Outlined() {
  const [currency, setCurrency] = useState('EUR');
  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <Block title="General" sx={style}>
        <TextField fullWidth placeholder="Inactive" />
        <TextField required fullWidth placeholder="Activated" defaultValue="Hello Minimal" />
        <TextField fullWidth type="password" placeholder="Password" autoComplete="current-password" />
        <TextField disabled fullWidth placeholder="Disabled" defaultValue="Hello Minimal" />
      </Block>

      <Block title="With Icon & Adornments" sx={style}>
        <TextField
          fullWidth
          placeholder="Filled"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:person-fill" width={24} height={24} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          disabled
          fullWidth
          placeholder="Disabled"
          defaultValue="Hello Minimal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:person-fill" width={24} height={24} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          placeholder="With normal TextField"
          InputProps={{
            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
          }}
        />
        <FormControl fullWidth>
          <OutlinedInput
            id="outlined-adornment-weight"
            value={values.weight}
            onChange={handleChange('weight')}
            endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-placeholder': 'weight',
            }}
          />
          <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:person-fill" width={24} height={24} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                  {values.showPassword ? (
                    <Iconify icon="eva:eye-fill" width={24} height={24} />
                  ) : (
                    <Iconify icon="eva:eye-off-fill" width={24} height={24} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Block>

      <Block title="With Caption" sx={style}>
        <TextField fullWidth placeholder="Error" defaultValue="Hello Minimal" helperText="Incorrect entry." />
        <TextField error fullWidth placeholder="Error" defaultValue="Hello Minimal" helperText="Incorrect entry." />
      </Block>

      <Block title="Type" sx={style}>
        <TextField fullWidth type="password" placeholder="Password" autoComplete="current-password" />
        <TextField fullWidth type="number" placeholder="Number" defaultValue={0} InputLabelProps={{ shrink: true }} />
        <TextField fullWidth placeholder="Search" type="search" />
      </Block>

      <Block title="Size" sx={style}>
        <TextField fullWidth placeholder="Size" size="small" defaultValue="Small" />
        <TextField fullWidth placeholder="Size" defaultValue="Normal" />
      </Block>

      <Block title="Select" sx={style}>
        <TextField
          select
          fullWidth
          placeholder="Select"
          value={currency}
          onChange={handleChangeCurrency}
          helperText="Please select your currency"
        >
          {CURRENCIES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.placeholder}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          size="small"
          value={currency}
          placeholder="Native select"
          SelectProps={{ native: true }}
          onChange={handleChangeCurrency}
          helperText="Please select your currency"
        >
          {CURRENCIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.placeholder}
            </option>
          ))}
        </TextField>
      </Block>

      <Block title="Multiline" sx={style}>
        <TextField fullWidth placeholder="Multiline" multiline maxRows={4} value="Controlled" />
        <TextField fullWidth multiline placeholder="Placeholder"  />
        <TextField rows={4} fullWidth multiline placeholder="Multiline" defaultValue="Default Value" />
      </Block>
    </Masonry>
  );
}
