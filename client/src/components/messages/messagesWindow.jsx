import { useState, useEffect, useRef } from 'react';
// @mui
import { styled, Box, Button, Typography, IconButton, ButtonBase, Divider } from '@mui/material';
import Iconify from '../Iconify';
import Label from '../Label';
import ReactAudioPlayer from 'react-audio-player';
import CircularProgress from '@mui/material/CircularProgress';
import TrackVisibility from 'react-visibility-sensor';
import InfiniteScroll from './InfiniteScroll';
import { format } from 'date-fns';
import groupBy from 'lodash/groupBy';
import { startOfDay } from 'date-fns';
const RootStyle = styled('div')(({ theme }) => ({
  borderRadius: '20px',
  width: '100%',
  backgroundColor: theme.palette.grey[0],
  // position: 'relative',
}));

const ImageBox = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '20px',
}));

const LogoContainer = styled('div')(({ theme }) => ({
  width: '100%',
  position: 'absolute',
  left: 0,
  bottom: -53,
  display: 'flex',
}));

const PostHeadStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '19px',
  [theme.breakpoints.down('lg')]: {
    padding: '10px',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: '20px',
  paddingBottom: '10px',
}));

const ChatStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  padding: '10px 0',
  overflowY: 'auto',
}));

const RoundButton = styled(Button)(({ theme }) => ({
  borderRadius: '15px',
}));
const QuickTip = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  maxWidth: '500px',
  bottom: 0,
  right: 0,
  display: 'flex',
  padding: '24px',
  // alignItem: 'center',
  backgroundColor: theme.palette.grey[0],
  boxShadow: theme.customShadows.z20,
}));

const ReplyIndicator = styled('div', {
  shouldForwardProp: (prop) => prop !== 'incoming',
})(({ incoming, theme }) => ({
  position: 'absolute',
  top: 9,
  height: '36px',
  width: '10px',
  borderRadius: '0 8px 8px 0',
  borderTop: '1px solid #C3CBD9',
  borderRight: '1px solid #C3CBD9',
  borderBottom: '1px solid #C3CBD9',
  ...(incoming && {
    borderRadius: '8px 0 0 8px',
    borderTop: '1px solid #C3CBD9',
    borderLeft: '1px solid #C3CBD9',
    borderBottom: '1px solid #C3CBD9',
    borderRight: 0,
  }),
}));

const ViewProgramBox = styled(Box)(({ theme }) => ({
  borderRadius: 40,
  backgroundColor: 'rgba(255,255,255, 0.25)',
  backdropFilter: 'blur(20px)',
  padding: '8px 20px',
  alignItems: 'center',
  cursor: 'pointer',
}));

