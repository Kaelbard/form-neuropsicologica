"use client";

import { useEffect, useState } from "react";

interface FormData {
  parentesco: string;
  nascimento: string;
  relacionamento: string;
  social_emocional: string;
  marcos_desenvolvimento: string;
  comportamento_temperamento: string;
  dificuldades: string;
  habilidades_interesses: string;
}

export default function Form() {
  const [formData, setFormData] = useState<FormData>({
    parentesco: "",
    nascimento: "",
    relacionamento: "",
    social_emocional: "",
    marcos_desenvolvimento: "",
    comportamento_temperamento: "",
    dificuldades: "",
    habilidades_interesses: "",
  });

  const [success, setSuccess] = useState(false); // Controla o estado da tela de sucesso
  const [started, setStarted] = useState(false); // Controla o estado da introdução
  const [completed, setCompleted] = useState(false); // Controla se o teste já foi completado

  const isOver18 = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica se a idade é maior que 18 anos
    if (isOver18(formData.nascimento) < 18) {
      alert("Você precisa ter mais de 18 anos para enviar o formulário.");
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({
          parentesco: "",
          nascimento: "",
          relacionamento: "",
          social_emocional: "",
          marcos_desenvolvimento: "",
          comportamento_temperamento: "",
          dificuldades: "",
          habilidades_interesses: "",
        }); // Limpa os campos do formulário

        // Salva no localStorage que o teste foi completado
        localStorage.setItem("testeCompletado", "true");
      } else {
        alert("Erro ao enviar respostas.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao enviar respostas.");
    }
  };

  // Verifica se o teste já foi completado ao carregar a página
  useEffect(() => {
    const testeCompletado = localStorage.getItem("testeCompletado");
    if (testeCompletado === "true") {
      setCompleted(true); // Atualiza o estado para indicar que o teste foi completado
    }
  }, []);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-100 shadow-lg mt-6 rounded-lg text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Cadastro Enviado com Sucesso!
        </h1>
        <p className="text-lg text-green-600">
          Obrigado por preencher o questionário. Recebemos suas respostas.
        </p>
        <button
          onClick={() => (window.location.href = "https://www.google.com")} // Redireciona para o Google
          className="mt-6 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
        >
          Sair do cadastro
        </button>
      </div>
    );
  }

  // Página inicial, verifica se o teste já foi completado
  if (!started) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-6 rounded-lg text-center">
        {completed ? (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-6">
              Você já completou este teste!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Você já enviou este formulário anteriormente. Caso precise revisar
              ou alterar suas respostas, entre em contato com o suporte.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Bem-vindo à Avaliação Neuropsicológica do Christiano de Figueiredo Barbosa
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Este questionário tem como objetivo entender aspectos do
              desenvolvimento e comportamento de indivíduos com base nas
              observações de seus familiares durante a sua infância. Suas respostas são essenciais para
              ajudar na avaliação neuropsicológica. Por favor, responda com
              sinceridade.
            </p>
            <button
              onClick={() => setStarted(true)} // Iniciar o formulário
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Iniciar Questionário
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-6 rounded-lg">
      <h2 className="text-xl font-semibold text-center text-gray-600 mb-6">
        Questionário para Familiares
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="parentesco" className="block font-bold text-gray-700">
            Grau de Parentesco
          </label>
          <input
            type="text"
            id="parentesco"
            name="parentesco"
            value={formData.parentesco}
            onChange={handleChange}
            placeholder="Ex: Pai, Mãe, Tio, Avô"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="nascimento" className="block font-bold text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="nascimento"
            name="nascimento"
            value={formData.nascimento}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="relacionamento"
            className="block font-bold text-gray-700"
          >
            1. Como era o relacionamento da criança com os pais e irmãos durante
            os primeiros anos de vida? Pode descrever alguma situação marcante
            que exemplifique esse relacionamento?
          </label>
          <textarea
            id="relacionamento"
            name="relacionamento"
            value={formData.relacionamento}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="social_emocional"
            className="block font-bold text-gray-700"
          >
            2. Como você descreveria a forma como a criança se relacionava com
            outras crianças e adultos na sua infância? Ela era mais tímida,
            extrovertida, independente ou dependente? Houve mudanças
            significativas nesse comportamento ao longo do tempo?
          </label>
          <textarea
            id="social_emocional"
            name="social_emocional"
            value={formData.social_emocional}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="marcos_desenvolvimento"
            className="block font-bold text-gray-700"
          >
            3. Quais foram os marcos de desenvolvimento mais importantes que
            você observou, como o momento em que ela começou a andar ou falar?
            Houve algum atraso ou preocupação com o desenvolvimento físico ou
            cognitivo?
          </label>
          <textarea
            id="marcos_desenvolvimento"
            name="marcos_desenvolvimento"
            value={formData.marcos_desenvolvimento}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="comportamento_temperamento"
            className="block font-bold text-gray-700"
          >
            4. Como você descreveria o temperamento da criança durante os
            primeiros anos? Ela era mais calma, agitada, teimosa ou facilmente
            frustrada? Pode citar exemplos de situações em que essas
            características eram mais evidentes?
          </label>
          <textarea
            id="comportamento_temperamento"
            name="comportamento_temperamento"
            value={formData.comportamento_temperamento}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="dificuldades"
            className="block font-bold text-gray-700"
          >
            5. Houve algum comportamento ou desafio específico que você percebeu
            durante a infância, como dificuldade de atenção, hiperatividade, ou
            problemas com a alimentação ou sono? Como a família lidava com esses
            desafios?
          </label>
          <textarea
            id="dificuldades"
            name="dificuldades"
            value={formData.dificuldades}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="habilidades_interesses"
            className="block font-bold text-gray-700"
          >
            6. Havia algo em que a criança demonstrava interesse especial ou
            talento desde cedo, como música, esportes ou desenhos? Como esse
            interesse evoluiu ao longo do tempo?
          </label>
          <textarea
            id="habilidades_interesses"
            name="habilidades_interesses"
            value={formData.habilidades_interesses}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          ></textarea>
        </div>

        <div>
          <input
            type="submit"
            value="Enviar Respostas"
            className="w-full bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200"
          />
        </div>
      </form>
    </div>
  );
}
