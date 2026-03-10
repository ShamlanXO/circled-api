import ObjectID from 'bson-objectid';

const initialState = {
  Title: '',

  Category: [],
  BannerImage: '',
  Description: '',
  Duration: 4,
  Recievers: [],
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
  PaymentType: 'Free', //"Subscription" ,"OneTime","Free"
  Price: 0,
  Discount: 0,

  GreetingMessage: null,
  SendTo: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRAM':
      return {
        ...state,
        ...action.payload,
      };
    case 'INIT_PROGRAM':
      return {
        ...action.payload,
      };

    case 'INIT_NEW_PROGRAM':
      return {
        Title: '',

        Duration: 4,
        Category: ['test'],
        ExercisePlan: {
          weeks: [
            {
              days: [
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
              ],
            },
            {
              days: [
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
              ],
            },
            {
              days: [
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
              ],
            },
            {
              days: [
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
              ],
            },
          ],
        },

        SendTo: [],
        DietPlan: {
          Title: null,
          File: null,
          Description: null,
        },
        PaymentType: 'Free', //one time ,subscription
        Price: 0,
        Description: '',
        Discount: 0,
        GreetingMessage: null,
      };

    default:
      return state;
  }
};
