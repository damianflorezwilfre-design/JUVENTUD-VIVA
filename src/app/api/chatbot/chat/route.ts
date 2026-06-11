import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        response: "Lo siento, la inteligencia artificial aún no tiene su Clave API conectada. Por favor avisa a la administración." 
      });
    }

    // Fetch FAQs from DB to use as context
    const faqs = await prisma.chatbotFaq.findMany();
    const context = faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join('\n\n');

    const prompt = `
Eres "Guía ViVa", el asistente virtual inteligente de la Fundación Juventud ViVa. 
Tu misión es ayudar a las personas que visitan la página web de la fundación, siendo siempre muy amable, entusiasta y servicial.
Usa emojis para hacer la conversación amena.

A continuación, tienes una base de conocimientos extraída de la base de datos de la fundación. 
Usa ESTA información para responder a las preguntas del usuario. Si el usuario hace una pregunta cuya respuesta no está explícitamente aquí, pero puedes deducirla o dar una respuesta genérica sobre la fundación, hazlo. Si es algo totalmente ajeno a la fundación, dile amablemente que solo puedes ayudar con temas de Juventud ViVa.

Base de conocimientos:
${context}

Pregunta del usuario: ${message}
Respuesta de Guía ViVa:
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json({ 
      response: "Lo siento, mi conexión cerebral está un poco lenta en este momento. Intenta preguntar de nuevo más tarde." 
    }, { status: 500 });
  }
}
