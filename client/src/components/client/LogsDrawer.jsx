import {
  Avatar,
  Button,
  Box,
  Divider,
  Drawer,
  TextField,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
  ButtonBase,
  Paper,
} from '@mui/material';
import Send from 'src/assets/IconSet/Send';
import React, { useState, useEffect, forwardRef, useRef } from 'react';
import Log from 'src/assets/IconSet/LogFilled';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';
import { addNewLog, fetchLogs, newUpload, deleteProgressLog } from 'src/redux/actions/ProgressLogs';

import MessageCard from './MessageCard';
import { useSelector } from 'react-redux';
import AddImage from 'src/assets/IconSet/AddImage';
import Iconify from '../Iconify';
import ObjectID from 'bson-objectid';

import useLocalStorage from 'src/hooks/useLocalStorage';
import { useNavigate } from 'react-router';
const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
function MuscleHighlighterDrawer(props, ref) {
  const [drawerOpen, setDrawerOpen] = useState(props.openLogs);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useLocalStorage(`logs-upload-${props.day}-${props.week}-${props.exerciseIndex}`, []);
  const [commentToUpload, setCommentToUpload] = useLocalStorage(`logs-upload-${props.orderId}`, []);
  const scrollRef = React.useRef(null);
  const Profile = useSelector((s) => s.Profile);
  const UploadableComments = useSelector((s) => s.ProgressLogs.logs);
  const Sync = useSelector((s) => s.Sync.media);
  let toBeUploaded = UploadableComments.filter(
    (i) =>
      i.isUploaded == false &&
      i.orderId == props.orderId &&
      i.day == props.day &&
      i.week == props.week &&
      i.exercise == props.exerciseIndex,
  );
  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (!isOpen && props.onClose) {
      props.onClose();
    }

    setDrawerOpen(isOpen);
  };
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  useEffect(() => {
    toBeUploaded.map((i) => {
      let pendingSync = Object.values(Sync).filter(
        (j) => j.orderId == i.orderId && i.day == j.day && i.week == j.week && j.exercise == i.exercise,
      );

      if (pendingSync.length) {
        return;
      }
      addNewLog({
        _id: i._id,
        exercise: i.exercise,
        orderId: i.orderId,
        message: i.message,
        day: i.day,
        week: i.week,
        media: i.media,
      }).then((res) => {
        deleteProgressLog(i._id);
        setComments([...comments, i]);
        props.setLatestLog && props.setLatestLog(res ? { ...res, createdBy: i.createdBy, media: i.media } : {});
        props.setLogCount && props.setLogCount(comments.length + 1);
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 500);
      
      });
    });
  }, [UploadableComments]);

  const addLog = () => {
    //let newComments=[...commentToUpload]
    newUpload({
      _id: ObjectID().toString(),
      exercise: props.exerciseIndex,
      orderId: props.orderId,
      message: comment,
      day: props.day,
      week: props.week,
      name: Profile.name,
      profilePic: Profile.profilePic,
      type: Profile.type,
      createdBy: Profile,
      isUploaded: false,
    });
    //setCommentToUpload(newComments)
    setComment('');
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const onDeleteLog = (id) => {
    setComments(comments.filter((i) => i._id !== id));
  };

  const fetchAllLogs = () => {
    fetchLogs({
      id: props.orderId,
      week: props.week,
      day: props.day,
      exercise: props.exerciseIndex,
    })
      .then((res) => {
        props.setLatestLog(res.length ? res[res.length - 1] : {});
        setLoading(false);
        setComments(res);
        props.setLogCount && props.setLogCount(res.length);
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAllLogs();
  }, [props.orderId, props.week, props.day, props.exerciseIndex]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current?.scrollHeight) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 500);
  }, [comments, drawerOpen, scrollRef]);

  useEffect(() => {
    setDrawerOpen(props.openLogs);
  }, [props.openLogs]);
  // useEffect(()=>{
  //     if(!drawerOpen&&props.onClose) {
  //         props.onClose()

  //     }
  // },[drawerOpen])

  return (
    <div style={{ position: 'relative' }}>
      <Drawer
        anchor={'bottom'}
        PaperProps={{
          style: {
            boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.1)',
          
            padding: '0',
            paddingTop: '8px',
            height: 'calc(100vh - env(safe-area-inset-bottom, 0px))',
            backgroundColor: '#fff',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
          },
        }}
        disableBackdropTransition
        open={drawerOpen}
        onClose={() => {
          toggleDrawer(false);
          props.onClose();
        }}
        onOpen={toggleDrawer(true)}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fff',
            borderRadius: '16px 16px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            paddingTop: 'calc(env(safe-area-inset-top, 0px))',
          }}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Log sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Comments
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                toggleDrawer(false);
                props.onClose();
              }}
              sx={{ p: 0.5 }}
            >
              <Iconify icon="eva:close-fill" sx={{ fontSize: 32}} />
            </IconButton>
          </Box>
          
          <Box mt={1}>
            <Typography
              component={'span'}
              sx={{ 
                fontWeight: '500', 
                textTransform: 'capitalize',
                fontSize: '14px',
                color: 'text.primary'
              }}
            >
              Exercise {props.exerciseIndex + 1}:{' '}
              <Typography
                component={'span'}
                color={'text.secondary'}
                sx={{ fontWeight: '400' }}
              >
                {props.Exercise?.[props.exerciseIndex]?.title || props?.title}
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Comments Section */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#fafafa',
            minHeight: 0,
            WebkitOverflowScrolling: 'touch',
            '-webkit-transform': 'translateZ(0)',
            transform: 'translateZ(0)',
          }}
          ref={scrollRef}
        >
          <Box sx={{ p: 2 }}>
            {[...comments, ...toBeUploaded].length > 0 ? (
              [...comments, ...toBeUploaded].map((comment, index) => {
                let pendingSync = Object.values(Sync).filter(
                  (j) =>
                    j.orderId == props.orderId &&
                    props.day == j.day &&
                    props.week == j.week &&
                    j.exercise == props.exerciseIndex &&
                    j._id == comment._id,
                );
                return (
                  <MessageCard
                    key={index}
                    fetchAllLogs={fetchAllLogs}
                    _id={comment._id}
                    onDeleteLog={onDeleteLog}
                   
                    name={comment.createdBy?.name}
                    profilePic={comment?.createdBy?.profilePic}
                    createdBy={comment.createdBy?._id}
                    createdAt={comment.createdAt}
                    message={comment.message}
                    media={comment.media}
                    type={comment.type}
                    pendingSync={pendingSync}
                  />
                );
              })
            ) : (
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{ py: 8 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Iconify 
                      icon="eva:message-circle-outline" 
                      sx={{ 
                        fontSize: 48, 
                        color: 'text.disabled',
                        mb: 2
                      }} 
                    />
                    <Typography 
                      color={'text.secondary'}
                      sx={{ 
                        fontSize: '16px',
                        fontWeight: 500
                      }}
                    >
                      No comments yet
                    </Typography>
                    <Typography 
                      color={'text.disabled'}
                      sx={{ 
                        fontSize: '14px',
                        textAlign: 'center',
                        mt: 0.5
                      }}
                    >
                      Be the first to share your experience
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Comment Input Section */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fff',
            paddingBottom: 'env(16px + safe-area-inset-bottom, 0px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 1,
              backgroundColor: '#f8f9fa',
              borderRadius: '24px',
              p: 1.5,
              border: '1px solid #e9ecef',
            }}
          >
            <Avatar
              src={Profile.profilePic}
              sx={{ 
                width: 32, 
                height: 32,
                border: '1px solid #e0e0e0'
              }}
            />
            
            <InputBase
              multiline
              fullWidth
              minRows={1}
              maxRows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ 
                flex: 1,
                fontSize: '14px',
                '& .MuiInputBase-input': {
                 
                  backgroundColor: 'transparent',
                }
              }}
              placeholder="Add a comment..." 
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                sx={{ 
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  }
                }}
              >
                <Iconify icon="fluent:image-add-20-regular" sx={{ fontSize: 20 }} />
              </IconButton>
              
              <ButtonBase
                disabled={!comment.trim()}
                onClick={addLog}
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  backgroundColor: comment.trim() ? 'primary.main' : '#e9ecef',
                  color: comment.trim() ? 'white' : 'text.disabled',
                  minWidth: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: comment.trim() ? 'primary.dark' : '#e9ecef',
                  }
                }}
              >
                <Iconify icon="eva:arrow-forward-fill" sx={{ fontSize: 16 }} />
              </ButtonBase>
            </Box>
          </Box>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/* ,video/*"
          onChange={(e) =>
            navigate('/media/add', {
              state: {
                file: e.target.files,
                orderId: props.orderId,
                Profile: Profile,
                _id: ObjectID().toString(),
                exercise: props.exerciseIndex,
                day: props.day,
                week: props.week,
                comment: comment,
                name: Profile.name,
                profilePic: Profile.profilePic,
                type: Profile.type,
                createdBy: Profile,
              },
            })
          }
        />
      </Drawer>
      
      <div
        onClick={() => {
          setDrawerOpen(true);
        }}
      >
        {' '}
        {props.children ? (
          props.children
        ) : (
          <IconButton
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={props.onClickLog || null}
          >
            <Badge
              badgeContent={comments.length}
              color="primary"
            >
              <Log sx={{ fontSize: 38, color: '#fff' }} />
            </Badge>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                opacity: 1,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Comments
            </Typography>
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default forwardRef(MuscleHighlighterDrawer);
