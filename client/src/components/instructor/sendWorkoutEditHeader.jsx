// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    IconButton,
    ListItemButton,
    Stack,
    Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import DurationPopover from './durationPopover'
import Label from '../Label'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import { useNavigate } from 'react-router'
import WorkoutIntensityPopOver from './calenderFormatPopover'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    maxWidth: 'xs',
    zIndex: 100,
    borderRadius: '0px 0px 8px 8px',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    //zIndex: 100,
    backgroundColor: '#fff',
    //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
    borderRadius: '0px 0px 8px 8px',
}))

const InsideBoxStyle = styled(Box)(() => ({
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 52,
    paddingBottom: 24,
    zIndex: 100,
    top: 0,
}))

// ----------------------------------------------------------------------

export default function SendWorkoutEditHeader({ setHeaderDependency }) {
    const [mini, setMini] = useState(false)
    const navigate = useNavigate()
    const minimize = () => {
        setMini(!mini)
        setTimeout(() => {
            setHeaderDependency(new Date())
        }, 300)
    }
    return (
        <BoxHeader>
            {' '}
            <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                px={2}
                py={2}
            >
                <Box display={'flex'} alignItems={'center'}>
                    {' '}
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ color: 'text.primary' }}
                    >
                        <ArrowLeft />
                    </IconButton>
                    <Typography variant="body1" color="text.primary">
                        {/* Send Workout &nbsp;&gt;&nbsp; */}
                        <Typography
                            component={'span'}
                            variant="subtitle1"
                            color="text.primary"
                        >
                            Edit Workouts
                        </Typography>
                    </Typography>
                </Box>{' '}
            </Box>
            {mini && (
                <Fade in={mini}>
                    <div>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            px={2}
                            py={2}
                        >
                            <Typography variant="h5" color="text.primary">
                                Fat Toaster 🔥
                            </Typography>{' '}
                            <Box display="flex">
                                <Label color="primary">
                                    <Iconify
                                        icon="ic:round-calendar-month"
                                        width="20px"
                                        height="20px"
                                    />
                                    &nbsp;4 weeks
                                </Label>
                                &nbsp;&nbsp;
                                <Label color="error">
                                    <Iconify
                                        icon="icon-park-outline:dumbbell"
                                        width="20px"
                                        height="20px"
                                    />
                                    &nbsp;Extreme
                                </Label>
                            </Box>
                        </Box>
                    </div>
                </Fade>
            )}
            {
                <Collapse in={!mini}>
                    <BoxStyle>
                        <Avatar
                            variant="rounded"
                            style={{
                                width: '130px',
                                height: '112px',
                                backgroundColor: '#fff',
                            }}
                            src={'/images/instructor/programImage.png'}
                        />

                        <Box width="auto" marginLeft={2}>
                            <Typography variant="h5" color="text.primary">
                                Fat Toaster 🔥
                            </Typography>{' '}
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                flexWrap={'wrap'}
                            >
                                This program is designed for ambitious people
                                who are ...
                            </Typography>
                            <Box display="flex" flexWrap={'wrap'}>
                                <Box sx={{ m: 0.4 }}>
                                    <Label color="primary">
                                        <Iconify
                                            icon="ic:round-calendar-month"
                                            width="20px"
                                            height="20px"
                                        />
                                        &nbsp;4 weeks
                                    </Label>
                                </Box>
                                <Box sx={{ m: 0.4 }}>
                                    <Label color="error">
                                        <Iconify
                                            icon="icon-park-outline:dumbbell"
                                            width="20px"
                                            height="20px"
                                        />
                                        &nbsp;Extreme
                                    </Label>
                                </Box>
                            </Box>
                        </Box>
                    </BoxStyle>
                    <BoxStyle>
                        <Box width="100%">
                            <Typography variant="h5" color="text.primary">
                                Duration
                            </Typography>{' '}
                            <DurationPopover>
                                <ListItemButton
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#F5F7FA',
                                        borderRadius: '9px',
                                        py: '10px',
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        4 Weeks
                                    </Typography>

                                    <Iconify
                                        icon={'entypo:select-arrows'}
                                        color="common.black"
                                    />
                                </ListItemButton>
                            </DurationPopover>
                        </Box>{' '}
                        &nbsp;&nbsp;
                        <Box width="100%">
                            <Typography variant="h5" color="text.primary">
                                Type
                            </Typography>{' '}
                            <WorkoutIntensityPopOver>
                                <ListItemButton
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#F5F7FA',
                                        borderRadius: '9px',
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        Extreme
                                    </Typography>

                                    <Iconify
                                        icon={'entypo:select-arrows'}
                                        color="common.black"
                                    />
                                </ListItemButton>
                            </WorkoutIntensityPopOver>
                        </Box>
                    </BoxStyle>
                </Collapse>
            }
            <Box display="flex" justifyContent={'center'}>
                <IconButton onClick={minimize}>
                    <Iconify
                        icon={
                            mini
                                ? 'ic:round-keyboard-arrow-down'
                                : 'ic:round-keyboard-arrow-up'
                        }
                        width="24px"
                        height="24px"
                    />
                </IconButton>
            </Box>
        </BoxHeader>
    )
}
