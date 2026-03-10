import {
    Box,
    Button,
    Divider,
    Radio,
    SwipeableDrawer,
    Typography,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Iconify from '../Iconify'
import Label from '../Label'
import { useConfirmationModalContext } from 'src/utils/Modal'
import { useDispatch, useSelector } from 'react-redux'
import Checkbox from '@mui/material/Checkbox'
import { MenuItem } from '@mui/material'
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });
import { deleteProgram } from 'src/redux/actions/createProgram'
import { getAllPrograms } from 'src/redux/actions/createProgram'
function WorkoutDayBottomDrawer(props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { Program, updateProgram } = props
    const { showConfirmationModal } = useConfirmationModalContext()
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

    const onView = () => {
        toggleDrawer(false)
        navigate(`/editProgram/${props.Program._id}/publishProgram`)
    }

    const onDeleteDay = () => {
        toggleDrawer(false)
        showConfirmationModal(
            'Are you sure?',
            `You are going to delete this workout program. This process is irreversible`,
            'Delete'
        ).then((res) => {
            if (res) {
                dispatch(deleteProgram(props.Program._id)).then((res) => {
                    setDrawerOpen(false)
                    dispatch(getAllPrograms())
                })
            }
        })
    }

    return (
        <div>
            <SwipeableDrawer
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
                {/* <Box display="flex" justifyContent={"center"} sx={{ mb: 1 }}>
            <img
              src={"/images/bottomDrawerIndicator.png"}
              width={"170px"}
              height="5px"
            />
          </Box> */}
                <Box
                    padding={'24px 24px 36px'}
                    style={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        backgroundColor: '#fff',
                    }}
                >
                    <Box display="flex" flexDirection="column" component="form">
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                textTransform: 'capitalize',
                            }}
                        >
                            {props.Program.Title}
                        </Typography>
                        {/* <Box
              display="flex"
              justifyContent="space-between"
              marginTop="12px"
              alignItems={"center"}
              mb={2}
            >
              <Box display="flex" alignItems={"center"}>
                <Typography variant="body1" color="text.secondary">
                  {props.Program.Title}
                </Typography>
              </Box>
            </Box> */}

                        <Divider sx={{ my: 1 }} />

                        <MenuItem sx={{ px: 0 }} onClick={onView}>
                            <Iconify
                                icon="ph:arrow-clockwise"
                                sx={{ width: 22, height: 22, mr: 2 }}
                            />
                            <Typography align="center">Continue</Typography>
                        </MenuItem>
                        <MenuItem sx={{ px: 0 }} onClick={onDeleteDay}>
                            <Iconify
                                icon="akar-icons:trash-can"
                                sx={{ width: 22, height: 22, mr: 2 }}
                                color="error.main"
                            />
                            <Typography align="center" color={'error.main'}>
                                Remove
                            </Typography>
                        </MenuItem>
                    </Box>
                </Box>
            </SwipeableDrawer>
            <div
                onClick={() =>
                    props.clientSide
                        ? props.onClick()
                        : props?.Program.IsDraft
                        ? setDrawerOpen(true)
                        : null
                }
            >
                {props.children}
            </div>
        </div>
    )
}

export default WorkoutDayBottomDrawer
