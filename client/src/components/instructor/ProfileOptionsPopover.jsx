/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { ListItemButton, Popover, Typography, Box, Button, Drawer, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate, useParams } from 'react-router';
import { Stack, Avatar } from '@mui/material';
import MailIcon from 'src/assets/IconSet/Email';
import ShareIcon from 'src/assets/IconSet/Share';
import QrIcon from 'src/assets/IconSet/Qrcode';
import EditIcon from 'src/assets/IconSet/edit';
import UnarchiveIcon from 'src/assets/IconSet/CheckDoc';
import CopyLinkIcon from 'src/assets/IconSet/CopyLink';
import { updateFeedback } from 'src/redux/actions/feedback';
import { useDispatch } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';

export default function ProgramOverviewPopover(props) {
  const dispatch = useDispatch();

  const [openedPopover, setOpenedPopover] = useState(false);
  const navigate = useNavigate();
  const [openQrDrawer, setOpenQrDrawer] = useState(false);
  const { id } = useParams();
  const popoverAnchor = useRef(null);
  const copyProfile = (e) => {
    e.stopPropagation();
    setOpenedPopover(false);
    navigator.clipboard.writeText(window.location.origin + `/public/instructor-profile/${props.profile._id}`);

    dispatch(updateFeedback({ snackbar: true, message: 'Copied' }));
  };

  const shareWorkout = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: `Circled Fitness Instructor :${props.profile.name}`,
          url: `/public/instructor-profile/${props.profile._id}`,
        })
        .then(() => {});
    }
  };
  return (
    <div>
      {' '}
      <span
        ref={popoverAnchor}
        onClick={() => setOpenedPopover(true)}
      >
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
            borderRadius: 2,
            boxShadow: (theme) => theme.customShadows.z20,
            border: (theme) => `solid 1px ${theme.palette.grey[500_12]}`,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ListItemButton
          onClick={copyProfile}
          sx={{ py: 1.5 }}
        >
          <CopyLinkIcon />
          &nbsp;&nbsp;&nbsp;
          <Typography>Copy link</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ py: 1.5 }}
          onClick={
            (e) => {
              shareWorkout(e);
              // props.shareWorkout()
              setOpenedPopover(false);
            }
            // setSelected(item);
          }
        >
          <ShareIcon />
          &nbsp;&nbsp;&nbsp;
          <Typography>Share</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ py: 1.5 }}
          onClick={() => {
            setOpenQrDrawer(true);
            setOpenedPopover(false);
          }}
        >
          <QrIcon />
          &nbsp;&nbsp;&nbsp;
          <Typography>QR Code</Typography>
        </ListItemButton>
      </Popover>
      <QrCodeBottomDrawer
        open={openQrDrawer}
        onClose={() => setOpenQrDrawer(false)}
        profile={props.profile}
      />
    </div>
  );
}

const QrCode = (props) => {
  const qrRef = useRef(null);
  const profileUrl = window.location.origin + `/public/instructor-profile/${props.profile._id}`;

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = `${props.profile.name}-qr-code.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div ref={qrRef}>
        <QRCodeCanvas
          value={profileUrl}
          size={200}
          level={'H'}
          fgColor="#2B4057"
          imageSettings={{
            src: '/logo/circled_black.png',
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>
      <Typography
        color="text.secondary"
        align="center"
      >
        Anyone scanning your QR code can access your circled profile.
      </Typography>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={downloadQR}
        sx={{ borderRadius: 1 }}
      >
        Download QR Code
      </Button>
    </Box>
  );
};

const QrCodeBottomDrawer = ({ open, onClose, profile }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="bottom"
      PaperProps={{
        sx: { borderTopLeftRadius: 1, borderTopRightRadius: 1, pb: 2 },
      }}
    >
      <Box
        px={1}
        py={1}
        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Avatar
          src={profile.profilePic}
          sx={{ width: 90, height: 90 }}
        />
        <Typography
          sx={{ fontWeight: 600, fontSize: 24 }}
          variant="h3"
        >
          {profile.name}
        </Typography>
        <Typography color="text.secondary">Circled profile</Typography>
      </Stack>
      <QrCode profile={profile} />
    </Drawer>
  );
};
