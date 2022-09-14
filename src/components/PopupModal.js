import { Box, Modal, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0);
  opacity: 0.1;
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 300,
  bgcolor: "background.paper",

  p: 2,
  px: 4,
  pb: 3,
  borderRadius: "10px",
};

const styleForImage = {
  width: "40%",
  textAlign: "center",
  display: "block",
  p: 2,
  px: 4,
  pb: 3,
  borderRadius: "10px",
  outline: "none",
};

const PopupModal = ({ postModalOpen, handleClose, modalType, children }) => {
  console.log("chinredn", modalType);
  return (
    <div>
      <StyledModal
        open={postModalOpen}
        onClose={handleClose}
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        BackdropComponent={Backdrop}
      >
        <Box sx={modalType === "image" ? styleForImage : style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              fontSize: "14px",
              marginLeft: "5px",
            }}
          >
            {children}
          </Typography>
        </Box>
      </StyledModal>
    </div>
  );
};

export default PopupModal;
