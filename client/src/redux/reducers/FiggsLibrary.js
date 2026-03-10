const initialState = {
  parent: {},
  children: [],
  ancestors: [],
  videos: [],
  workouts: [],
  publicVideos: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_LIBRARY':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_VIDEO_LIBRARY':
      return {
        ...state,
        videos: action.payload,
      };
    case 'UPDATE_VIDEO_PUBLIC':
      return {
        ...state,
        publicVideos: action.payload,
      };

    case 'UPDATE_WORKOUT_LIBRARY':
      return {
        ...state,
        workouts: action.payload,
      };

    case 'UPDATE_VIDEO':
      delete action.payload.mode;

      let vindex = state.videos.findIndex((item) => item._id == action.payload._id);
      let videos = [...state.videos];
      videos[vindex] = { ...videos[vindex], ...action.payload };
      return {
        ...state,
        videos: videos,
      };
    case 'ADD_VIDEO':
      delete action.payload.mode;
      let aavideos = [action.payload, ...state.videos];

      return {
        ...state,
        videos: aavideos,
      };

    case 'DELETE_VIDEO':
      return {
        ...state,
        videos: state.videos.filter((i) => i._id !== action.payload),
      };

    case 'ADD_WORKOUT':
      let existing = state.workouts.findIndex((i) => i._id == action.payload._id);
      var workouts = [];
      if (existing < 0) workouts = [action.payload, ...state.workouts];
      else {
        workouts = [...state.workouts];
        workouts[existing] = { ...action.payload };
      }

      return {
        ...state,
        workouts: workouts,
      };

    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((i) => i._id !== action.payload),
      };

    case 'DELETE_ITEM':
      let index = state.children.findIndex((item) => item._id == action.payload._id);
      let children = [...state.children];
      children.splice(index, 1);
      return {
        ...state,
        children,
      };

    default:
      return state;
  }
};
