import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ 
        error: "Faltan variables", 
        SMTP_EMAIL_SET: !!process.env.SMTP_EMAIL, 
        SMTP_PASSWORD_SET: !!process.env.SMTP_PASSWORD 
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Test the connection
    await transporter.verify();

    return NextResponse.json({ success: true, message: "Conexión SMTP exitosa" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
