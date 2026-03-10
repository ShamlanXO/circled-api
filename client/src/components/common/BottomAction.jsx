import { Box, Divider, Drawer, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MenuItem } from '@mui/material'
import AddCircle from 'src/assets/IconSet/AddOutlined'

function ActionBottomDrawer(props) {
    const [drawerOpen, setDrawerOpen] = useState(false)

    const toggleDrawer = (isOpen) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setDrawerOpen(isOpen)
    }

    return (
        <div>
            <Drawer
                anchor={'bottom'}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
                disableBackdropTransition
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    padding={'24px 24px 36px'}
                    style={{
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        backgroundColor: '#fff',
                    }}
                >
                    <Box display="flex" flexDirection="column" component="form">
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            <Typography variant="body">
                                {props?.title}
                            </Typography>
                        </Box>

                       {props?.title&& <Divider sx={{ my: 1 }} />}
                        {props.items.map((i) => (
                            <>
                                <MenuItem
                                    sx={{ px: 0 }}
                                    onClick={() => {
                                        i.onClick()
                                        setDrawerOpen(false)
                                    }}
                                >
                                    {i.icon}
                                    <Typography
                                        align="center"
                                        variant="body"
                                        color={
                                            i.isError
                                                ? 'error.main'
                                                : 'text.primary'
                                        }
                                    >
                                        {i.title}
                                    </Typography>
                                </MenuItem>
                            </>
                        ))}
                    </Box>
                </Box>
            </Drawer>
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    setDrawerOpen(true)
                }}
            >
                {props.children}
            </div>
        </div>
    )
}

export default ActionBottomDrawer
