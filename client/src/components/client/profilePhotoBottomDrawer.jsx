import {
    Box,
    Button,
    Divider,
    Radio,
    SwipeableDrawer,
    Typography,
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router";

  import { useConfirmationModalContext } from "src/utils/Modal";
  import { useDispatch ,useSelector} from "react-redux";
  import Checkbox from '@mui/material/Checkbox';
import moment from "moment";
import {deleteBodyImages} from "src/redux/actions/BodyImages"

  
  function ProfilePhotoBottomDrawer(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {images,weight,createdAt,_id}=props.item
    const {showConfirmationModal} =useConfirmationModalContext()
    const toggleDrawer = (isOpen) => (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
  
      setDrawerOpen(isOpen);
    };
  
const onEdit=()=>{
    navigate(`/myProfile/photos/uploadNew`,{state:{mode:"edit",item:props.item}})
}
const removeItem=()=>{
  showConfirmationModal("Are you sure?",`You are going to delete these photos`,"Delete").then(res=>{
    if(res){
      deleteBodyImages(_id).then(respon=>{
        setDrawerOpen(false);
      })
    }
  
  })
}
  
  
    return (
      <div>
        <SwipeableDrawer
          anchor={"bottom"}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
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
            padding={"24px 24px 36px"}
            style={{
              borderTopLeftRadius: "30px",
              borderTopRightRadius: "30px",
              backgroundColor: "#fff",
            }}
          >
            <Box display="flex" flexDirection="column" component="form">
              <Typography variant="h6" color="text.primary">
                Weight {weight}kg&nbsp;
                <Typography component={"span"} variant="body2" color="primary">
                  / {moment(createdAt).format("DD/MM/YYYY")}
                </Typography>
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="16px"
                alignItems={"center"}
              >
                <Box display="flex" alignItems={"center"} >
                  <Typography sx={{fontWeight:"bold"}} variant="subtitle1" color="text.primary">
                    Number of images: {images.length}
                  </Typography>
                  &nbsp;&nbsp;
                
                
                </Box>
                <Box>
                <Button color="primary" sx={{px:0.5}} onClick={onEdit}>
                  <Typography align="center"  variant="body1">
                    Edit
                  </Typography>
                </Button>
                <Button size={"small"} sx={{p:0}} color="error" onClick={removeItem} >
                  <Typography align="center" sx={{fontWeight:"400"}} variant="body1">
                    Remove
                  </Typography>
                </Button>
                </Box>
              </Box>
  
              {/* <Divider sx={{ my: 1 }} />
              <Box display="flex" alignItems={"center"}>
       
              
              </Box> */}
            </Box>
          </Box>
        </SwipeableDrawer>
        <div onClick={() =>setDrawerOpen(true)}>{props.children}</div>
      </div>
    );
  }
  
  export default ProfilePhotoBottomDrawer;
  