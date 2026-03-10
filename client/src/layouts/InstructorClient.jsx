import * as React from "react";
import { useParams, useLocation, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


import {
  getClientsSpecific,
  updateProgram,
  saveProgram,
} from "src/redux/actions/clientExercise";

import { CircularProgress } from "@mui/material";
function RequireAuth({ children }) {
  let dispatch = useDispatch();
  const [loadedData, setLoadedData] = React.useState(false);
  let token = useSelector((s) => s.Profile.token);
  let location = useLocation();
  const { id } = useParams();
  const Program = useSelector((s) => s.ProgramList.clientData?.Program);
  const Profile=useSelector((s)=>s.ProgramList.clientDetails)
  useEffect(() => {
   
    dispatch(getClientsSpecific(id))
      .then((res) => {
        setLoadedData(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (Program)
      dispatch({
        type: "INIT_PROGRAM",
        payload: { ...Program, SendTo: [] },
      });

    return () => {
      // let IsDraft=checkIsDraft(reference.current)
      // dispatch(saveProgram({
      //   ...reference.current,
      //   IsDraft,
      //   SendTo: [],
      // }))
      // .then((program) => {
      // dispatch(updateFeedback({
      //     loading: false,
      //     snackbar: true,
      //     message: "Program Saved",
      //     severity: "info",
      //   }));
      //   //this.props.getAllPrograms();
      // });
    };
  }, [Program?._id]);
  const reload = () => {
    dispatch(getClientsSpecific(id))
      .then((res) => {
        setLoadedData(true);
      })
      .catch((err) => {});
  };

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }
if(Profile?.name)
  return (

    <>
    
        <Outlet context={[Program, updateProgram, "customize", saveProgram,reload]} />
    
    </>
  )
  else
  return(
<CircularProgress/>
)
}

export default RequireAuth;
