import {
    Box,
    Button,
    ButtonBase,
    Divider,
    Radio,
    SwipeableDrawer,
    InputBase,
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
import { Dialog } from '@mui/material'
import Header from 'src/components/Layout/Header'
import Container from 'src/components/Layout/Container'
import Content from '../Layout/Content'
import { IconButton } from '@mui/material'
import LabeledInput from '../../components/core/LabeledInput'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
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

    return (
        <div>
            <Dialog
                fullScreen
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
                <Container>
                    <Header
                        style={{ borderRadius: '0px 0px 8px 8px' }}
                        boxShadow
                    >
                        <Box
                            width={'100%'}
                            px={2}
                            py={2}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Box display={'flex'} alignItems={'center'}>
                                <IconButton
                                    onClick={() => setDrawerOpen(false)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                {/* <Typography variant="body1">{props.headerTitle}</Typography>
                &nbsp; > */}
                                <Typography variant="subtitle1" color={"text.primary"}>
                                    {props.headerSubTitle}
                                </Typography>
                            </Box>
                            <Button
                                sx={{ fontSize: 16, paddingRight: 0 }}
                                onClick={() => setDrawerOpen(false)}
                            >
                                Done
                            </Button>
                        </Box>
                    </Header>
                    <Content withoutPadding style={{ background: '#fff' }}>
                        <Box display={'flex'} pt={2} px={2}>
                            <InputBase
                                style={{
                                    display: 'inline',
                                    alignItems: 'flex-start',

                                    borderColor: '#000',
                                    px: 2,
                                    minHeight: 200,
                                    position: 'relative',
                                }}
                                {...props}
                                clabel={''}
                                minRows={10}
                                autoFocus
                            />
                            {/* <Box display="flex" justifyContent={"center"} sx={{ mb: 1 }}>
            <img
              src={"/images/bottomDrawerIndicator.png"}
              width={"170px"}
              height="5px"
            />
          </Box> */}
                        </Box>
                    </Content>
                </Container>
            </Dialog>
            <div
                onClick={() =>
                    props.clientSide ? props.onClick() : setDrawerOpen(true)
                }
            >
                {props.children}
            </div>
        </div>
    )
}

export default WorkoutDayBottomDrawer