function IncomingMessage(props) {
  const { content, type, isClientSide, isReplyToMessage, handleReplyToMessage } = props;

  return (
    <Box marginBottom="20px">
      {isReplyToMessage && (
        <Box display={'flex'}>
          <Box position="relative">
            <ReplyIndicator incoming />
          </Box>
          &nbsp; &nbsp; &nbsp;
          <Typography
            variant="caption"
            align="left"
            color="text.secondary"
            noWrap
            width="180px"
          >
            <Iconify icon="tabler:arrow-back-up" />
            &nbsp;Replying to&nbsp;
            {isReplyToMessage?.text}
          </Typography>
        </Box>
      )}
      <Box
        display={'flex'}
        alignItems={'center'}
        paddingLeft={isReplyToMessage ? '12px' : ''}
      >
        <Box
          padding={type == 'text' ? '10px 15px' : ''}
          borderRadius={'12px 24px 24px 24px'}
          sx={{
            backgroundColor: isClientSide ? '#E1E7F0' : 'primary.main',
            color: isClientSide ? 'text.primary' : 'common.white',
          }}
        >
          {type == 'audio' && (
            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
            >
              <ReactAudioPlayer
                src={content.url}
                autoPlay
                controls
                style={{
                  backgroundColor: 'transparent !important',
                  color: '#fff',
                }}
              />
            </Box>
          )}
          {type == 'program' && (
            <>
              <Box position="relative">
                <img
                  src={content.imageUrl}
                  style={{ width: '100%', borderRadius: '12px 24px 0 0' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ViewProgramBox>
                    <ButtonBase>
                      <Typography
                        variant="subtitle1"
                        color="common.white"
                      >
                        View
                      </Typography>
                    </ButtonBase>
                  </ViewProgramBox>
                </Box>
              </Box>
              <Box
                padding={'12px 15px'}
                position="relative"
              >
                <Typography
                  variant="subtitle1"
                  noWrap
                >
                  {content.Message}
                </Typography>
                <Box
                  position="absolute"
                  bottom={12}
                  right={12}
                  sx={{
                    paddingLeft: '8px',
                    backgroundColor: '#E1E7F0',
                  }}
                >
                  <Label
                    variant="filled"
                    color={isClientSide ? 'secondary' : 'primary'}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ lineHeight: 1 }}
                    >
                      $&nbsp;{content.price}
                    </Typography>
                  </Label>
                </Box>
              </Box>
            </>
          )}
          {type == 'text' && <Typography variant="body1">{content.Message}</Typography>}
        </Box>
        &nbsp;&nbsp;
        <IconButton
          sx={{
            'height': 32,
            'width': 32,
            'backgroundColor': (theme) => theme.palette.background.default,
            ':hover': {
              backgroundColor: (theme) => theme.palette.background.default,
            },
          }}
          onClick={() => handleReplyToMessage(content)}
        >
          <Iconify icon="tabler:arrow-back-up" />
        </IconButton>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ paddingLeft: isReplyToMessage ? '10px' : '' }}
      >
        &nbsp; &nbsp; {format(new Date(content.createdAt), 'hh:mm a')}
      </Typography>
    </Box>
  );
}

function OutgoingMessage(props) {
  const { content, type, isReplyToMessage, isClientSide, handleReplyToMessage } = props;

  return (
    <Box marginBottom="20px">
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
      >
        <Box>
          {isReplyToMessage && (
            <Box
              display={'flex'}
              paddingRight="10px"
            >
              <Typography
                variant="caption"
                align="right"
                color="text.secondary"
                noWrap
                width="180px"
              >
                <Iconify icon="tabler:arrow-back-up" />
                &nbsp;Replying to&nbsp;
                {isReplyToMessage?.text}
              </Typography>
              &nbsp;
              <Box position="relative">
                <ReplyIndicator />
              </Box>
            </Box>
          )}
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            paddingRight={isReplyToMessage ? '12px' : ''}
          >
            <IconButton
              sx={{
                'height': 32,
                'width': 32,
                'backgroundColor': (theme) => theme.palette.background.default,
                ':hover': {
                  backgroundColor: (theme) => theme.palette.background.default,
                },
              }}
              onClick={() => handleReplyToMessage(content)}
            >
              <Iconify icon="tabler:arrow-back-up" />
            </IconButton>
            &nbsp;&nbsp;
            <Box
              padding={type == 'text' ? '10px 15px' : ''}
              borderRadius={'24px 12px 24px 24px'}
              display={'flex'}
              sx={{
                backgroundColor: isClientSide ? 'secondary.main' : '#E1E7F0',
                color: 'text.primary',
                color: isClientSide ? 'common.white' : 'text.primary',
              }}
            >
              {type == 'program' && (
                <>
                  <Box position="relative">
                    <img
                      src={content.imageUrl}
                      style={{ width: '100%', borderRadius: '24px 12px 0 0' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ViewProgramBox>
                        <ButtonBase>
                          <Typography
                            variant="subtitle1"
                            color="common.white"
                          >
                            View
                          </Typography>
                        </ButtonBase>
                      </ViewProgramBox>
                    </Box>
                  </Box>
                  <Box
                    padding={'12px 15px'}
                    position="relative"
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                    >
                      {content.Message}
                    </Typography>
                    <Box
                      position="absolute"
                      bottom={12}
                      right={12}
                      sx={{
                        paddingLeft: '8px',
                        backgroundColor: '#E1E7F0',
                      }}
                    >
                      <Label
                        variant="filled"
                        color={isClientSide ? 'secondary' : 'primary'}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ lineHeight: 1 }}
                        >
                          $&nbsp;{content.price}
                        </Typography>
                      </Label>
                    </Box>
                  </Box>
                </>
              )}
              {type == 'text' && <Typography variant="body1">{content.Message}</Typography>}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
      >
        <Iconify
          icon="akar-icons:double-check"
          color={content.IsRead ? 'primary.main' : 'grey.400'}
          width="20px"
          height="20px"
        />
        &nbsp;&nbsp;
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ paddingRight: isReplyToMessage ? '10px' : '' }}
        >
          {format(new Date(content.createdAt), 'hh:mm a')} &nbsp; &nbsp;
        </Typography>
      </Box>
    </Box>
  );
}

