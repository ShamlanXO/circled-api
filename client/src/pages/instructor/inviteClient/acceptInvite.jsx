// @mui
import { styled } from '@mui/material/styles'

// components
import Page from 'src/components/Page'
// sections
import { Box, Typography, Stack,  Button,Checkbox, CircularProgress, Avatar} from '@mui/material'


import { useLocation, useNavigate, useParams } from 'react-router'
import TextField from 'src/components/core/LabeledInput'

import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { useDispatch, useSelector} from 'react-redux'
import SignUpOptions from 'src/components/common/SignUpOptions'
import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import FooterBase from 'src/components/Layout/Footer'
import Iconify from 'src/components/Iconify'
import Logo from 'src/assets/figgslogo.png'
import { signOut } from 'src/redux/actions/common'
// ----------------------------------------------------------------------
import Header from 'src/components/onboarding/header'
import { useEffect, useState } from 'react'
import { updateFeedback } from 'src/redux/actions/feedback'
import { acceptInvitation, fetchInvitation,rejectInvitation } from 'src/redux/actions/invite'

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
export default function HomePage({ mode }) {
    const navigate = useNavigate()
    const query = useQuery();
    const dispatch = useDispatch()
    const { state } = useLocation()
    const {token}=useParams()
    const [inviteData,setInviteData]=useState(null)
    const [NotFound,setNotFound]=useState(false)
    const [confirmed,setConfirmed]=useState(false)
    const Profile = useSelector((s) => s.Profile)
    const userExist = query.get('userexist');
useEffect(()=>{

    dispatch(fetchInvitation(token)).then((res)=>{
        setInviteData(res)
       
        console.log(res)
    }
    ).catch(err=>{
        if(err.status=="404"){
        setNotFound(true)
        }
    })
    // dispatch(acceptInvitation(token)).then((res)=>{
    //     setConfirmed(true)
    // })
},[])


const acceptInvite=()=>{
     dispatch(acceptInvitation(token)).then((res)=>{
       navigate('/')
    })
}

const rejectInvite=()=>{
    dispatch(rejectInvitation(token)).then((res)=>{
      navigate('/')
   })
}


  if(NotFound){
    return(
        <Page title=" Simplified Online Fitness Training ">
         
        <Container>
            {/* <Header
                title={'Invitation'}
                onClose={() => navigate(-1, { state })}
            /> */}
            <Content
                display={'flex'}
                height={'100%'}
                flexDirection={'column'}
                alignItems={'center'}
                flexGrow={'1'}
                px={2}
                pt={6}
            >
                <Box
                    display={'flex'}
                    justifyContent="center"
                    alignItems={'center'}
                    mt={8}
                >
                    <img src={Logo} height={46} />
                </Box>
                <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} pt={4}>
               
           <Stack alignItems={"center"} spacing={1}>

            <Iconify icon='ant-design:stop-outlined' sx={{fontSize:100,color:"text.secondary",my:4}}/>
                    <Typography variant='h2' color={"text.secondary"} sx={{textTransform:'capitalize'}}>
                 Link Expired
                    </Typography>

                    <Typography variant='h4' >
                  Provided link no longer exists
                    </Typography>
                </Stack>

             
                </Box>

           
            </Content>
            
        </Container>

</Page>
    )
  }
  else
  if(Profile?.token&&(Profile?.email!==inviteData?.email)){
    return(<Page title=" Simplified Online Fitness Training ">
         
    <Container>
        {/* <Header
            title={'Invitation'}
            onClose={() => navigate(-1, { state })}
        /> */}
        <Content
            display={'flex'}
            height={'100%'}
            flexDirection={'column'}
            alignItems={'center'}
            flexGrow={'1'}
            px={2}
            pt={6}
        >
            <Box
                display={'flex'}
                justifyContent="center"
                alignItems={'center'}
                mt={8}
            >
                <img src={Logo} height={46} />
            </Box>
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} pt={4}>
           
       <Stack alignItems={"center"} spacing={1}>

        <Iconify icon='ant-design:stop-outlined' sx={{fontSize:100,color:"text.secondary",my:4}}/>
                <Typography variant='h2' color={"text.secondary"} sx={{textTransform:'capitalize'}}>
             Unauthorized Access
                </Typography>
<br/>
<br/>
                <Typography variant='h4' sx={{mt:4}} align='center'>
              This invite was sent to <Typography color={"primary"}>{inviteData?.email}</Typography>
                </Typography>
                <Typography align='center'>
                    Please login with {inviteData?.email} <br/>to accept invite
                </Typography>
            </Stack>
<br/>
         <Button sx={{mt:4}} onClick={()=>signOut()}>
            Click here to signout from {Profile?.email}
         </Button>
            </Box>

       
        </Content>
        
    </Container>

</Page>)

  }
    else
    return (
        <Page title=" Simplified Online Fitness Training ">
         
                    <Container>
                        {/* <Header
                            title={'Invitation'}
                            onClose={() => navigate(-1, { state })}
                        /> */}
                        <Content
                            display={'flex'}
                            height={'100%'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            flexGrow={'1'}
                            px={2}
                            pt={6}
                        >
                            <Box
                                display={'flex'}
                                justifyContent="center"
                                alignItems={'center'}
                                mt={8}
                            >
                                <img src={Logo} height={46} />
                            </Box>
                            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} pt={4}>
                           
                           {inviteData? <Stack alignItems={"center"} spacing={1}>
                            {Profile?.token?
                            <Avatar src={inviteData?.invitedBy?.profilePic} sx={{ width: 100, height: 100 }}/>
                            
                            :""}
                           {userExist=='true'? <>
                                <Typography variant='h2' color={"text.secondary"} sx={{textTransform:'capitalize'}}>
                                {inviteData?.invitedBy?.name}
                                </Typography>

                                <Typography variant='h2' align='center'>
                               { Profile?.token?<>Has invited you to be on<br/>
                                his client list</>:"has sent you an invitation" }
                                </Typography>
                                </>:
                                <>
                                  <Typography  variant='h2' align='center'>
                            Create an account to <br/>accept &nbsp;
                                <Typography component={"span"} variant='h2' color={"text.secondary"} sx={{textTransform:'capitalize'}}>
                                {inviteData?.invitedBy?.name} 
                                </Typography>
                                &nbsp; invitation. 
                                </Typography>
                                </>
                                
                                }
                            </Stack>:""}

                       {Profile.token?
                        <Stack width={'100%'} mt={3} spacing={2}>
                            <Typography align='center' color={"text.secondary"}>
                            By accepting the trainer will be able to view your
health information and can send or create
programs for you.

                            </Typography>
                            <br/>
                        <Stack width={'100%'} mt={3} spacing={2} direction={'row'} justifyContent={"center"}>
                        <Button size="small" variant='text' onClick={rejectInvite}  sx={{bgcolor:"#E1E7F0",color:"text.primary"}}>
    Reject
</Button>
<Button size="small" variant='contained' onClick={acceptInvite}>
    Accept
</Button>

                        </Stack>
                        </Stack>
                       
                       :   <Stack width={'100%'} mt={3} spacing={2}>
                            {userExist=='true'?<Typography align='center' component={"span"}>You account <Typography component={"span"} color={"text.secondary"}>{inviteData?.email}</Typography> already Exists
                                
                            </Typography>:<Typography align='center'>Make sure to sign in using this email

 <br/><Typography align='center' color={"text.secondary"}>
    {inviteData?.email}
 </Typography>
                                
                                </Typography>}
                            {userExist=='true'?<Typography align='center' variant='h3'>Login to view the invitation
                                
                                </Typography>:<Typography></Typography>}
                           <SignUpOptions redirect={`${window.location.pathname}${window.location.search}`} type={"Athlete"}/>
                           </Stack>}
                           {/* { confirmed?
                           <>
                           <Typography color={"text.secondary"} variant='h2' sx={{mt:4}}>
                           Invite accepted!
                            </Typography>
                            <Button

                            sx={{mt:4}} variant='contained' color='primary' onClick={()=>navigate('/')}>Done</Button>
                            </>:
                            <>
                            <CircularProgress size={80}/>
                            <br/>
                            <br/>
                            <Typography>Accepting Invitation....</Typography>
                            </>
                            } */}
                            </Box>

                       
                        </Content>
                        
                    </Container>
        
        </Page>
    )
}
