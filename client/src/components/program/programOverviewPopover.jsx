/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  ListItemButton,
  Popover,
  Popper,
  Radio,
  Typography,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import { useRef, useState } from 'react';
import Iconify from '../Iconify';
import { useNavigate, useParams } from 'react-router';
import { deleteProgram } from 'src/redux/actions/createProgram';
import MailIcon from 'src/assets/IconSet/Email';
import ShareIcon from 'src/assets/IconSet/Share';
import QrIcon from 'src/assets/IconSet/Qrcode';
import EditIcon from 'src/assets/IconSet/edit';
import UnarchiveIcon from 'src/assets/IconSet/CheckDoc';
import ArchiveIcon from 'src/assets/IconSet/Archive';
import CopyLink from 'src/assets/IconSet/CopyLink';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeCanvas } from 'qrcode.react';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch } from 'react-redux';

export default function ProgramOverviewPopover(props) {
  const [openedPopover, setOpenedPopover] = useState(false);
  const [openQrDrawer, setOpenQrDrawer] = useState(false);
  const navigate = useNavigate();
  const allOption = ['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'];
  const [selected, setSelected] = useState('4 Weeks');
  const { id } = useParams();
  const popoverAnchor = useRef(null);

  const deleteProgramById = () => {
    props.deleteProgram(id);
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
          sx={{ py: 1.5 }}
          onClick={() => {
            // setSelected(item);
            setOpenedPopover(false);
            navigate('/sendProgram/' + id);
          }}
        >
          <MailIcon />
          &nbsp;&nbsp;&nbsp;
          <Typography>Send</Typography>
        </ListItemButton>
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
          <Typography>Edit</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ py: 1.5 }}
          onClick={
            () => {
              props.shareWorkout();
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
          onClick={
            () => {
              props.copyWorkout();
              setOpenedPopover(false);
            }
            // setSelected(item);
          }
        >
          <CopyLink />
          &nbsp;&nbsp;&nbsp;
          <Typography>Copy link</Typography>
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
          <Typography>QR code</Typography>
        </ListItemButton>
        {props.program.IsArchived ? (
          <ListItemButton
            onClick={() => {
              // setSelected(item);
              props.unArchive(id);
            }}
            sx={{ py: 1.5 }}
          >
            <UnarchiveIcon />
            &nbsp;&nbsp;&nbsp;
            <Typography color={'text.primary'}>Un-archive</Typography>
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={() => {
              // setSelected(item);
              props.deleteProgram(id);
            }}
            sx={{ py: 1.5 }}
          >
            <ArchiveIcon />
            &nbsp;&nbsp;&nbsp;
            <Typography color={'text.primary'}>Archive</Typography>
          </ListItemButton>
        )}
      </Popover>
      <QrCodeBottomDrawer
        open={openQrDrawer}
        onClose={() => setOpenQrDrawer(false)}
        program={props.program}
      />
    </div>
  );
}

const QrCode = (props) => {
  const qrRef = useRef(null);
  const programUrl = window.location.origin + `/public/workout-program/${props.program._id}`;

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = `${props.program.Title}-qr-code.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div ref={qrRef}>
        <QRCodeCanvas
          value={programUrl}
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
        Anyone scanning your QR code can view your circled program.
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

const QrCodeBottomDrawer = ({ open, onClose, program }) => {
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
        style={
          program.BannerImage
            ? {
                backgroundImage: `url(${program.BannerImage || '/images/profile-banner.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: 140,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                marginBottom: 16,
              }
            : {}
        }
        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}
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
        <Box sx={{ pb: 1 }}>
          <Avatar
            src={'/logo/circled_fade.png'}
            sx={{ width: 75, height: 75 }}
          />
        </Box>
        <Typography
          sx={{ fontWeight: 600, fontSize: 24, textTransform: 'capitalize' }}
          variant="h3"
        >
          {program.Title}
        </Typography>
        <Typography color="text.secondary">Program QR Code</Typography>
      </Stack>
      <QrCode program={program} />
    </Drawer>
  );
};
