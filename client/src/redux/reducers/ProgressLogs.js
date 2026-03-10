const initialState = {
    logs:[]
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_PROGRESS_LOGS":
        return {
          ...state,
          logs: action.payload,
        };
  
    
  
  
      default:
        return state;
    }
  };
  