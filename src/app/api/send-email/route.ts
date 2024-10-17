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
    html: `
     <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respostas do Questionário</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: ##0c0c0c;
            border-bottom: 2px solid ##0c0c0c;
            padding-bottom: 10px;
        }
        .question {
            margin-bottom: 20px;
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
        }
        .question h2 {
            color: ##0c0c0c;
            margin-top: 0;
            font-size: 18px;
        }
        .answer {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Respostas do Questionário</h1>
    
    <div class="question">
        <h2>Informações Pessoais</h2>
        <p><strong>Grau de Parentesco:</strong> ${parentesco}</p>
        <p><strong>Data de Nascimento:</strong> ${nascimento}</p>
    </div>

    <div class="question">
        <h2>1. Relacionamento Familiar</h2>
        <div class="answer">${relacionamento}</div>
    </div>

    <div class="question">
        <h2>2. Desenvolvimento Social e Emocional</h2>
        <div class="answer">${social_emocional}</div>
    </div>

    <div class="question">
        <h2>3. Marcos de Desenvolvimento</h2>
        <div class="answer">${marcos_desenvolvimento}</div>
    </div>

    <div class="question">
        <h2>4. Comportamento e Temperamento</h2>
        <div class="answer">${comportamento_temperamento}</div>
    </div>

    <div class="question">
        <h2>5. Desafios e Dificuldades</h2>
        <div class="answer">${dificuldades}</div>
    </div>

    <div class="question">
        <h2>6. Habilidades e Interesses</h2>
        <div class="answer">${habilidades_interesses}</div>
    </div>

    <p style="font-style: italic; color: #666; margin-top: 30px;">
        Este e-mail contém informações confidenciais. Por favor, trate-o com a devida discrição.
    </p>
</body>
</html>
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
