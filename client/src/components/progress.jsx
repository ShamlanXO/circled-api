// @mui

import {
    Box,
    IconButton,
    Typography,
    Tabs,
    Tab,
    Divider,
    Step,
    Stepper,
    StepLabel,
    StepIcon,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useNavigate } from 'react-router'

import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress'
import Iconify from './Iconify'
import { styled } from '@mui/material/styles'
import { computePath } from 'src/utils/routepath'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[600],
    },
    [`& .${linearProgressClasses.bar}`]: {
        backgroundColor: '#fff',
    },
}))

const LinearProgressModified = styled(LinearProgress)(({ theme }) => ({
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[400],
    },
    [`& .${linearProgressClasses.bar}`]: {
        backgroundColor: theme.palette.primary.main,
    },
}))
export default function StepperCustom({
    steps = 4,
    active = 1,
    withDivider,
    handleClose,
    noClose,
    noBack,
    children,
    completedIndex = [],
    label,
    mode,
    route,
    Program,
    px,
    stepper,
    selectedTab = 0,
    setSelectedTab,
}) {
    const navigate = useNavigate()

    const navigateItem = (item) => {
        navigate(computePath(mode, '/' + item, Program._id))
    }
    return (
        <Box
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'row'}
            px={px || 0}
            borderRadius={4}

            // sx={{ background: noBack?"rgba(0,0,0,0)" :"#fff"}}
        >
            {/* {!noClose&&<Box sx={{ mr: 0.5}} onClick={handleClose}>
       
          <Iconify icon={"clarity:window-close-line"} width={24} height={24}  />
       
      </Box>} */}
            <Box width={'100%'}>
                <Box px={1}>
                    {!stepper ? (
                        // <Tabs
                        //     px={1}
                        //     sx={{
                        //         height:4,
                        //     }}
                        //     variant="fullWidth"
                        //     value={selectedTab}
                        //     onChange={(e, val) => setSelectedTab(val)}
                        // >
                        //     {Array(steps)
                        //         .fill(0)
                        //         .map((i, index) => {
                        //             return (
                        //                 <Tab
                        //                 sx={{
                        //                     height:4,
                        //                 }}
                        //                     label={
                        //                         <>
                        //                             {/* <Typography
                        //                                 sx={{
                        //                                     fontWeight:
                        //                                         index ==
                        //                                         selectedTab
                        //                                             ? 'bold'
                        //                                             : 300,
                        //                                 }}
                        //                             >
                        //                                 {label[index]}
                        //                             </Typography> */}
                        //                             <span
                        //                                 style={{
                        //                                     my: 1,
                        //                                     position:
                        //                                         'absolute',
                        //                                     bottom: 0,
                        //                                     height: 4,
                        //                                     width: '95%',
                        //                                     borderRadius: 4,
                        //                                     background:
                        //                                         completedIndex.find(
                        //                                             (itm) =>
                        //                                                 itm ==
                        //                                                 index
                        //                                         ) > -1
                        //                                             ? '#95A3B8'
                        //                                             : "#E1E7F0",
                        //                                 }}
                        //                             ></span>
                        //                         </>
                        //                     }
                        //                     value={route[index]}
                        //                     style={{ position: 'relative' }}
                        //                 />
                        //             )
                        //         })}
                        // </Tabs>
                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}  gap={1} justifyContent={'space-between'}>
                            {Array(steps)
                                .fill(0)
                                .map((i, index) => {
                                    return (
                                        <Box 
                                        onClick={() => setSelectedTab(index)}
                                        key={label[index]} 
                                        width={'100%'} 
                                        height={6} 
                                        bgcolor={
                                            selectedTab == index ? 'primary.main' :
                                            completedIndex.find((itm) => itm == index) ? '#95A3B8' : "#E1E7F0"} 
                                        sx={{
                                            borderRadius:2,
                                        }} />
                                    )
                                })}
                        </Box>
                    ) : (
                        <Stepper
                            activeStep={selectedTab}
                            alternativeLabel
                            sx={{ mb: -2 }}
                        >
                            {Array(steps)
                                .fill(0)
                                .map((i, index) => {
                                    return (
                                        <Step
                                            key={label[index]}
                                            onClick={() => setSelectedTab(index)}
                                        >
                                            <StepLabel
                                                StepIconComponent={StepIconItem}
                                                style={{
                                                    color: selectedTab === index ? 'primary.main' : 'text.secondary',
                                                }}
                                            >
                                                {label[index]}
                                            </StepLabel>
                                            {selectedTab==index?
                                            <center>
                                             <Divider sx={{width:"64px" ,mt:1,borderWidth:1.5 ,bgcolor:"primary.main"}} variant='middle'/>
                                             </center>
                                            :""}
                                          
                                        </Step>
                                    )
                                })}
                        </Stepper>
                    )}
                </Box>
                {withDivider && (
                    <Divider
                        sx={{ borderBottomWidth: 8, borderColor: '#F2F5F9' }}
                    />
                )}
            </Box>
            {children}
        </Box>
    )
}

const StepIconItem = (props) => {
    let { active, completed, className } = props

    return (
        <Box
            width={'20px'}
            height={'20px'}
            borderRadius={'50%'}
            backgroundColor={completed ? 'primary.main' : '#fff'}
            border={completed ? 'none' : `2px solid #C3CBD9`}
            borderColor={active ? 'primary.main' : '#C3CBD9'}
            display={'flex'}
            alignItems={'center'}
            fontSize={12}
            justifyContent={'center'}
            fontWeight={active || completed ? 'bold' : 'normal'}
            color={active ? 'primary.main' : completed ? '#fff' : '#C3CBD9'}
        >
            {completed ? <CheckIcon sx={{ fontSize: 16 }} /> : props.icon}
        </Box>
    )
}
