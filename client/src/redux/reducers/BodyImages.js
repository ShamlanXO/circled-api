const initialState = {
    images:[]
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "SET_IMAGES":
        return {
          ...state,
          images: action.payload.images
        
        };

        case "DELETE_IMAGES":
        return {
          ...state,
          images: state.images.filter(image => image._id !== action.payload._id)
        
        };
        case "UPDATE_IMAGE":
            let ImageClone=[...state.images];
            ImageClone[ImageClone.findIndex(image => image._id === action.payload._id)]=action.payload;
        return {
          ...state,
          images: ImageClone
        
        };
  
      default:
        return state;
    }
  };
  