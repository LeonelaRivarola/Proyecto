const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leonelajob1@gmail.com',//debe estar el mail de la empresa
        pass: 'ikwb vwqg pylh yhta', //cambiar por la clave de ellos creada
    },
});

async function enviarEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({//Cambiar aca con el mail que se va a mandar cada mail
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