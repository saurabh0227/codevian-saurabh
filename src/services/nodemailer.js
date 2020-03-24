import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';


export const mail = (email, url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '***@gmail.com', //Here email id goes
            pass: '******' //Here password fro above mentioned emailid
        }
    });

    transporter.sendMail({
        to: email,
        from: '***@gmail.com', //Emailid from which email will send
        subject: `Confirm email`,
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
    }, (err, info) => {
        if (err)
            console.log(err)
        else
            console.log(info);
    })
}