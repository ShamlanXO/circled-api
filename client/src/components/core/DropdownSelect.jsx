import * as React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Radio'
import { Box, Typography, TextField, FormHelperText } from '@mui/material'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
]

export default function MultipleSelectCheckmarks(props) {
    const [personName, setPersonName] = React.useState([])

    return (
        <Box width={'100%'}>
            <Typography sx={{ pb: 1, pl: 1, fontWeight: 600 }}>
                {props.clabel}
            </Typography>

            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={personName}
                input={<OutlinedInput />}
                renderValue={(selected) =>
                    props.options.find((i) => i.value == selected).label
                }
                // MenuProps={MenuProps}
                {...props}
            >
                {props.options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        <Checkbox
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 16,
                                },
                            }}
                            checked={props.value == item.value}
                        />
                        <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                            {item.label}
                        </Typography>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText >{props.helperText}</FormHelperText>
        </Box>
    )
}
