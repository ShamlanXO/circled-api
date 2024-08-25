const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const NotificationEvents = require('../constants/NotificationEvents');

class EmailNotification {
    constructor() {
        this.logo="https://ik.imagekit.io/figgs/system/Group%2010342_Z_1kPaFiUO.png?updatedAt=1724569624510"
        // Configure the transporter for sending emails
        this.transporter = nodemailer.createTransport({
            host: process.env.Smtphost,
            port: 465,
            secure: true,
            auth: {
              user: process.env.smtpUser,
              pass: process.env.smtpPass,
            },
          });

        // Define the templates directory
        this.templatesDir = path.join(appRoot, 'templates/v2');
    }

    // Method to load the email template
    loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, `${templateName}.html`);
        const source = fs.readFileSync(templatePath, 'utf8');
        return handlebars.compile(source);
    }

    // Method to send the email notification
    async sendEmail(to, subject, templateName, context) {
        const template = this.loadTemplate(templateName);
        console.log(context)
        const htmlContent = template({
            ...context,
            emailTitle:context.emailTitle||"Notification",
            logo:this.logo});

        const mailOptions = {
            from: `Circled.fit <noreply@circled.fit>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Example method to send different types of notifications
    async sendEventNotification(eventType, to, context) {
        let subject;
        let templateName;
      
        switch (eventType) {
            case NotificationEvents.INVITE_CLIENT:
                subject = "Invitation to circled.fit";
                templateName = 'invite_client';
                break;
            case NotificationEvents.ACCEPT_INVITE:
                subject = 'Invitation accepted';
                templateName = 'notification';
                break;
            case NotificationEvents.SEND_PROGRAM:
                subject = 'New workout program';
                templateName = 'notification';
                break;
            case NotificationEvents.SUBSCRIBED_PROGRAM:
                subject = 'New program subscription';
                templateName = 'notification';
                break;
            default:
                subject=context.subject
                templateName="notification"
        }

        await this.sendEmail(to, subject, templateName, context);
    }
}

module.exports = EmailNotification;