export default function MessagesWindow(props) {
  const { chatMessages, isClientSide, handleReplyToMessage } = props;

  const content = {
    data: 'I completely understand your conditions & I am trying to customize a good workout plan for you.',
  };
  const chatWindowRef = useRef(null);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    chatWindowRef.current.scrollTo(0, chatWindowRef.current.scrollHeight);
  }, [messages]);

  let group = {};
  if (messages.length) {
    group = groupBy(messages, (i) => startOfDay(new Date(i.createdAt)));
  }
  return (
    <Box>
      <RootStyle>
        <ChatStyle ref={chatWindowRef}>
          <InfiniteScroll
            pageStart={0}
            loadMore={props.loadmore}
            hasMore={props.hasMore}
            initialLoad={false}
            loader={
              <div
                className="loader"
                key={0}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </div>
            }
            isReverse={true}
            useWindow={false}
          >
            {Object.keys(group).map((dateMsg) => {
              return (
                <>
                  <Box
                    mb={4}
                    width={'100%'}
                  >
                    <Divider>
                      &nbsp;&nbsp;
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {// TODO: Replace moment.calendar() - for now format as 'MM/dd/yyyy'
format(new Date(dateMsg), 'MM/dd/yyyy')}
                      </Typography>
                      &nbsp;&nbsp;
                    </Divider>
                  </Box>

                  {group[dateMsg].map((item) => {
                    return (
                      <TrackVisibility
                        onChange={() =>
                          !item.IsRead &&
                          item.SenderId !== props.Profile._id &&
                          props.updateChatRead(props.id, item._id)
                        }
                      >
                        <div style={{ paddingBottom: 20 }}>
                          {item.SenderId == props.Profile._id ? (
                            <OutgoingMessage
                              type={'text'}
                              content={item}
                            />
                          ) : (
                            <IncomingMessage
                              type={'text'}
                              content={item}
                            />
                          )}
                          {/* <ChatCard
                              onClickImage={(file) =>
                                this.setState({ imageUrl: file })
                              }
                              data={item}
                              updateProfile={this.props.updateProfile}
                              history={this.props.history}
                              to={this.props.id}
                              updateChat={this.props.updateChat}
                              AddChatData={this.props.AddChatData}
                              Images={item.Images}
                              UploadFile={
                                item.UploadFile ? item.UploadFile : false
                              }
                              IconAv={<Avatar>H</Avatar>}
                              Text={item.Message}
                              reverse={item.SenderId == this.props.Profile._id}
                            /> */}
                        </div>
                      </TrackVisibility>
                    );
                  })}
                </>
              );
            })}
          </InfiniteScroll>
        </ChatStyle>{' '}
      </RootStyle>{' '}
    </Box>
  );
}
