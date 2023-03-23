const nodemailer = require("nodemailer");
const fs = require("fs");
var handlebars = require("handlebars");

var inlineCss = require("inline-css");

exports.sendPromoMain = (data) => {
  var smtpTransport = nodemailer.createTransport({
    host: process.env.Smtphost,
    port: 465,
    secure: true,
    auth: {
      user: process.env.smtpUser,
      pass: process.env.smtpPass,
    },
  });

  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  readHTMLFile(appRoot + "/templates/sendProg2.html", function (err, html) {
    if (err) {
      return console.log({ ErrorOccured: err });
    } else {
      console.log(html);

      var template = handlebars.compile(html);
      var replacements = {
        token: "token",
        email: data.email.toLowerCase(),
        avatar: data.profileImg,
        sender: data.name,
        banner: data.BannerImage,
        title: data.Title,
        message:
          data.GreetingMessage ||
          "I have sent you this program based on the plan we discussed.",
        price: data.Price,
        description: data.description,
        type: data.PaymentType,
        Link: data.Link,
      };

      var htmlToSend = template(replacements);
      smtpTransport
        .verify()
        .then((result) => {
          smtpTransport
            .sendMail({
              from: `noreply@figgs.co`,
              to: data.email.toLowerCase(),
              subject: `${data.name} sent you a fitness program`,
              html: htmlToSend,
            })
            .then((result) => {
              console.log(result);

              //return res.status(200).send({ message: "mail sent", ServerResponse: result });
            })
            .catch((err) => console.log("error"));
        })
        .catch((err) => console.log("error"));
    }
  });
};
