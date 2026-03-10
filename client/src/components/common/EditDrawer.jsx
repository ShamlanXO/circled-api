import React, { Children, useState } from 'react';
import { Drawer, Button, TextField, TextareaAutosize, Stack ,Typography, Box, Divider, ButtonBase} from '@mui/material';


const CommonBottomDrawer = ({


  title,
  value,
  label,
  onSave,
  field,
  isEditOpen,
  setEditOpen
}) => {

   const [open,setOpen]=useState(false)
  const handleSave = () => {
    onSave();
    setEditOpen(false)
    setOpen(false)
  };

  return (
    <>
    <Box>
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} mb={1}>
        <Typography variant="subtitle1">{label}</Typography>
        
      {!open?  <ButtonBase disabled={isEditOpen} onClick={()=>{setOpen(true);setEditOpen(true)}} ><Typography sx={{opacity:isEditOpen?0.5:1}} color={"primary"} variant="subtitle1">Edit</Typography></ButtonBase>:
     <ButtonBase onClick={()=>setOpen(false)} ><Typography color={"primary"} variant="subtitle1">Cancel</Typography></ButtonBase>}
       
      </Box>
     {open?
     
     <Box >
   
   
     <Stack  >
    <Box >    {field}</Box>
 
     <Button  size='small' sx={{width:120,mt:3}} variant="contained" color="primary" onClick={handleSave}>
       Save
     </Button>
     </Stack>

   
   </Box>
     
     : <Typography color={"text.secondary"} variant="body1">{value}</Typography>}
    </Box>

     
 
    </>
  );
};

export default CommonBottomDrawer;
