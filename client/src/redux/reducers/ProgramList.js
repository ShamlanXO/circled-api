const initialState = {
  Programs: [],
  clients: [],
  Buffer: {
    IsEdited: false,
    Title: null,
    Type: null,
    Category: [],
    ExercisePlan: [
      [
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
      ],
      [
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
      ],
      [
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
      ],
      [
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
        { Title: "", IsRest: false, Exercise: [], Cover: null },
      ],
    ],

    DietPlan: {
      Title: null,
      File: null,
      Description: null,
    },
    PaymentType: null,
    Price: 0,
    Discount: 0,
    IsDraft: false,
    GreetingMessage: null,
    SendTo: [],
  },
  editId: "5f0df660b1f94a48481ba406",
  clientDetails:{},
  clientData: {},
  sentProgram:null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PROGRAMS_LIST":
      return {
        ...state,
        Programs: action.payload.items,
      };
    case "DELETE_SENT_PROGRAM":
      return {
        ...state,
        sentProgram:null
      }
    case "UPDATE_INSTRUCTOR_CLIENTS":
      return {
        ...state,
        clients: action.payload.clients,
      };

    case "UPDATE_CLIENT_DATA":
      return {
        ...state,
        ...action.payload,
      };

    case "UPDATE_PROGRAM_CLIENT":
      return {
        ...state,
        clientData: {
          ...state.clientData,
          Program: {
            ...state.clientData.Program,
            ...action.payload,
          },
        },
      };
    case "SET_BUFFER":
      return {
        ...state,
        Buffer: {
          ...state.Buffer,
          ...action.payload,
        },
      };
    case "EDIT_ID":
      return {
        ...state,
        editId: action.payload.editId,
      };
    case "DELETE_PROGRAM":
      return {
        ...state,
        Programs: state.Programs.filter((item) => item._id !== action.payload),
      };

    case "ADD_PROGRAM":
      return {
        ...state,
        Programs: [action.payload, ...state.Programs],
      };

    case "ARCHIVE_PROGRAM":
      let indexArc = state.Programs.findIndex(
        (item) => item._id === action.payload
      );
      let prgCopy = [...state.Programs];
      prgCopy[indexArc].IsArchived = true;
      return {
        ...state,
        Programs: prgCopy,
      };
    case "UNARCHIVE_PROGRAM":
      let indexUnArc = state.Programs.findIndex(
        (item) => item._id === action.payload
      );

      let prgCopyUn = [...state.Programs];
      prgCopyUn[indexUnArc].IsArchived = false;
      return {
        ...state,
        Programs: prgCopyUn,
      };

    case "INIT_PL":
      return {
        Programs: [],
        clients: [],
        Buffer: {
          Title: null,
          Type: null,
          Category: [],
          ExercisePlan: [
            [
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
            ],
            [
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
            ],
            [
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
            ],
            [
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
              { Title: "", IsRest: false, Exercise: [], Cover: null },
            ],
          ],

          DietPlan: {
            Title: null,
            File: null,
            Description: null,
          },
          PaymentType: null,
          Price: 0,
          Discount: 0,
          GreetingMessage: null,
          SendTo: [],
        },
        editId: "5f0df660b1f94a48481ba406",

        clientData: {},
      };
    default:
      return state;
  }
};
