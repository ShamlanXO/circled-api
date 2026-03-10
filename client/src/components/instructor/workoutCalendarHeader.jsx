// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Avatar, Box, IconButton, ListItemButton, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import DurationPopover from './durationPopover';
import Label from '../Label';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
// ----------------------------------------------------------------------

import { useDispatch, useSelector } from 'react-redux';
import WorkoutIntensityPopOver from './calenderFormatPopover';
import { updateProgram } from 'src/redux/actions/createProgram';
const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 10px',
  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  //zIndex: 100,
  backgroundColor: '#fff',
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: '0px 0px 8px 8px',
}));

const InsideBoxStyle = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 52,
  paddingBottom: 24,
  zIndex: 100,
  top: 0,
}));

// ----------------------------------------------------------------------

export default function WorkoutCalendarHeader({ setHeaderDependency, mode }) {
  const [mini, setMini] = useState(false);
  const dispatch = useDispatch();
  const minimize = () => {
    setMini(!mini);
    setTimeout(() => {
      setHeaderDependency(new Date());
    }, 300);
  };

  const Program = useSelector((s) => s.NewProgram);

  const [selectedDuration, setSelectedDuration] = useState(Program.Duration ? Program.Duration : 1);
  const [selectedType, setSelectedType] = useState(Program.Type ? Program.Type : 'Easy');
  const handleSelectDuration = (val) => {
    setSelectedDuration(val);
    dispatch(
      updateProgram({
        Duration: val,
      }),
    );
  };
  const handleSelectType = (val) => {
    setSelectedType(val);
    dispatch(
      updateProgram({
        Type: val,
      }),
    );
  };
  return (
    <BoxHeader>
      {' '}
      {/* { mode!=="customize"&&<Typography align="center" variant="h4" sx={{fontWeight:500}} color="text.primary">
        Workout Calendar
      </Typography>} */}
      <div>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          px={2}
          py={2}
        >
          <Typography
            noWrap
            variant="h5"
            color="text.primary"
            sx={{ fontWeight: 500 }}
          >
            {Program.Title}
          </Typography>{' '}
          <Box display="flex">
            <Label color="primary">
              <Iconify
                icon="ic:round-calendar-month"
                width="20px"
                height="20px"
              />
              &nbsp;{Program.Duration}&nbsp;
              {Program.Duration == 1 ? 'week' : 'weeks'}
            </Label>
            &nbsp;&nbsp;
            <Label color="error">
              <Iconify
                icon="icon-park-outline:dumbbell"
                width="20px"
                height="20px"
              />
              &nbsp;{Program.Type}
            </Label>
          </Box>
        </Box>
      </div>
      {
        // <Collapse in={!mini}>
        //   <BoxStyle sx={{ justifyContent: "flex-start" }}>
        //     <Avatar
        //       variant="rounded"
        //       style={{
        //         width: "130px",
        //         height: "112px",
        //         backgroundColor: "#F3F5F8",
        //       }}
        //       src={Program.BannerImage}
        //     />
        //     <Box width="auto" marginLeft={2}>
        //       <Typography noWrap variant="h5" color="text.primary">
        //         {Program.Title}
        //       </Typography>{" "}
        //       <Typography
        //         variant="body1"
        //         color="text.secondary"
        //         sx={{ mb: 1 }}
        //         flexWrap={"wrap"}
        //       >
        //         {Program.Description}
        //       </Typography>
        //       <Box display="flex" flexWrap={"wrap"}>
        //         <Box sx={{ m: 0.4 }}>
        //           <Label color="primary">
        //             <Iconify
        //               icon="ic:round-calendar-month"
        //               width="20px"
        //               height="20px"
        //             />
        //             &nbsp;{Program.Duration}&nbsp;
        //             {Program.Duration == 1 ? "week" : "weeks"}
        //           </Label>
        //         </Box>
        //         <Box sx={{ m: 0.4 }}>
        //           <Label color="error">
        //             <Iconify
        //               icon="icon-park-outline:dumbbell"
        //               width="20px"
        //               height="20px"
        //             />
        //             &nbsp;{Program.Type}
        //           </Label>
        //         </Box>
        //       </Box>
        //     </Box>
        //   </BoxStyle>
        // </Collapse>
      }
      {/* <Box display="flex" justifyContent={"center"}>
        <IconButton onClick={minimize}>
          <Iconify
            icon={
              mini
                ? "ic:round-keyboard-arrow-down"
                : "ic:round-keyboard-arrow-up"
            }
            width="24px"
            height="24px"
          />
        </IconButton>
      </Box> */}
    </BoxHeader>
  );
}
