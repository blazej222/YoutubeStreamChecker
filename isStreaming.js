import { parse } from 'node-html-parser'
import fetch from 'node-fetch'
import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'

function sendEmail(){
    //var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAUTH2',
        user: process.env.EMAIL_FROM,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
    });

    var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: process.env.SUBJECT,
    text: process.env.CONTENT
    };


    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

dotenv.config()

const channelID = process.env.CHANNEL_ID
const response = await fetch(`https://youtube.com/channel/${channelID}/live`)
const text = await response.text()
const html = parse(text)
const canonicalURLTag = html.querySelector('link[rel=canonical]')
const canonicalURL = canonicalURLTag.getAttribute('href')
const isStreaming = canonicalURL.includes('/watch?v=')

console.log(isStreaming)

if (!isStreaming){
    console.log('Sending email!')
    sendEmail()
}
