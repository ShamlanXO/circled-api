const nodemailer = require("nodemailer");
const fs = require("fs");
var handlebars = require("handlebars");

var inlineCss = require('inline-css');


exports.sendPromoMain=(data)=>{
    var smtpTransport = nodemailer.createTransport({
        host: process.env.Smtphost,
        port: 465,
        secure: true,
        auth: {
          user: process.env.smtpUser,
          pass: process.env.smtpPass
          
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
    

    readHTMLFile(appRoot + "/templates/inlined.html", function (err, html) {
        if(err){ 
          return console.log({ ErrorOccured: err })
      
      }
      else{


        
        console.log(html); 
    
        var template = handlebars.compile(html);
        var replacements = {
         token:"token",
          email: data.email.toLowerCase(),
          avatar:data.profileImg,
          sender:data.name,
          banner:data.BannerImage,
          title:data.Title,
          message:data.GreetingMessage,
          price:data.Price,
          type:data.PaymentType,
          Link:data.Link
          
        };

        var htmlToSend = template(replacements);
        smtpTransport.verify().then(result=>{

          smtpTransport
          .sendMail({
            from: `Figgs <infos@figgs.co>`,
            to: data.email.toLowerCase(),
            subject: "Email verification",
            html: htmlToSend,
          })
          .then((result) => {
            console.log(result)
           
            //return res.status(200).send({ message: "mail sent", ServerResponse: result });
          }).catch(err =>console.log("error"));
        
      
         
      
    }).catch(err =>console.log("error"));

 

       
       
      }

     
     
          
                
              
            
          
      
      })


}

