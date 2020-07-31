const userRoutes = require("./user");
const otpRoutes = require("./otp");
const miscRoutes = require("./misc");
const programRoutes=require("./Programs");
const libraryRoutes=require("./Library")
const orderRoutes =require("./PurchasedProgram")
module.exports = function(app) {
  app.use("/api/user", userRoutes);
  app.use("/api/otp", otpRoutes);
app.use("/api/library",libraryRoutes)

  // app.use("/api/candidate", candidateRoutes);
app.use("/api/program",programRoutes)
  // app.use("/api/payment", paymentRoutes);
  app.use("/api/misc", miscRoutes);

   app.use("/api/order", orderRoutes);


  // app.use("/api/notification", NotificationRoutes);
};
