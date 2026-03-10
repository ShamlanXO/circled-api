// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Avatar, Box, Divider, IconButton, ListItemButton, Stack, Chip, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import DurationPopover from './durationPopover';
import Label from '../Label';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import DraftedProgramBottomDrawer from 'src/components/instructor/DraftedProgramBottomDrawer';
import ProgOptionDrawer from 'src/components/instructor/Progoption';
import TextMaxLine from '../TextMaxLine';
import { useNavigate } from 'react-router';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Icon_AddProgramImg from 'src/assets/createProgram/Icon_AddProgram2';
import { format } from 'date-fns';
import More from 'src/assets/IconSet/More';
import Client from 'src/assets/IconSet/Client';
import { deleteProgram } from 'src/redux/actions/createProgram';
import { getAllPrograms } from 'src/redux/actions/createProgram';
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  'display': 'flex',
  'justifyContent': 'space-between',
  // alignItems: "center",
  'margin': '8px 0 24px 0',

  'borderRadius': 4,
  'cursor': 'pointer',
  ':hover': {
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 1)',
  },
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  //zIndex: 100,
  backgroundColor: '#fff',
  //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
  borderRadius: '0px 0px 8px 8px',
}));

// ----------------------------------------------------------------------

export default function InstructorPrograms({ programs, unarchiveProgram }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirmationModal } = useConfirmationModalContext();
  const onDeleteDay = (id) => {
    showConfirmationModal(
      'Are you sure?',
      `You are going to delete this workout program. This process is irreversible`,
      'Delete',
    ).then((res) => {
      if (res) {
        dispatch(deleteProgram(id)).then((res) => {
          dispatch(getAllPrograms());
        });
      }
    });
  };
  return (
    <BoxHeader>
      {programs.map((item, index) => (
        <>
          <BoxStyle
            id={item._id}
            sx={{ justifyContent: 'flex-start' }}
            onClick={() => (!item.IsDraft ? navigate('/programOverview/' + item._id) : null)}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              position={'relative'}
            >
              <Avatar
                variant="rounded"
                style={{
                  width: '140px',
                  height: '100px',
                  backgroundColor: '#F3F5F8',
                  objectFit: 'cover',
                }}
                src={item.BannerImage || '/images/DefaultThumbnail.png'}
              />
              {item.ProgramType == 'Private' ? (
                <Chip
                  label={'Private'}
                  sx={{
                    background: '#0D498F',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: '2px solid #fff',
                    borderRadius: '0px 0px 8px 8px',
                    position: 'absolute',
                    width: '100%',
                    overflow: 'hidden',
                    bottom: 0,
                  }}
                />
              ) : (
                ''
              )}
              {/* <Icon_AddProgramImg
                    sx={{
                      width: "142px",
                      height: "88px",
                    }}
                  /> */}

              {/* {!item.IsDraft  && (
                  <ProgOptionDrawer
                    unarchiveProgram={unarchiveProgram}
                    Program={item}
                    id={item._id}
                  >
                    <More
                      sx={{ color: "text.primary", pt: 2 }}
                      style={{ fontSize: 32 }}
                      color="text.primary"
                    />
                  </ProgOptionDrawer>
                )} */}
            </Box>
            <Box
              marginLeft={2}
              width={'100%'}
              display={'flex'}
              flexDirection={'column'}
            >
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                position={'relative'}
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
                    textTransform: 'capitalize',
                    color: 'text.primary',
                    maxWidth: '85%',
                  }}
                >
                  {item.Title}
                </TextMaxLine>{' '}
                {item.IsDraft ? (
                  <Iconify
                    icon="akar-icons:trash-can"
                    color="error.main"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDay(item._id);
                    }}
                    sx={{
                      fontSize: 20,
                      top: 0,
                      right: 0,

                      position: 'absolute',
                    }}
                  />
                ) : (
                  <ProgOptionDrawer
                    unarchiveProgram={unarchiveProgram}
                    Program={item}
                    id={item._id}
                  >
                    <More
                      sx={{ color: 'text.primary' }}
                      style={{ fontSize: 24 }}
                      color="text.primary"
                    />
                  </ProgOptionDrawer>
                )}
              </Box>
              {!item.IsDraft ? (
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
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color={item.IsDraft ? 'grey.400' : 'text.primary'}
                      flexWrap={'wrap'}
                      // onClick={() =>
                      //   !item.IsDraft && !item.IsArchived
                      //     ? navigate("/programOverview/" + item._id)
                      //     : null
                      // }
                    >
                      Price : {item.IsDraft ? 'N/A' : '$' + item.Price}
                    </Typography>
                  </Stack>
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
                      Total weeks : {item.weeks}
                    </Typography> */}
                  <Typography
                    variant="body2"
                    color={item.IsDraft ? 'grey.400' : 'text.primary'}
                    flexWrap={'wrap'}
                    // onClick={() =>
                    //   !item.IsDraft && !item.IsArchived
                    //     ? navigate("/programOverview/" + item._id)
                    //     : null
                    // }
                  >
                    Created : {format(new Date(item.createdAt), 'dd-MM-yyyy')}
                  </Typography>
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
                      Total client : {item.IsDraft ? "N/A" : item.clients}
                    </Typography> */}
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    color={'text.secondary'}
                    flexWrap={'wrap'}
                  >
                    Created : {format(new Date(item.createdAt), 'dd-MM-yyyy')}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={'primary.main'}
                    flexWrap={'wrap'}
                    onClick={() => navigate(`/editProgram/${item._id}/publishProgram`)}
                    sx={{ mt: 1, fontWeight: 500 }}
                  >
                    Continue building
                  </Typography>
                </>
              )}
              {!item.IsDraft && (
                <Box
                  display="flex"
                  alignItems={'center'}
                  sx={{ mt: 0.5 }}
                  // onClick={() =>
                  //   !item.IsDraft && !item.IsArchived
                  //     ? navigate("/programOverview/" + item._id)
                  //     : null
                  // }
                >
                  <Client
                    width="12px"
                    height="12px"
                    style={{ fontSize: 18 }}
                    color={item.IsDraft ? 'grey.400' : 'text.primary'}
                  />
                  &nbsp;
                  <Typography
                    variant="body2"
                    color={item.IsDraft ? 'grey.400' : 'text.primary'}
                    flexWrap={'wrap'}
                  >
                    Total athletes {item.IsDraft ? 'N/A' : item.clients}
                  </Typography>
                </Box>
              )}
            </Box>
          </BoxStyle>

          {/* {index !== programs.length - 1 && (
            <Divider sx={{ borderBottomColor: "#E1E7F0" }} />
          )} */}
        </>
      ))}
    </BoxHeader>
  );
}
