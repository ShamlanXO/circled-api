// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
// components
import Page from 'src/components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    Avatar,
    ButtonBase,
    InputAdornment,
    IconButton,
    StepLabel,
    StepContent,
    Step,
    Stepper,
    Tabs,
    Tab,
    Badge,
    Divider,
} from '@mui/material'

import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import Header from 'src/components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import LabeledInput from 'src/components/core/LabeledInput'
import ExerciseCard from 'src/components/instructor/exerciseCard'
import Label from 'src/components/Label'
import { fetchNotification, setVisible } from 'src/redux/actions/Notifications'
import Iconify from 'src/components/Iconify'
import notificationEvents from 'src/utils/notificationEvents'
import { TabContext, TabPanel } from '@mui/lab'
import moment from 'moment'
import { useSelector } from 'react-redux'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

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
}))
const SocialButton = styled(ButtonBase)(({ theme }) => ({
    height: 45,

    borderRadius: 16,
    background: '#F9FCFD',
    fontFamily: 'Proxima Nova',
    /* Dark primary / 50% */
    color: '#172A44',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 8,
    border: '2px solid rgba(23, 42, 68, 0.5)',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
const SpaceBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '12px 0',
    padding: '5px',
   
}))
const SystemBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    margin: '12px 0',
    padding: '5px',

}))
const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
}))
// ----------------------------------------------------------------------

