import * as React from "react";
import {
 
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateProgram,createProgram } from "src/redux/actions/createProgram";
import {checkIsDraft} from "src/utils/getProgramStatus"
import {updateFeedback} from "src/redux/actions/feedback"
import {
    getClientPrograms,
getOrder
  } from "src/redux/actions/clientExercise";

function RequireAuth({ children }) { 
let dispatch=useDispatch()
let token =useSelector(s=>s.Profile.token)
  let location = useLocation();

const AtheletePlan=useSelector(s=>s.AtheletePlan)
useEffect(()=>{
 
    dispatch(updateFeedback({
        loading: true,
       
      }));
  dispatch(getClientPrograms()).then(res=>{
    dispatch(updateFeedback({
        loading: false,
       
      }));
      if(AtheletePlan.currentPlan)
      dispatch(getOrder(AtheletePlan.currentPlan));


  }).catch(err=>{
    dispatch(updateFeedback({
        loading: false,
       
      }));
  })

},[])


  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <><Outlet /></>;
}

export default RequireAuth

