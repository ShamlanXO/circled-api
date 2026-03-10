import { useLocation, Outlet,Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Box, Link, Container, Typography, Stack } from '@mui/material';
import { useEffect } from 'react';
import { updateInfo } from 'src/redux/actions/Profile';
// components


// ----------------------------------------------------------------------

export default function MainLayout({mode}) {
  const { pathname ,state} = useLocation();
  const isHome = pathname === '/';
  let token =useSelector(s=>s.Profile.token)
  let type =useSelector(s=>s.Profile.type)
  const dispatch=useDispatch()
  useEffect(()=>{
if(mode&&mode=="client")
{
dispatch(updateInfo({type:"Athlete"}))
}
else{
  if(mode=="instructor")
  dispatch(updateInfo({type:"Instructor"}))
}
  },[mode])

  
  if (token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={state?.redirect?state?.redirect:type=="Instructor"?"/instructor":"/client"}  replace />;
  }
  return (
   
<>
      <Outlet />

     
 </>
  );
}
