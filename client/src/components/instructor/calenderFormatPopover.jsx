/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from 'prop-types'
// @mui
import { styled } from '@mui/material/styles'
import {
    ListItemButton,
    ListItemText,
    Popover,
    Popper,
    Radio,
    TextField,
    InputAdornment,
    Typography,
} from '@mui/material'
import { useRef, useState } from 'react'
import Iconify from '../Iconify'

export default function WorkoutIntensityPopOver(props) {
    const [openedPopover, setOpenedPopover] = useState(false)
    const allOption = ['Standard days', 'Numeric days']
    const secondaryText={
        'Standard days':"Saturday - Sunday - Monday",
        'Numeric days':"Day 1 - Day 2 - Day 3 "
    }
    const { selectedType, setSelectedType } = props
    const popoverAnchor = useRef(null)
    return (
        <div>
            {' '}
            <span ref={popoverAnchor} onClick={() => setOpenedPopover(true)}>
            <TextField
                    fullWidth
                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
                    value={selectedType}
                    readOnly
                    sx={{
                        fontWeight: 'bold',
                    }}
                    InputProps={{
                        readOnly: true,
                        sx: { fontWeight: 'bold' },
                        endAdornment: (
                            <InputAdornment position="end">
                                <Iconify
                                    icon={'entypo:select-arrows'}
                                    color="common.black"
                                />
                            </InputAdornment>
                        ),
                    }}
                ></TextField>
            
            </span>
            <Popover
                id="mouse-click-popover"
                open={openedPopover}
                onClose={() => setOpenedPopover(false)}
                anchorReference="anchorEl"
                anchorEl={popoverAnchor.current}
                PaperProps={{
                    sx: {
                       
                        borderRadius: 0.8,
                        py:2,
                        boxShadow: (theme) => theme.customShadows.z20,
                        border: (theme) =>
                            `solid 1px ${theme.palette.grey[500_12]}`,
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {allOption.map((item) => (
                    <ListItemButton
                        onClick={() => {
                            setSelectedType(item)
                            setOpenedPopover(false)
                        }}
                    >
                        <Radio checked={item == selectedType} />
                       
                        <ListItemText primary={item+" format"} secondary={secondaryText[item]} />
                    </ListItemButton>
                ))}
            </Popover>
        </div>
    )
}
