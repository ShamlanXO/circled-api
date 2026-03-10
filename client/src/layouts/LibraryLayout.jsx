import * as React from 'react';
import { Outlet } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import { useDispatch } from 'react-redux';
import {
  fetchVideoLibrary,
  addWorkout,
  updateWorkout,
  fetchWorkoutLibrary,
  fetchPublicLibrary,
} from 'src/redux/actions/figgsLibrary';
import { debounce } from 'lodash';
import reactiveEnergy$1 from 'units-converter/dist/cjs/units/reactiveEnergy';

function RequireAuth({ children }) {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState('videos');
  const [workoutData, setWorkoutData] = React.useState({
    Title: '',
    Exercise: [],
  });
  const reference = React.useRef(null);
  reference.current = workoutData;

  const updateSilent = React.useCallback(
    debounce((Prog) => {
      let exercises = Prog.Exercise.filter((i) => i?.title || i.media?.length);
      if (Prog.Title && exercises.length) {
        if (Prog._id) {
          dispatch(updateWorkout(Prog, '', true));
        }
        // dispatch(addWorkout(Prog, '', true)).then((data) => {
        //   reference.current._id = data._id;
        // });
      }
    }, 3000),
    [],
  );

  React.useEffect(() => {
    updateSilent(reference.current);
  }, [workoutData]);

  React.useEffect(() => {
    dispatch(fetchVideoLibrary());
    dispatch(fetchWorkoutLibrary());
    dispatch(fetchPublicLibrary());
  }, []);
  return (
    <>
      <Outlet context={[workoutData, setWorkoutData, currentTab, setCurrentTab]} />
    </>
  );
}

export default RequireAuth;
