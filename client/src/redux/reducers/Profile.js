const initialState = {
  type: null,
  uid: null,
  name: "",
  email: "",
  privatePlan: false,
  phone: null,
  authType: 0,
  profilePic: null,
  password: "",
  DOB: new Date("2002-08-18T21:11:54"),
  bio: "",
  location: "US",
  token: null,
  healthInfo: {},
  links: [],
  expertise: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        ...action.payload,
      };

    case "INIT_NEW_PROFILE":
      return {
        ...action.payload,
      };

    case "INIT_PROFILE":
      return {
        type: null,
        uid: null,
        name: "",
        email: "",
        privatePlan: false,
        phone: null,
        authType: 0,
        profilePic: null,
        password: "",
        DOB: new Date("2002-08-18T21:11:54"),
        bio: "",
        location: "US",
        token: null,
        category: ["weight loss"],
        links: [],
        healthInfo: {},
      };

    case "LOG_OUT":
      return {
        token: null,
        name: null,
        email: null,
        phone: null,
      };

    default:
      return state;
  }
};
