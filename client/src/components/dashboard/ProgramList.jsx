// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Avatar, Box, Divider, IconButton, ListItemButton, Stack, Button, Typography, Collapse } from '@mui/material';
import Iconify from '../Iconify';
import { useState } from 'react';
import { IconButtonAnimate, varFade } from '../animate';

import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import Icon_AddProgramImg from 'src/assets/createProgram/Icon_AddProgram2';
// ----------------------------------------------------------------------

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  margin: '24px 0',
  maxWidth: 'xs',
  zIndex: 100,
}));
const WorkoutDay = styled(Box)(() => ({
  display: 'flex',
  width: '280px',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 100,
  backgroundColor: '#fff',
  padding: '5px 10px',
  margin: '12px 0',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '8px',
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

export default function ProgramList(props) {
  const { page, showall } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
      {props.programs.map((item) => (
        <>
          <BoxStyle
            onClick={() => (props.onClickItem ? props.onClickItem() : navigate(`/public/workout-program/${item._id}`))}
          >
            <Box>
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

              {/* // <Icon_AddProgramImg
                //   sx={{
                //     width: "129px",
                //     height: "112px",
                //   }}
                // /> */}
            </Box>
            {page == 'clientProfile' ? (
              <Box
                width="auto"
                marginLeft={1}
              >
                <Typography
                  color="text.primary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {item.Title}
                </Typography>{' '}
                <Typography
                  color="primary"
                  sx={{ textTransform: 'capitalize', lineHeight: 1 }}
                >
                  Subscribed
                </Typography>{' '}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1 }}
                >
                  Activated on {format(new Date(item.createdAt), 'dd MMM yyyy')}
                </Typography>
              </Box>
            ) : (
              <Stack
                width="auto"
                marginLeft={2}
                spacing={0}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {item.Title}
                </Typography>{' '}
                <Typography
                  variant="body2"
                  color={item.IsDraft ? 'grey.400' : 'text.primary'}
                  flexWrap={'wrap'}
                >
                  Price : {item.IsDraft ? 'N/A' : '$' + item.Price}
                </Typography>
                <Typography
                  variant="body2"
                  color={item.IsDraft ? 'grey.400' : 'text.primary'}
                  flexWrap={'wrap'}
                >
                  Duration : {item.Duration || 0} weeks
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 0.5 }}
                >
                  Created: {format(new Date(item.createdAt), 'PPP')}
                </Typography>
              </Stack>
            )}
          </BoxStyle>
          {/* <Divider sx={{ py: 0.5, borderColor: "#E1E7F0" }} /> */}
        </>
      ))}
      <Collapse in={open}>
        {props.programs.map((item) => (
          <>
            <BoxStyle
              onClick={() =>
                props.onClickItem ? props.onClickItem() : navigate(`/public/workout-program/${item._id}`)
              }
            >
              <Box>
                <Avatar
                  variant="rounded"
                  style={{
                    width: '115px',
                    height: '94px',
                    backgroundColor: '#F3F5F8',
                    objectFit: 'cover',
                  }}
                  src={item.BannerImage || '/images/DefaultThumbnail.png'}
                />

                {/* // <Icon_AddProgramImg
                //   sx={{
                //     width: "129px",
                //     height: "112px",
                //   }}
                // /> */}
              </Box>
              {page == 'clientProfile' ? (
                <Box
                  width="auto"
                  marginLeft={1}
                >
                  <Typography
                    color="text.primary"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.Title}
                  </Typography>{' '}
                  <Typography
                    color="primary"
                    sx={{ textTransform: 'capitalize', lineHeight: 1 }}
                  >
                    Subscribed
                  </Typography>{' '}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1 }}
                  >
                    Activated on {format(new Date(item.createdAt), 'dd MMM yyyy')}
                  </Typography>
                </Box>
              ) : (
                <Stack
                  width="auto"
                  marginLeft={2}
                  spacing={0}
                >
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.Title}
                  </Typography>{' '}
                  <Typography
                    variant="body2"
                    color={item.IsDraft ? 'grey.400' : 'text.primary'}
                    flexWrap={'wrap'}
                  >
                    Price : {item.IsDraft ? 'N/A' : '$' + item.Price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={item.IsDraft ? 'grey.400' : 'text.primary'}
                    flexWrap={'wrap'}
                  >
                    Duration : {item.Duration || 0} weeks
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mt: 0.5 }}
                  >
                    Created: {format(new Date(item.createdAt), 'PPP')}
                  </Typography>
                </Stack>
              )}
            </BoxStyle>
            {/* <Divider sx={{ py: 0.5, borderColor: "#E1E7F0" }} /> */}
          </>
        ))}
      </Collapse>

      {/* {props.programs.length>3&&   !showall&& <center><Button onClick={()=>navigate(`/public/trainer-programs/${props.instructorId}`)}>
                    {open ?   <Typography
                                                        variant="subTitle"
                                                      color={"text.primary"}
                                                        sx={{
                                                            mt: 1,
                                                       display:'flex',
                                                       alignItems:'center'
                                                       
                                                        }}
                                                    >
                                                        See less
                                                        <Iconify
                                                            icon={
                                                                'ic:round-keyboard-arrow-up'
                                                            }
                                                            width="32px"
                                                            height="32px"
                                                        />
                                                    </Typography> :  <Typography
                                                        variant="subTitle"

                                                        color={"primary"}
                                                        sx={{
                                                     mt:2,
                                                       
                                                     display:'flex',
                                                     alignItems:'center'
                                                     
                                                      }}
                                                    >
                                                        See all ({props.programs.length})
                                                       
                                                    </Typography>}
                </Button></center> }   */}
    </Box>
  );
}
