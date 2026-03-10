import * as React from "react";
import {
 
  useLocation,
  Navigate,
  Outlet,
  useParams
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateProgram,  getSpecificProgram,saveProgram,deleteProgram} from "src/redux/actions/createProgram";
import {checkIsDraft} from "src/utils/getProgramStatus"
import {updateFeedback} from "src/redux/actions/feedback"

import _ from "lodash"
function RequireAuth({ children }) { 
  const reference = React.useRef(null);
  const [isLoaded,setIsloaded]=React.useState(false)
  const [original,setOriginal]=React.useState({})
let dispatch=useDispatch()
  let location = useLocation();
let token =useSelector(s=>s.Profile.token)
const Program = useSelector((s) => s.NewProgram);
reference.current=Program
const {id}=useParams()

useEffect(()=>{


    dispatch(getSpecificProgram(id)).then((data) => {
      setIsloaded(true)
    dispatch({
          type: "INIT_PROGRAM",
          payload: { ...data, SendTo: [] },
        });
        setOriginal({ ...(_.cloneDeep(data)), SendTo: [] })
      });



},[])

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{isLoaded&&<Outlet context={[Program,updateProgram ,"send",original]}/>}</>;
}

export default RequireAuth

