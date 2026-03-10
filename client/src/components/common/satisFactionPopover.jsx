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
} from '@mui/material'
import { useRef, useState } from 'react'
import Iconify from '../Iconify'

export default function DurationPopover(props) {
    const [openedPopover, setOpenedPopover] = useState(false)
    const allOption = ['Not satisfied', 'Satisfied', 'Very satisfied']
    const { selected, setSelected } = props
    const popoverAnchor = useRef(null)
    return (
        <div>
            {' '}
            <span ref={popoverAnchor} onClick={() => setOpenedPopover(true)}>
                <ListItemButton
                    fullWidth
                    sx={{
                        backgroundColor: '#F5F7FA',
                        border: '1px solid #C3CBD9',
                        borderRadius: '9px',
                        py: '12px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="subtitle2">{selected}</Typography>

                    <Iconify
                        icon={'entypo:select-arrows'}
                        color="common.black"
                    />
                </ListItemButton>
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
                            setSelected(item)
                            setOpenedPopover(false)
                        }}
                    >
                        <Radio checked={item == selected} />
                        <Typography variant="subtitle2">{item}</Typography>
                    </ListItemButton>
                ))}
            </Popover>
        </div>
    )
}
