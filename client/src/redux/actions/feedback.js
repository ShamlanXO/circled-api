export const updateFeedback = (data) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_FEED", payload: data });
  };
};
