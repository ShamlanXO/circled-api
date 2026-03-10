import * as React from 'react'
import { styled } from '@mui/material/styles'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { DialogActions, DialogContent, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import Iconify from '../Iconify'
import { CloseOutlined } from '@mui/icons-material'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    paper: {
        borderRadius: 0,
        '& .MuiPaper-rounded': {
            borderRadius: 0.5,
        },
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}))
function SimpleDialog(props) {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        localStorage.setItem('calender-walkthrough', true)
        setOpen(false)
    }

    React.useEffect(() => {
        let haveatleast1day = false

        props.Program.ExercisePlan?.weeks.map((w) => {
            if (w.days?.find((i) => i.Title || i.Exercise?.length))
                haveatleast1day = true
        })
        if (haveatleast1day && !localStorage.getItem('calender-walkthrough')) {
            setOpen(true)
        }
    }, [props.Program])

    return (
        <BootstrapDialog
            open={open}
            fullWidth
            maxWidth={'sm'}
            sx={{}}
            PaperProps={{
                style: {
                    borderRadius: 8,
                    position:"relative"
                },
            }}
   
        >
            <Box width={"100%"} display={"flex"} justifyContent={"flex-end"}>  <IconButton onClick={()=>handleClose()}><CloseOutlined/></IconButton></Box>
            

            {/* <DialogTitle>Set backup account</DialogTitle> */}
            <DialogContent>
          
                <SwipeableTextMobileStepper handleClose={handleClose} />
            </DialogContent>
        </BootstrapDialog>
    )
}

const images = [
    {
        label: 'swap',
        imgPath: '/images/walkthrough/copy.gif',
        title: 'Copy workouts',
        details: (
            <>
                Press on a built workout day and <br />
                drag it to the next week to copy
            </>
        ),
    },
    {
        label: 'copy',
        imgPath: '/images/walkthrough/swap.gif',
        title: 'Re-arrange workouts',
        details: (
            <>
                Press on a built workout drag it below
                <br />a built workout card to re-arrange
            </>
        ),
    },
]

function SwipeableTextMobileStepper(props) {
    const theme = useTheme()
    const [activeStep, setActiveStep] = React.useState(0)
    const maxSteps = images.length

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
    }

    return (
        <Box
            flexDirection={'column'}
            justifyContent={'space-between'}
            display={'flex'}
            sx={{ flexGrow: 1 }}
            position={"relative"}

        >

            <Box display={'flex'} flexGrow={1}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {images.map((step, index) => (
                        <div key={step.label}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <img
                                    height={450}
                                    width={'100%'}
                                    component="img"
                                    sx={{
                                        height: '10%',

                                        overflow: 'hidden',
                                        width: 'auto',
                                    }}
                                    src={step.imgPath}
                                    alt={step.label}
                                />
                            ) : null}
                        </div>
                    ))}
                </SwipeableViews>
            </Box>
            <Box>
                <Typography
                    variant="subtitle1"
                    align="center"
                    gutterBottom
                    sx={{ mt: 2 }}
                >
                    {images[activeStep].title}
                </Typography>
                <Typography align={'center'} variant="body2">
                    {images[activeStep].details}
                </Typography>
                <center>
                    <MobileStepper
                        sx={{
                            background: 'white',
                            justifyContent: 'center',
                            my: 1,
                        }}
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                    />
                </center>
                <Box display={'flex'} justifyContent={'center'}>
                    {activeStep == 1 ? (
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ minWidth: 120 }}
                            onClick={props.handleClose}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleNext}
                            sx={{ minWidth: 120 }}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default SimpleDialog
