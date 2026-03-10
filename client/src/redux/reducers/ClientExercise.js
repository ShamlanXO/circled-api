import ObjectID from 'bson-objectid';
const initialState = {
  AllPrograms: [],

  Instructor: {},

  DietPlan: {
    Title: null,
    File: null,
    Description: null,
  },

  Exercises: {
    Title: null,
    Type: null,
    Category: [],
    ExercisePlan: {
      weeks: [
        {
          days: [
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
          ],
        },
        {
          days: [
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
          ],
        },
        {
          days: [
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
          ],
        },
        {
          days: [
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
            { _id: ObjectID(), Title: '', IsRest: false, Exercise: [], Cover: null },
          ],
        },
      ],
    },

    DietPlan: {
      Title: null,
      File: null,
      Description: null,
    },
    PaymentType: null, //one time ,subscription
    Price: null,
    Discount: 0,
    GreetingMessage: null,
    orderId: null,
  },
  currentPlan: null,
  currentWeek: 0,
  currentDay: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "INIT_CLIENT_EXERCISE":
      return {
        AllPrograms: [],

        Instructor: {},

        DietPlan: {
          Title: null,
          File: null,
          Description: null,
        },

        Exercises: {
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
          ],

          DietPlan: {
            Title: null,
            File: null,
            Description: null,
          },
          PaymentType: null, //one time ,subscription
          Price: null,
          Discount: 0,
          GreetingMessage: null,
        },
      };

    case "UPDATE_ATHLETE_PLAN":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
