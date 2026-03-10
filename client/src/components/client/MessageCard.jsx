import { Box, Typography, Avatar, Grid, IconButton, CircularProgress } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import Iconify from '../Iconify';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { deleteLog } from 'src/redux/actions/ProgressLogs';
import { useSelector, useDispatch } from 'react-redux';
import CircularStatic from '../progress/Circular';
import { getFileFormat } from 'src/utils/getFileFormat';
import { getThumbnailOfLogs } from 'src/utils/convertToLink';
import { useNavigate } from 'react-router';
import ImageWithFallback from '../Labs/ImageWithFallback';
import { cancelUpload } from 'src/redux/actions/sync';

const MessageCard = ({
  name,
  profilePic,
  createdAt,
  message,
  media,
  createdBy,
  type,
  pendingSync,
  _id,
  fetchAllLogs,
  onDeleteLog,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirmationModal } = useConfirmationModalContext();
  const Profile = useSelector((s) => s.Profile);
  const sync= useSelector((s)=>s.Sync.media)


  
  const deleteLogItem = (id) => {
    showConfirmationModal('Are you sure?', `You are going to delete this log message`, 'Delete').then((res) => {
      if (res) {
        onDeleteLog && onDeleteLog(id);
        deleteLog(id).then((response) => {});
      }
    });
  };

  const handleCancelUpload = (id,_id) => {
    showConfirmationModal('Cancel Upload?', `Are you sure you want to cancel this upload?`, 'Cancel').then((res) => {
      if (res) {
        dispatch(cancelUpload(id));
        onDeleteLog && onDeleteLog(id);
        deleteLog(id).then((response) => {});

      }
    });
  };

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Avatar
        src={profilePic}
        sx={{ 
          width: 32, 
          height: 32,
          border: '1px solid #e0e0e0'
        }}
      />
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header with name and timestamp */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              color: 'text.primary',
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '11px',
            }}
          >
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Typography>
          
          {/* Delete button for own comments */}
          {Profile._id == createdBy && (
            <IconButton
              onClick={() => deleteLogItem(_id)}
              sx={{ 
                p: 0.5, 
                ml: 'auto',
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                }
              }}
            >
              <Iconify icon="eva:trash-2-outline" sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
        
        {/* Message content */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontSize: '14px',
            lineHeight: 1.4,
            mb: 1,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message}
        </Typography>

        {/* Media content */}
        {media?.length || pendingSync?.length ? (
          <Box
            sx={{
              mb: 1,
              borderRadius: 1,
              overflow: 'hidden',
              maxWidth: '280px', // Limit maximum width for better mobile experience
            }}
          >
            <Grid
              container
              spacing={0.5}
            >
              {(media?.length > 4 ? media.slice(0, 3) : media).map((i, index) => (
                <Grid
                  item
                 
                  key={index}
                >
                  <Box
                    sx={{
                      bgcolor: '#f0f0f0',
                      width: '100px',
                      height: '100%',
                      maxHeight:"150px",
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.9,
                      }
                    }}
                    onClick={() =>
                      navigate('/media/view', {
                        state: {
                          file: media,
                          index: index,
                          comment: message,
                        },
                      })
                    }
                  >
                    <ImageWithFallback
                      src={getFileFormat(i) == 'video' ? getThumbnailOfLogs(i) : i}
                      style={{ 
                   
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                    {getFileFormat(i) == 'video' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        <Iconify
                          icon="mingcute:play-fill"
                          sx={{ 
                            fontSize: 16,
                            color: 'white'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
              
              {media?.length > 4 && (
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: '#f0f0f0',
                      width: '100%',
                      height: getMediaHeight(media?.length, 3),
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.9,
                      }
                    }}
                    onClick={() =>
                      navigate('/media/view', {
                        state: {
                          file: media,
                          index: 0,
                          comment: message,
                        },
                      })
                    }
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}
                      >
                        +{media?.length - 3} more
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {pendingSync?.map(i=>{
                return(
                  <Grid item xs={4}>
                  <Box
                    sx={{
                      bgcolor: '#f8f9fa',
                      width: '100%',
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      borderRadius: 1,
                      border: '1px dashed #dee2e6',
                      position: 'relative',
                    }}
                  >
                    {/* Cancel button */}
                    <IconButton
                      onClick={() => handleCancelUpload(i.id, i._id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        p: 0.5,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.2)',
                        },
                        zIndex: 1,
                      }}
                    >
                      <Iconify icon="eva:close-fill" sx={{ fontSize: 14 }} />
                    </IconButton>
                    
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress 
                        size={24} 
                        variant="determinate" 
                        value={i?.progress || 0}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{ fontSize: '10px', fontWeight: 600 }}
                        >
                          {`${Math.round(i?.progress || 0)}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      sx={{ 
                        mt: 1,
                        fontSize: '12px',
                        align:'center',
                        color: 'text.secondary'
                      }}
                    >
                      Uploading...
                    </Typography>
                  </Box>
                </Grid>

                )
              }) 
                
               
              }
            </Grid>
          </Box>
        ) : null}
        
        {/* Detailed timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '11px',
          }}
        >
          {format(new Date(createdAt), 'hh:mm a | dd MMM yyyy')}
        </Typography>
      </Box>
    </Box>
  );
};

const getGridValue = (lenght, index) => {
  if (lenght == 1) {
    return 12;
  } else if (lenght == 2) {
    return 6;
  } else if (lenght == 3 && index == 2) {
    return 12;
  } else return 6;
};

const getMediaHeight = (length, index) => {
  if (length === 1) {
    return '200px'; // Single image/video gets more height
  } else if (length === 2) {
    return '140px'; // Two images side by side
  } else if (length === 3) {
    if (index === 2) {
      return '140px'; // Bottom image in 3-image layout
    } else {
      return '140px'; // Top two images
    }
  } else if (length > 4) {
    if (index === 3) {
      return '140px'; // "More" overlay
    } else {
      return '140px'; // First three images
    }
  }
  return '140px'; // Default height
};

export default MessageCard;
