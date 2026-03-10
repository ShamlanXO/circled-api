const initialState = {
  type: "Instructor",
  uid: null,
  name: "",
  email: "",
  privatePlan: false,
  phone: "",
  authType: 1,
  profilePic: null,
  healthGoals: "",
  expertise: "",
  healthDocumnents: [],
  healthInfo: {
    healthDocumnents: [],
  },
  password: "",
  DOB: new Date("2002-08-18T21:11:54"),
  bio: "",
  location: null,
 
  token: null,
  bodyImages: [],
  category: ["weight-Loss"],
  links: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ONBOARDING":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
