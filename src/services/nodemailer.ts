import {useAwsServices} from "./aws";
const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');
import * as aws from "@aws-sdk/client-ses";
const awsService = useAwsServices();


export const useNodemailerServices = () => {
    const sendMail = async (mailOptions) => {
        const transporter = await nodemailer.createTransport({
            service: 'SendinBlue', // no need to set host or port etc.
            auth: {
                user: process.env.SENDING_BLUE_USER,
                pass: process.env.SENDIN_BLUE_PASS
            }
            // port: 465,
            // host: 'email-smtp.us-east-1.amazonaws.com',
            // secure: true,
            // auth: {
            //     user: 'AKIAUN5PCHRBLC3YREHX',
            //     pass: 'BCGfZFRqcwYDo+Y6eX7Ev6+ux3YgzOUy4uDcf7dXck4a'
            // }
        });
        transporter.use(
            "compile", hbs({
                viewEngine: {
                    extname: '.handlebars', // handlebars extension
                    layoutsDir: `${path.resolve('./src/email_templates/layouts')}`,
                    defaultLayout: 'template', // name of main template
                },
                viewPath: `${path.resolve('./src/email_templates')}`,
                extName: '.handlebars',
            }));
        return await transporter.sendMail(mailOptions)
    }
    return {sendMail}
}


