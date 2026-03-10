import * as React from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateProgram, createProgram, saveProgram } from 'src/redux/actions/createProgram';
import { checkIsDraft } from 'src/utils/getProgramStatus';
import { updateFeedback } from 'src/redux/actions/feedback';
import { debounce } from 'lodash';

import { ref } from 'yup';
function RequireAuth({ children }) {
  let dispatch = useDispatch();
  const reference = React.useRef(null);
  let location = useLocation();
  const navigate = useNavigate();
  let token = useSelector((s) => s.Profile.token);
  const Program = useSelector((s) => s.NewProgram);
  reference.current = Program;

  useEffect(() => {
    if (Program._id) navigate(`/editProgram/${Program._id}/publishProgram`, { replace: true });
    return () => {
      if (checkIsDraft(reference.current) && reference.current.Title)
        dispatch(
          updateFeedback({
            loading: false,
            snackbar: true,
            message: 'Saved as Draft',
            severity: 'info',
          }),
        );
    };
  }, []);

  const updateSilent = React.useCallback(
    debounce((Prog) => {
      if (!Prog._id && Prog.Title) SaveAsDraft(Prog);
      else {
        if (Prog._id) dispatch(saveProgram({ ...Prog, IsDraft: true, SendTo: [] }));
      }
    }, 2000),
    [],
  );

  useEffect(() => {
    updateSilent(reference.current);
  }, [Program]);

  const SaveAsDraft = (ref) => {
    dispatch(
      createProgram({
        ...ref,
        IsDraft: true,
        IsPublished: false,
      }),
    ).then((program) => {
      dispatch(updateProgram({ _id: program._id }));

      // dispatch(updateFeedback({
      //         loading: false,
      //         snackbar: true,
      //         message: "Saved as Draft",
      //         severity: "info",
      //       }));
      //this.props.getAllPrograms();
    });
  };

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  return (
    <>
      <Outlet context={[Program, updateProgram, 'create']} />
    </>
  );
}

export default RequireAuth;
