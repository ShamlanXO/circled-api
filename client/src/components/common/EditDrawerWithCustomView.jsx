import React, { Children, useState } from 'react';
import { Drawer, Button, TextField, TextareaAutosize, Stack ,Typography, Box, Divider, ButtonBase} from '@mui/material';


const CommonBottomDrawer = ({
  viewMode,

  title,
  value,
  label,
  view,
  onSave,
  field,
 
}) => {

   const [open,setOpen]=useState(false)
  const handleSave = () => {
    onSave&&onSave();

    setOpen(false)
  };

  return (
    <>
    <ButtonBase component={Box} onClick={()=>!viewMode&&setOpen(true)}>
        {view}
    </ButtonBase>
    {/* <Box>
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} mb={1}>
        <Typography variant="subtitle1">{label}</Typography>
        <ButtonBase onClick={()=>setOpen(true)} ><Typography color={"primary"} variant="subtitle1">Edit</Typography></ButtonBase>
       
      </Box>
      <Typography color={"text.secondary"} variant="body1">{value}</Typography>
    </Box> */}
    <Drawer anchor="bottom" open={open} onClose={()=>setOpen(false)} sx={{borderRadius:2}} PaperProps={{sx:{borderRadius:1}}}>
      <Box pb={4}>
        <Box px={3} pt={2} pb={2}>
        <Typography align='center'  variant='h3' sx={{fontSize:20}}>{title}</Typography>
        </Box>
        <Divider/>
      
        <Stack px={3}  >
       <Box sx={{my:4,mb:4}} display={"flex"} justifyContent={"center"}>    {field}</Box>
    
        <Button fullWidth variant="contained" color="primary" onClick={handleSave} sx={{mt:3}}>
          Save
        </Button>
        </Stack>

      
      </Box>
    </Drawer>
    </>
  );
};

export default CommonBottomDrawer;
