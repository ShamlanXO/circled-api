const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "lms-api", // Title of the documentation
    version: "1.0.0", // Version of the app
    description: `>-
    1) Login and get JWT token. Click green button "Authorize". Paste JWT as "<JWT>" Explore APIs! :)` // short description of the app
  },
  schemes: ["https", "http"],
  consumes: "application/json",
  produces: "application/json",
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      in: "header",
      name: "Authorization"
    }
  },
  basePath: "/api/" // the basepath of your endpoint
};
// the host or url of the app
switch (process.env.NODE_ENV) {
  case "DEV":
    swaggerDefinition.host = "localhost:3001";
    swaggerDefinition.schemes = ["http", "https"];
    break;
  case "PROD":
    swaggerDefinition.host = process.env.APP_PROD_PORT;
    break;
  default:
    swaggerDefinition.host = "localhost:3001";
    break;
}

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./documentation/**/*.yaml'],
};
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
