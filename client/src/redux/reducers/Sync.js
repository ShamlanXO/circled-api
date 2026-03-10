const initialState = {
  programs: {},
  media: {},
  libMedia: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRAMLIST':
      return {
        ...state,
        programs: action.payload,
      };

    case 'UPDATE_MEDIA':
      return {
        ...state,
        media: action.payload,
      };

    case 'UPDATE_LIBMEDIA':
      return {
        ...state,
        libMedia: action.payload,
      };

    default:
      return state;
  }
};
