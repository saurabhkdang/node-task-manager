const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'saurabh.dang@technoscore.net',
        subject: 'Thanks for joining us!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'saurabh.dang@technoscore.net',
        subject: 'Thanks for being with us!',
        text: `Thanks for being with us this long, ${name}. Let me know why did you cancelled this.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}