const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const EmailNotification = require('./SendEmail');
const Notification = require("../models/Notifications");

class NotificationHandler {
    constructor(socket) {
        this.emailNotification = new EmailNotification(); 
        this.socket=socket
    }

    // Method to load the email template
    insertDataintoMongo(data) {
      return  new Notification({
       ...data
      }).save();
    }

   

    // Example method to send different types of notifications
    async sendNotification( to,eventType,data,email=null,config={
        email:true,
        inApp:true
    }) {
        if(config.inApp)
        await this.insertDataintoMongo(data)
        
        await this.socket.sendTo(to, eventType, data);
        if(email&&config.email)
        await this.emailNotification.sendEventNotification(eventType, email,data);
    }
}

module.exports = NotificationHandler;