export default function InstructorNotificationsPage() {
    const [allNotification, setAllNotification] = useState([{}, {}])
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const handleTabChange = (event, newValue) => {
        console.log(newValue)

        setCurrent(newValue)
    }
    useEffect(() => {
        fetchNotification()
        return () => {
            fetchNotification()
        }
    }, [])

    const getNotiBox = (data) => {
        return <NotiFicationCard data={data} />
    }

    const notification = useSelector(
        (state) => state.Notifications.Notifications
    )
    const count = useSelector((state) => state.Notifications.count)

    return (
        <RootStyle>
            <Page title="Notifications">
                <Container>
                    <TabContext value={current}>
                        {' '}
                        <Header noColor>
                            <BoxHeader px={2} py={2}>
                                <Box
                                    width={'100%'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    flexDirection={'row'}
                                >
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        Notifications
                                        {/* <Typography
                      component={"span"}
                      variant="body2"
                      color="primary.main"
                    >
                      &nbsp;( {count} new )
                    </Typography> */}
                                    </Typography>
                                </Box>
                            </BoxHeader>
                            {/* <TabContainer my={1} px={2}>
                <Tabs
                  variant="fullWidth"
                  value={current}
                  onChange={handleTabChange}
                  aria-label=""
                  indicatorColor="none"
                  sx={{
                    p: 0.4,
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                    borderRadius: 12,
                  }}
                >
                  <Tab
                    label={`Program Notifs ( ${count} )`}
                    sx={{
                      minWidth: "142px",
                      px: 1,
                      "&.Mui-selected": {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: "#fff",
                        boxShadow: "0px 1px 7px #E1E7F0",
                        border: "1px solid #E1E7F0",
                        fontSize: 16,
                        borderRadius: 18,
                      },
                    }}
                  />
                  <Tab
                    label={"System Notifs" + " " + "( 2 )"}
                    sx={{
                      minWidth: "140px",
                      px: 1,
                      "&.Mui-selected": {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: "#fff",
                        boxShadow: "0px 1px 7px #E1E7F0",
                        border: "1px solid #E1E7F0",
                        fontSize: 16,
                        borderRadius: 18,
                      },
                    }}
                  />
                </Tabs>
              </TabContainer> */}
                        </Header>{' '}
                        <Content
                            style={{
                                paddingBottom: 48,
                                overflowY: 'auto',
                            }}
                        >
                            {/* <TabPanel value={0} index={0}>
                                {notification.map((item) => {
                                    return getNotiBox(item)
                                })}
                            </TabPanel> */}
                            {allNotification.length==0?<Box
                                        width={'100%'}
                                        height="100%"
                                        display={'flex'}
                                        flexDirection="column"
                                        alignItems={'center'}
                                        justifyContent="center"
                                    >
                                        <Typography
                                            variant="h3"
                                            align={'center'}
                                            color="grey.400"
                                        >
                                            No notification available.
                                        </Typography>
                                    </Box>:
                            <>
                                {notification.map((item) => (
                                    <NotiFicationCard data={item}/>
                                    // <SystemBox>
                                    //     <Box display="flex">
                                    //         <Badge
                                    //             variant="dot"
                                    //             anchorOrigin={{
                                    //                 vertical: 'top',
                                    //                 horizontal: 'left',
                                    //             }}
                                    //             invisible={false}
                                    //             overlap="circular"
                                    //             color="primary"
                                    //         >
                                    //             <Avatar
                                    //                 src={
                                    //                     '/images/dummyUser.png'
                                    //                 }
                                    //             />
                                    //         </Badge>
                                    //         &nbsp;&nbsp;&nbsp;&nbsp;
                                    //         <Typography
                                    //             variant="subtitle2"
                                    //             color="text.primary"
                                    //         >
                                    //             New update here! Download from
                                    //             app store - Here’s what’s new
                                    //             ...
                                    //         </Typography>
                                    //         <br />
                                    //     </Box>{' '}
                                    //     <Box
                                    //         display="flex"
                                    //         justifyContent={'flex-end'}
                                    //     >
                                    //         <Typography
                                    //             align="right"
                                    //             variant="caption"
                                    //             color="text.secondary"
                                    //         >
                                    //             3 min ago
                                    //         </Typography>
                                    //     </Box>
                                    // </SystemBox>
                                ))}
                            </> 
                        }
                        </Content>
                    </TabContext>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}

const NotiFicationCard = ({ data }) => {
    useEffect(() => {
        return () => {
            if (!data.IsRead) setVisible(data._id)
        }
    }, [])

    const navigate = useNavigate()
    const Profile = useSelector((state) => state.Profile)

    switch (data?.Type) {
        case notificationEvents.SEND_PROGRAM:
            return (
                <>
                    <SpaceBox
                        sx={{ alignItems: 'start' }}
                        onClick={() =>
                            navigate(
                                `/program/instructorSend/${data?.SentProgramId._id}/${Profile.email}`
                            )
                        }
                    >
                        {data.IsRead ? (
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        ) : (
                            <Badge
                                variant="dot"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                invisible={false}
                                overlap="circular"
                                color="primary"
                            >
                                <Avatar
                                    src={
                                        data?.Sender?.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </Badge>
                        )}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Box>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {data?.Sender?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Send a program &nbsp;
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    color="text.primary"
                                    sx={{textTransform:"capitalize"}}
                                >
                                    {data?.SentProgramId?.Title}
                                </Typography>

                            </Typography>
                            <Button 
                          
                            size='small' sx={{ml:0,pl:0,height:32,fontSize:14}} >View program</Button>
                        </Box>
                        <Box flexGrow={1} />
                        <Typography
                            align="right"
                            variant="caption"
                            color="text.secondary"
                        >
                            {moment(data?.createdAt).fromNow()}
                        </Typography>
                    </SpaceBox>
                    <Divider sx={{ width: '100%' }} />
                </>
            )
        case notificationEvents.SUBSCRIBED_PROGRAM:
            return (
                <>
                    <SpaceBox sx={{ alignItems: 'start' }} onClick={()=>navigate(data?.Link,{
                        state:{
                            view:"program"
                        }
                    })}>
                        {data.IsRead ? (
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        ) : (
                            <Badge
                                variant="dot"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                invisible={false}
                                overlap="circular"
                                color="primary"
                            >
                                <Avatar
                                    src={
                                        data?.Sender?.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </Badge>
                        )}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Box>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {data?.Sender?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Subscribed to&nbsp;
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    color="text.primary"
                                >
                                    {data?.SentProgramId?.Title}
                                </Typography>
                            </Typography>
                        </Box>
                        <Box flexGrow={1} />
                        <Typography
                            align="right"
                            variant="caption"
                            color="text.primary"
                        >
                            {moment(data?.createdAt).fromNow()}
                        </Typography>
                        <Divider />
                    </SpaceBox>
                    <Divider sx={{ width: '100%' }} />
                </>
            )
        case notificationEvents.UPDATE_PROGRAM:
            return (
                <SpaceBox sx={{ alignItems: 'start' }} onClick={
                    data.Link?()=>navigate(data.Link):null
                }>
                    {data.IsRead ? (
                        <Avatar
                            src={
                                data?.Sender?.profilePic ||
                                '/images/dummyUser.png'
                            }
                        />
                    ) : (
                        <Badge
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            invisible={false}
                            overlap="circular"
                            color="primary"
                        >
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        </Badge>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {data.Title||data?.Sender?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.Description}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Typography
                        align="right"
                        variant="caption"
                        color="text.primary"
                    >
                        {moment(data?.createdAt).fromNow()}
                    </Typography>
                    <Divider />
                </SpaceBox>
            )

        case notificationEvents.UPDATE_TODO:
            return (
                <SpaceBox sx={{ alignItems: 'start' }} onClick={
                    data.Link?()=>navigate(data.Link):null
                }>
                    {data.IsRead ? (
                        <Avatar
                            src={
                                data?.Sender?.profilePic ||
                                '/images/dummyUser.png'
                            }
                        />
                    ) : (
                        <Badge
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            invisible={false}
                            overlap="circular"
                            color="primary"
                        >
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        </Badge>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {data.Title||data?.Sender?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.Description}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Typography
                        align="right"
                        variant="caption"
                        color="text.primary"
                    >
                        {moment(data?.createdAt).fromNow()}
                    </Typography>
                    <Divider />
                </SpaceBox>
            )

        case notificationEvents.LOG_NOTIFICATION:
            return (
                <SpaceBox sx={{ alignItems: 'start' }} onClick={
                    data.Link?()=>navigate(data.Link):()=>navigate(`/clientProfile/${data?.clientId}/trainingLog`,{
                        state:{
                            week:data?.meta?.week||0,
                            day:data?.meta?.day||0,
                            exercise:data?.meta?.exercise||0,


                        }
                    })
                }>
                    {data.IsRead ? (
                        <Avatar
                            src={
                                data?.Sender?.profilePic ||
                                '/images/dummyUser.png'
                            }
                        />
                    ) : (
                        <Badge
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            invisible={false}
                            overlap="circular"
                            color="primary"
                        >
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        </Badge>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {data.Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.Description}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Typography
                        align="right"
                        variant="caption"
                        color="text.primary"
                    >
                        {moment(data?.createdAt).fromNow()}
                    </Typography>
                    <Divider />
                </SpaceBox>
            )

        case notificationEvents.EDIT_DIET:
            return (
                <SpaceBox sx={{ alignItems: 'start' }} onClick={
                    data.Link?()=>navigate(data.Link):null
                }>
                    {data.IsRead ? (
                        <Avatar
                            src={
                                data?.Sender?.profilePic ||
                                '/images/dummyUser.png'
                            }
                        />
                    ) : (
                        <Badge
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            invisible={false}
                            overlap="circular"
                            color="primary"
                        >
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        </Badge>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {data.Title||data?.Sender?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.Description}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Typography
                        align="right"
                        variant="caption"
                        color="text.primary"
                    >
                        {moment(data?.createdAt).fromNow()}
                    </Typography>
                    <Divider />
                </SpaceBox>
            )
            case notificationEvents.UPDATE_TODO:
                return (
                    <SpaceBox sx={{ alignItems: 'start' }}
                    onClick={
                        data.Link?()=>navigate(data.Link):null
                    }
                    >
                        {data.IsRead ? (
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        ) : (
                            <Badge
                                variant="dot"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                invisible={false}
                                overlap="circular"
                                color="primary"
                            >
                                <Avatar
                                    src={
                                        data?.Sender?.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </Badge>
                        )}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Box>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {data.Title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                               {`You have accepted ${data?.Sender.name} as your instructor`}
                            </Typography>
                        </Box>
                        <Box flexGrow={1} />
                        <Typography
                            align="right"
                            variant="caption"
                            color="text.primary"
                        >
                            {moment(data?.createdAt).fromNow()}
                        </Typography>
                        <Divider />
                    </SpaceBox>
                )
                case notificationEvents.INVITE_CLIENT:
                    return (
                        <>
                        <SpaceBox sx={{ alignItems: 'start' }} onClick={
                            data.Link?()=>navigate(data.Link):null
                        }>
                    {data.IsRead ? (
                        <Avatar
                            src={
                                data?.Sender?.profilePic ||
                                '/images/dummyUser.png'
                            }
                        />
                    ) : (
                        <Badge
                            variant="dot"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            invisible={false}
                            overlap="circular"
                            color="primary"
                        >
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        </Badge>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Box>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {data.Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {data.Description}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Typography
                        align="right"
                        variant="caption"
                        color="text.primary"
                    >
                        {moment(data?.createdAt).fromNow()}
                    </Typography>
                
                </SpaceBox>
                <Divider sx={{ width: '100%' }} />
                </>
                    )
                    case notificationEvents.ACCEPT_PROGRAM:
                        return (
                            <>
                            <SpaceBox sx={{ alignItems: 'start' }} onClick={
                                data.Link?()=>navigate(data.Link):null
                            }>
                        {data.IsRead ? (
                            <Avatar
                                src={
                                    data?.Sender?.profilePic ||
                                    '/images/dummyUser.png'
                                }
                            />
                        ) : (
                            <Badge
                                variant="dot"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                invisible={false}
                                overlap="circular"
                                color="primary"
                            >
                                <Avatar
                                    src={
                                        data?.Sender?.profilePic ||
                                        '/images/dummyUser.png'
                                    }
                                />
                            </Badge>
                        )}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Box>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {data?.Sender?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.Description}
                            </Typography>
                        </Box>
                        <Box flexGrow={1} />
                        <Typography
                            align="right"
                            variant="caption"
                            color="text.primary"
                        >
                            {moment(data?.createdAt).fromNow()}
                        </Typography>
                    
                    </SpaceBox>
                    <Divider sx={{ width: '100%' }} />
                    </>
                        )
        default:
            return null
    }
}
