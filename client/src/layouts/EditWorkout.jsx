import * as React from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateProgram, getSpecificProgram, saveProgram, deleteProgram } from 'src/redux/actions/createProgram';
import { checkIsDraft } from 'src/utils/getProgramStatus';
import { updateFeedback } from 'src/redux/actions/feedback';
import { debounce } from 'lodash';

function RequireAuth({ children }) {
  const reference = React.useRef(null);
  const [isLoaded, setIsloaded] = React.useState(false);
  let dispatch = useDispatch();
  let location = useLocation();
  let token = useSelector((s) => s.Profile.token);
  const Program = useSelector((s) => s.NewProgram);
  reference.current = Program;
  const { id } = useParams();

  useEffect(() => {
    dispatch(getSpecificProgram(id)).then((data) => {
      dispatch({
        type: 'INIT_PROGRAM',
        payload: { ...data, SendTo: [] },
      });
      setIsloaded(true);
    });

    // return () => {
    //   //let IsDraft = checkIsDraft(reference.current);

    //   dispatch(
    //     saveProgram({
    //       ...reference.current,
    //       IsDraft: reference.current.IsDraft,
    //       SendTo: [],
    //     })
    //   ).then((program) => {
    //     dispatch(
    //       updateFeedback({
    //         loading: false,
    //         snackbar: true,
    //         message: "Program Saved",
    //         severity: "info",
    //       })
    //     );

    //     //this.props.getAllPrograms();
    //   });
    // };
  }, []);

  useEffect(() => {
    if (Program._id && Program._id == id) updateSilent(reference.current);
  }, [reference.current]);

  const updateSilent = React.useCallback(
    debounce((Prog) => {
      dispatch(
        saveProgram({
          ...Prog,
          IsDraft: checkIsDraft(Prog),
          SendTo: [],
        }),
      );
    }, 2000),
    [],
  );

  const Save = (Program) => {
    dispatch(
      saveProgram({
        ...Program,

        SendTo: [],
      }),
    ).then((program) => {
      dispatch(
        updateFeedback({
          loading: false,
          snackbar: true,
          message: 'Program Saved',
          severity: 'info',
        }),
      );

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

  return <>{isLoaded && <Outlet context={[Program, updateProgram, 'edit']} />}</>;
}

export default RequireAuth;
