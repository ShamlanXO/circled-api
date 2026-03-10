import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";

const ConfirmationModalContext2 = React.createContext({});

const ConfirmModal = (props) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [b1, setb1] = useState("");
  const [b2, setb2] = useState("");
  const resolver = useRef();

  const handleShow = (t = "", s = "", b1 = "", b2 = "") => {
    setTitle(t);
    setSubTitle(s);
    setb1(b1);
    setb2(b2);
    setShowConfirmationModal(true);

    return new Promise(function (resolve) {
      resolver.current = resolve;
    });
  };

  const handleOk = () => {
    resolver.current && resolver.current(true);
    setShowConfirmationModal(false);
  };

  const handleCancel = () => {
    resolver.current && resolver.current(false);
    setShowConfirmationModal(false);
  };

  return (
    <ConfirmationModalContext2.Provider
      value={{ showConfirmationModal: handleShow }}
    >
      {props.children}

      <Dialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        style={{ borderRadius: 32, paddingBottom: 16 }}
        maxWidth={"xs"}
      >
        {title && (
          <DialogTitle
            id="alert-dialog-title"
            style={{ fontWeight: "bold", fontSize: 24,lineHeight:1.4 }}
          >
           
              {title ? title : "Are you sure you want to delete?"}
      
          </DialogTitle>
        )}
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ fontSize: 18, color: "#172A44" ,marginTop:16}}
          >
            {subTitle ? subTitle : "This operation is irreersible"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleOk}
            color="primary"
            size="small"
            sx={{ fontSize: 16 }}
          >
            {b1 ? b1 : "Replace"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCancel}
            color="primary"
            autoFocus
            sx={{ fontSize: 16, px: 1 }}
          >
            {b2 ? b2 : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationModalContext2.Provider>
  );
};

export const useConfirmationModalContext = () =>
  useContext(ConfirmationModalContext2);

export default ConfirmModal;
