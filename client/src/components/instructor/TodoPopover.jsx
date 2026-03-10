/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */

import { ListItemButton, Popover, Typography } from "@mui/material";
import { useRef, useState } from "react";
import Iconify from "../Iconify";
import { useNavigate, useParams } from "react-router";
import EditIcon from "src/assets/IconSet/edit";
import DeleteIcon from "src/assets/IconSet/Delete";
export default function TodoPopover(props) {
  const [openedPopover, setOpenedPopover] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const popoverAnchor = useRef(null);

  return (
    <div>
      {" "}
      <span ref={popoverAnchor} onClick={() => setOpenedPopover(true)}>
        {props.children}
      </span>
      <Popover
        id="mouse-click-popover"
        open={openedPopover}
        onClose={() => setOpenedPopover(false)}
        anchorReference="anchorEl"
        anchorEl={popoverAnchor.current}
        PaperProps={{
          sx: {
            width: 175,
            borderRadius: 0.8,
            py: 1.5,
            boxShadow: (theme) => theme.customShadows.z20,
            border: (theme) => `solid 1px ${theme.palette.grey[500_12]}`,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ListItemButton
          onClick={() => {
            // setSelected(item);
            setOpenedPopover(false);
            props.onEdit();
          }}
          sx={{ py: 1.5 }}
        >
          <EditIcon />
          &nbsp;&nbsp;&nbsp;
          <Typography variant="subtitle1">Edit</Typography>
        </ListItemButton>

        <ListItemButton
          onClick={
            () => {
              props.onDelete();
              setOpenedPopover(false);
            }

            // setSelected(item);
          }
          sx={{ py: 1.5 }}
        >
          <DeleteIcon sx={{ color: "error.main" }} />
          &nbsp;&nbsp;
          <Typography variant="subtitle1" sx={{ color: "error.main" }}>
            Clear
          </Typography>
        </ListItemButton>
      </Popover>
    </div>
  );
}
