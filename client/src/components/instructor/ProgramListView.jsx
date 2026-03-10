// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../Page";
// sections
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemButton,
  Button,
  Stack,
  Typography,
  Checkbox
} from "@mui/material";
import { useState, useEffect } from "react";
import { IconButtonAnimate, varFade } from "../animate";
import Iconify from "../Iconify";
import DurationPopover from "./durationPopover";
import Label from "../Label";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import DraftedProgramBottomDrawer from "src/components/instructor/DraftedProgramBottomDrawer";
import ProgOptionDrawer from "src/components/instructor/Progoption";
import TextMaxLine from "../TextMaxLine";
import { useNavigate } from "react-router";
import { useConfirmationModalContext } from 'src/utils/Modal'
import { useDispatch, useSelector } from 'react-redux'
import Icon_AddProgramImg from "src/assets/createProgram/Icon_AddProgram2";
import { format } from "date-fns";
import More from "src/assets/IconSet/More";
import Client from "src/assets/IconSet/Client";
import { deleteProgram } from 'src/redux/actions/createProgram'
import { getAllPrograms } from 'src/redux/actions/createProgram'

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  // alignItems: "center",
  margin: "24px 0 24px 0",
  
  borderRadius: 4,
  cursor: "pointer",
  // ":hover": {
  //   boxShadow: "0px 4px 54px rgba(225, 231, 240, 1)",
  // },
}));
const BoxHeader = styled(Box)(() => ({
  width: "100%",
  //zIndex: 100,
  backgroundColor: "#fff",
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: "0px 0px 8px 8px",
}));

// ----------------------------------------------------------------------

export default function InstructorPrograms({ programs, unarchiveProgram,onClick ,status,reload , onDelete,withtotalClients,withCheckbox,selected}) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { showConfirmationModal } = useConfirmationModalContext()
  const onDeleteProgram = (id) => {
    
    showConfirmationModal(
        'Are you sure?',
        `You are going to delete this workout program. This process is irreversible`,
        'Delete'
    ).then((res) => {
        if (res) {
           onDelete(id)
        }
    })
}
  return (
    <BoxHeader>
      {programs.map((item, index) => (
        <>
         
            <BoxStyle
              sx={{ justifyContent: "flex-start" }}
          onClick={() => onClick?onClick(item):null}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Avatar
                  variant="rounded"
                  style={{
                    width: "132px",
                    height: "88px",
                    backgroundColor: "#F3F5F8",
                    objectFit: "cover",
                  }}
                  src={item.BannerImage || "/images/DefaultThumbnail.png"}
                />

                {/* <Icon_AddProgramImg
                    sx={{
                      width: "142px",
                      height: "88px",
                    }}
                  /> */}

               
              </Box>
              <Box
                marginLeft={2}
                width={"100%"}
                display={"flex"}
                flexDirection={"column"}
                
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"flex-end"}
                  position={"relative"}
                >
                  <TextMaxLine
                    // onClick={() =>
                    //   !item.IsDraft
                    //     ? navigate("/programOverview/" + item._id)
                    //     : null
                    // }
                    variant="h6"
                    line={1}
                    sx={{
                      textTransform: "capitalize",
                      color: "text.primary",
                      maxWidth: item.IsDraft ? "100%" : "85%",
                    }}
                  >
                    {item.Title}
                  </TextMaxLine>{" "}
                
                </Box>
                {!status ? (
                  <Stack spacing={0.1}>
                    {/* <Typography
                      variant="body2"
                      color={item.IsDraft ? "grey.400" : "text.primary"}
                      flexWrap={"wrap"}
                      // onClick={() =>
                      //   !item.IsDraft && !item.IsArchived
                      //     ? navigate("/programOverview/" + item._id)
                      //     : null
                      // }
                    >
                      Earned this month: ${item?.payment?.[0]?.sum || 0}
                    </Typography> */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        variant="body2"
                        color={item.IsDraft ? "grey.400" : "text.primary"}
                        flexWrap={"wrap"}
                        // onClick={() =>
                        //   !item.IsDraft && !item.IsArchived
                        //     ? navigate("/programOverview/" + item._id)
                        //     : null
                        // }
                      >
                        Price : {item.IsDraft ? "N/A" : "$" + item.Price}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color={item.IsDraft ? "grey.400" : "text.primary"}
                      flexWrap={"wrap"}
                      // onClick={() =>
                      //   !item.IsDraft && !item.IsArchived
                      //     ? navigate("/programOverview/" + item._id)
                      //     : null
                      // }
                    >
                      Created : {format(new Date(item.createdAt), "dd-MM-yyyy")}
                    </Typography>
                   {withtotalClients&& <Typography
                      variant="body2"
                      color={item.IsDraft ? "grey.400" : "text.primary"}
                      flexWrap={"wrap"}
                      // onClick={() =>
                      //   !item.IsDraft && !item.IsArchived
                      //     ? navigate("/programOverview/" + item._id)
                      //     : null
                      // }
                    >
                      Total client : {item.IsDraft ? "N/A" : item.clients}
                    </Typography>}
                  </Stack>
                ) : (
                
                    <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                    >
                      <Typography
                      color={"text.secondary"}
                      component={'span'}
                      >(Program sent)</Typography> 
<IconButton    onClick={(e)=>{
                        e.stopPropagation()
                        onDeleteProgram(item._id)}}>
<Iconify  icon="ic:round-close" sx={{
                                                            fontSize:24,
                                                            color:"error.main"
                                                           }}/>
</IconButton>
    
                  </Stack>

                )}
               
              </Box>
              {withCheckbox&&<Checkbox checked={selected?._id==item?._id} color="primary" checkedIcon={<CheckCircleIcon/>} icon={<RadioButtonUncheckedIcon/>} size="large" sx={{width:36,height:36,borderRadius:"50%"}}/>}
            </BoxStyle>
         
          {index !== programs.length - 1 && (
            <Divider sx={{ borderBottomColor: "#E1E7F0" }} />
          )}
        </>
      ))}
    </BoxHeader>
  );
}
