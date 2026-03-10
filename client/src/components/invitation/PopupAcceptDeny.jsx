import React, { useEffect,useState } from 'react';
import { DialogAnimate } from 'src/components/animate';
import { Button, DialogActions, Box,DialogContent, DialogContentText, DialogTitle ,Avatar, Typography} from '@mui/material';
import { fetchInvitations , acceptInvitation , rejectInvitation} from 'src/redux/actions/invite';
import { useDispatch } from 'react-redux';


export default function AcceptInvitation() {

    const [isOpen, setIsOpen] = React.useState(false);
    const [invitation, setInvitation] = React.useState(null);
    const dispatch = useDispatch();
    useEffect(() => {

        setTimeout(() => {
            dispatch(fetchInvitations()).then((res) => {
                if (res.length > 0) {
                    setInvitation(res[0]);
                    setIsOpen(true);
                }
            });
        },1000)
       
     
    }
        , [])

        const accept=(id)=>{
            setIsOpen(false)
            dispatch(acceptInvitation(id)).then(res=>{
                setIsOpen(false)
            })
        }

        const reject=(id)=>{
            setIsOpen(false)
            dispatch(rejectInvitation(id)).then(res=>{
                setIsOpen(false)
            })
        }


const onClose=()=>{
    setIsOpen(false)
}


    return (
<DialogAnimate open={isOpen} onClose={onClose} >
        <DialogTitle id="alert-dialog-title">Invitation</DialogTitle>
        <DialogContent>
            <Box display={"flex"} alignItems={"center"} my={2}>
            <Avatar src={invitation?.invitedBy?.profilePic}  sx={{mr:1}} />
            <Typography variant={"h6"} sx={{textTransform:"capitalize"}}>{invitation?.invitedBy?.name}</Typography>
            </Box>
          <DialogContentText id="alert-dialog-description" color={"text.primary"}>
       Wants you to be on his client list. Accepting will allow the trainer to view your fitness information.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={
                ()=>{reject(invitation._id)}
          } variant={"outlined"} 
          >Reject</Button>
          <Button variant="contained" onClick={
                ()=>{accept(invitation._id)}
          } autoFocus>
            Accept
          </Button>
        </DialogActions>
      </DialogAnimate>
    );
    }