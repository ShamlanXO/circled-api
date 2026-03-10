export const updateOnboarding = (data) => {
  return (dispatch) => {
    dispatch({ type: "UPDATE_ONBOARDING", payload: data });
  };
};
