import { Box, Button, Divider, Drawer, Typography } from '@mui/material'
import React, { useState } from 'react'
import ProgramListView from './ProgramListView'
import SendProgramPage from './SendProgramDrawer'
import { useNavigate } from 'react-router'
function ActionBottomDrawer(props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState(null)

    const navigate = useNavigate()
    const toggleDrawer = (isOpen) => (event) => {

        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setDrawerOpen(isOpen)
        setSelectedProgram(null)
    }

 let  onClickDone=()=>{
          navigate(`/sendProgram/${selectedProgram?._id}`,{
                            state:{
                                email:props.email
                            }
                        })
    }

    return (
        <div>
            <Drawer
                anchor={'bottom'}
                PaperProps={{
                    style: {
                        backgroundColor: '#fff',
                        boxShadow: 'none',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                    },
                }}
                disableBackdropTransition
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Box
                    padding={'24px 24px 0px'}
                    style={{
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        backgroundColor: '#fff',
                         maxHeight:'70vh',
                         overflowY:'auto'
                    }}
                >
                    <Box display="flex" flexDirection="column" component="form">
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            <Typography variant="h3">
                                {/* {selectedProgram?"Enter details":""} */}
                            </Typography>
                        </Box>

                       {props?.title&& <Divider sx={{ my: 1,mb:2 }} />}
                       <ProgramListView 
                     //withCheckbox
                     withtotalClients={true}
                       onClick={(program) => {
                        navigate(`/sendProgram/${program._id}`,{
                            state:{
                                email:props.email
                            }
                        })
                        //setSelectedProgram(program)
                       }}
                       selected={selectedProgram}
                       programs={props.programs} />
                     {/* {selectedProgram?
                     <SendProgramPage  
                     handleDone={()=>{
                            setDrawerOpen(false)
                            props.reload()
                            setSelectedProgram(null)
                        }}
                     Program={selectedProgram}
                     email={props.email}
                     
                     /> :}
                        */}
                    </Box>
               
                </Box>
                {/* <Box sx={{
                    boxShadow: "0px 4px 54px 0px #E1E7F0",
                    borderRadius: "24px 24px 0px 0px",
                }} width={"100%"} backgroundColor={"#fff"} justifyContent={"flex-end"} display={"flex"} pt={2} pb={4} px={3}>
                <Button onClick={onClickDone} variant='contained' disabled={!selectedProgram}>
                        Done
                    </Button>
                    </Box> */}
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
