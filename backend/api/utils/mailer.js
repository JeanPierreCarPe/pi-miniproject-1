const nodemailer = require("nodemailer");

const createTransport = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return nodemailer.createTransport({ jsonTransport: true });
};

const transport = createTransport();
const getAppUrl = () => process.env.APP_URL || `http://localhost:5173`;

async function sendPasswordResetEmail({ to, token }) {
    const from = process.env.MAIL_FROM || "no-reply@example.com";
    const baseUrl = getAppUrl().replace(/\/$/, ''); // Remove trailing slash if present
    const resetUrl = `${baseUrl}/#/reset-password?token=${encodeURIComponent(token)}`;
    const subject = "Restablecer tu contraseña";
    const text = `Usa este enlace para restablecer tu contraseña (válido 1 hora y de un solo uso):\n${resetUrl}`;
    const html = `
      <p>Usa este enlace para restablecer tu contraseña (válido <b>1 hora</b> y de un solo uso):</p>
      <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    `;
    return transport.sendMail({ from, to, subject, text, html });
}

module.exports = { sendPasswordResetEmail };


