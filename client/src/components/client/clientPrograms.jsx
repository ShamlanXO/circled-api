// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Avatar, Box, IconButton, ListItemButton, Stack, Switch, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import Label from '../Label';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router';
import SwitchCustom from '../SwitchCustom';
import { switchExercise } from 'src/redux/actions/clientExercise';
import { useDispatch, useSelector } from 'react-redux';
// ----------------------------------------------------------------------
import moment from 'moment';
const BoxStyle = styled(Box)(() => ({
  'display': 'flex',
  'justifyContent': 'space-between',
  'alignItems': 'center',
  'margin': '0 0 32px 0',
  'width': '100%',
  'borderRadius': 4,
  'cursor': 'pointer',
  ':hover': {
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 1)',
  },
}));
const BoxHeader = styled(Box)(() => ({}));

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

export default function ClientPrograms({ programs }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPlan = useSelector((s) => s.AtheletePlan.currentPlan);
  const sortedPrograms = [...programs].sort((a, b) => {
    if (a._id === currentPlan) return -1;
    if (b._id === currentPlan) return 1;
    return 0;
  });
  return (
    <BoxHeader>
      {sortedPrograms.map((item) => (
        <BoxStyle>
          <Box
            display={'flex'}
            alignItems="center"
            width="100%"
            onClick={() => navigate('/client/my-program')}
          >
            <Avatar
              variant="rounded"
              style={{
                width: '132px',
                height: '88px',
                backgroundColor: '#F3F5F8',
              }}
              src={item.BannerImage || '/images/DefaultThumbnail.png'}
            />

            <Box
              width="100%"
              marginLeft={1}
            >
              <Typography
                variant="h5"
                color="text.primary"
                sx={{
                  wordBreak: 'break-word',
                }}
              >
                {item?.Title}
              </Typography>{' '}
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'flex-end'}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    flexWrap={'wrap'}
                  >
                    Subscribed
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    flexWrap={'wrap'}
                  >
                    {moment(item.createdAt).format('DD MMM YYYY')}
                  </Typography>
                </Box>
                <Box>
                  <SwitchCustom
                    checked={item._id == currentPlan}
                    color="primary"
                    onChange={(e) => dispatch(switchExercise({ ...item, isActive: e.target.checked }))}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </BoxStyle>
      ))}
    </BoxHeader>
  );
}
