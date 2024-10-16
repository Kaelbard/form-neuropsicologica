import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const {
    parentesco,
    nascimento,
    relacionamento,
    social_emocional,
    marcos_desenvolvimento,
    comportamento_temperamento,
    dificuldades,
    habilidades_interesses,
  } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("E-mail:", process.env.EMAIL); // Verifique se a variável de ambiente está correta
  console.log("Senha:", process.env.EMAIL_PASS); // Verifique se a senha está correta

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_SENDER,
    subject: "Respostas do Questionário",
    text: `
      Grau de Parentesco: ${parentesco}
      Data de Nascimento: ${nascimento}
      Relacionamento: ${relacionamento}
      Social/Emocional: ${social_emocional}
      Marcos de Desenvolvimento: ${marcos_desenvolvimento}
      Comportamento/Temperamento: ${comportamento_temperamento}
      Dificuldades: ${dificuldades}
      Habilidades/Interesses: ${habilidades_interesses}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
