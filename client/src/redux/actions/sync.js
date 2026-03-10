export const updateRecord = (id, data) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.programs;

    allRecords[id] = { ...allRecords[id], ...data };

    dispatch({ type: 'UPDATE_PROGRAMLIST', payload: allRecords });
  };
};

export const deleteRecord = (id) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.programs;

    delete allRecords[id];

    dispatch({ type: 'UPDATE_PROGRAMLIST', payload: allRecords });
  };
};

export const updateMediaRecord = (id, data) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.media;

    allRecords[id] = { ...allRecords[id], ...data };

    dispatch({ type: 'UPDATE_MEDIA', payload: allRecords });
  };
};

export const cancelUpload = (id) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.media;
    allRecords[id].source.cancel();
    delete allRecords[id]
    dispatch({ type: 'UPDATE_MEDIA', payload: allRecords });
  };
};

export const deleteMediaRecord = (id) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.media;

    delete allRecords[id];

    dispatch({ type: 'UPDATE_MEDIA', payload: allRecords });
  };
};

export const updateLibRecord = (id, data) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.libMedia;

    allRecords[id] = { ...allRecords[id], ...data };

    dispatch({ type: 'UPDATE_LIBMEDIA', payload: allRecords });
  };
};

export const deleteLibRecord = (id) => {
  return (dispatch, getState) => {
    let allRecords = getState().Sync.libMedia;

    delete allRecords[id];

    dispatch({ type: 'UPDATE_LIBMEDIA', payload: allRecords });
  };
};
