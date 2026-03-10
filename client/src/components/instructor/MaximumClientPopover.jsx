/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from 'prop-types'
// @mui
import { styled } from '@mui/material/styles'
import {
    ListItemButton,
    Popover,
    Popper,
    Radio,
    Typography,
    TextField,
    InputAdornment,
} from '@mui/material'
import { useRef, useState } from 'react'
import Iconify from '../Iconify'

export default function SubscriptionTypePopover(props) {
    const [openedPopover, setOpenedPopover] = useState(false)
    const allOption = ['Unlimited', 'Limited']
    const { selectedSubscriptionType, setSubscriptionType } = props
    const popoverAnchor = useRef(null)
    return (
        <div>
            {' '}
            <span
                ref={popoverAnchor}
                onClick={() => setOpenedPopover(true)}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
                <TextField
                    fullWidth
                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
                    value={selectedSubscriptionType}
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
                        width: 220,
                        borderRadius: 0.8,
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
                            setSubscriptionType(item)
                            setOpenedPopover(false)
                        }}
                    >
                        <Radio checked={item == selectedSubscriptionType} />
                        <Typography variant="subtitle2">{item}</Typography>
                    </ListItemButton>
                ))}
            </Popover>
        </div>
    )
}
