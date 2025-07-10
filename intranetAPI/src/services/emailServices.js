const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leonelajob1@gmail.com',//debe estar el mail de la empresa
        pass: 'clave123456789',
    },
});

async function enviarEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"Interferencias" <leonelajob1@gmail.com>',
            to,
            subject,
            html,
        });

        console.log('Email enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error al enviar email:', error.message);
        return { success: false, error: error.message };
    }
}
   
module.exports = {enviarEmail};