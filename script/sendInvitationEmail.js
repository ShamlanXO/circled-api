const nodemailer = require("nodemailer");
const fs = require("fs");
var handlebars = require("handlebars");

var inlineCss = require("inline-css");



exports.sendInvitationMail = (data) => {
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

  readHTMLFile(appRoot + "/templates/AcceptInvitation.html", function (err, html) {
    if (err) {
      return console.log({ ErrorOccured: err });
    } else {
      console.log(html);

      var template = handlebars.compile(html);
      var replacements = {
        Link: data.link,
        email: data.email.toLowerCase(),
        avatar: data.profileImg,
        sender: data.name,
        banner: data.BannerImage,
        title: data.Title,
        message: data.message,
     
        
      };

      var htmlToSend = template(replacements);
      smtpTransport
        .verify()
        .then((result) => {
          smtpTransport
            .sendMail({
              from: `Circled.fit <noreply@circled.fit>`,
              to: data.email.toLowerCase(),
              subject: `${data.name}`,
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