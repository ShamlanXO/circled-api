const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const mongoose = require("mongoose");
const AdminBroMongoose = require("admin-bro-mongoose");
const User = require("../models/user");
const Candidate = require("../models/Candidate");
const Cart = require("../models/Cart");
const DailyMains = require("../models/DailyMains");
const Notifications = require("../models/Notifications");
const Orders = require("../models/Orders");
const Payment = require("../models/Payment");
const TestSeries = require("../models/TestSeries");
const Centre = require("../models/Centre");
const Batch = require("../models/Batch");
const Mail = require("../models/Mail");
const TestSet = require("../models/TestSet");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
function FetchPayment() {
  Payment.aggregate([{ $group: { _id: null, sum: { $sum: "$Amount" } } }]).then(
    result => {
      return result[0].sum;
    }
  );
}
var smtpTransport = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "support@rankerstack.com",
    pass: "test@123!"
  }
});
AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  logoutPath: "/admin/logout",
  branding: {
    companyName: "Rankerstack.com"
  },

  pages: {
    // customPage: {
    //   label: "Tools",
    //   handler: async () => {
    //     return {
    //       ToolsToken: await jwt.sign(
    //         { temptoken: "itsaverylongtoken" },
    //         "tempAuth",
    //         { expiresIn: "1h" }
    //       )
    //     };
    //   },
    //   component: AdminBro.bundle("../components/Uploader.jsx")
    // }
  },
  // dashboard: {
  //   handler: async () => {
  //     return {
  //       TotalUsers: await User.countDocuments(),
  //       TotalPrelimsSeries: await User.find({
  //         SeriesType: "Prelims"
  //       }).countDocuments(),
  //       TotalMainsSeries: await TestSeries.find({
  //         SeriesType: "Mains"
  //       }).countDocuments(),
  //       TotalDailyMains: await DailyMains.countDocuments(),
  //       TotalCandidates: await Candidate.countDocuments(),
  //       TotalMailSent: await Mail.countDocuments(),
  //       TotalTestSets: await TestSet.countDocuments(),
  //       TotalPayment: await FetchPayment()
  //     };
  //   },
  //   component: AdminBro.bundle("../components/Dashboard.jsx")
  // },
  version: {
    admin: true
  },
  resources: [
    {
      resource: User,

      options: {
        properties: {
          Password: {
            isVisible: { list: false, filter: false, show: true, edit: true }
          },
          Bio: {
            isVisible: { list: false, filter: true, show: true, edit: true }
          },
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          }
        },
        actions: {
          new: {
            before: async request => {
              if (request.payload.Password) {
                request.payload.Password = await bcrypt.hash(
                  request.payload.Password,
                  10
                );
              }
              return request;
            }
          }
        }
      }
    },
    {
      resource: TestSet,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          ExamName: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          SubjectName: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          Topic: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: TestSeries,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          Description: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          ExamName: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          SubjectName: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          SubjectTopic: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: DailyMains,
      options: {
        properties: {
          Subject: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          Evaluators: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          Question: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          AnswerOutline: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          QuestionAttachment: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          ViewedBy: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          LikedBy: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          SubmittedAnswers: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: Candidate,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          PaperStructure: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          DailyMains: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          Answer: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: Centre,
      options: {}
    },
    {
      resource: Batch,
      options: {}
    },
    {
      resource: Cart,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          Items: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: Orders,
      options: {}
    },
    {
      resource: Payment,
      options: {}
    },
    {
      resource: Notifications,
      options: {
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: true, edit: false }
          },
          Description: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          },
          Link: {
            isVisible: { list: false, filter: true, show: true, edit: false }
          }
        }
      }
    },
    {
      resource: Mail,
      options: {
        actions: {
          new: {
            before: async request => {
              if (request.payload.To) {
                try {
                  const mailStatus = await smtpTransport.sendMail({
                    from: `RankerStack <support@rankerstack.com>`,
                    to: request.payload.To,
                    subject: request.payload.Subject,
                    html: request.payload.Body
                  });
                  request.payload.Status = "Delivered";
                  return request;
                } catch (error) {
                  request.payload.Status = "Pending";
                  return request;
                }
              }
            }
          }
        },
        properties: {
          From: {
            isVisible: { list: true, filter: true, show: true, edit: false }
          },
          Status: {
            isVisible: { list: true, filter: true, show: true, edit: false }
          },
          Body: { type: "richtext" }
        }
      }
    }
  ],
  rootPath: "/admin"
});
const ADMIN = {
  email: "admin@rankerstack.com",
  pwd: "iamadmin"
};
exports.AdminController = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    // const user = await User.findOne({ Email: email, UserType: "Admin" });
    // if (user) {
    //   const matched = await bcrypt.compare(password, user.Password);
    //   if (matched) {
    //     email = User.Email;
    //     password = User.Password;
    //     return user;
    //   }
    // }
    // return false;
    if (ADMIN.pwd === password && ADMIN.email === email) {
      return ADMIN;
    }
    return null;
  },
  cookieName: "helloword",
  cookiePassword: "super-long-password-which-is-a-secret"
});
