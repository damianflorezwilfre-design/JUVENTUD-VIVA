import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // App Password
  },
});

export const sendEmailNotification = async (subject: string, text: string, html: string) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD || !process.env.ADMIN_EMAIL) {
    console.warn("Faltan variables de entorno para enviar correos (SMTP_EMAIL, SMTP_PASSWORD, ADMIN_EMAIL).");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Juventud ViVa" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
      html,
    });
    console.log("Notificación por correo enviada con éxito.");
  } catch (error) {
    console.error("Error al enviar notificación por correo:", error);
  }
};
