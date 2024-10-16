"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  parentesco: z.string().min(1, "Campo obrigatório"),
  nascimento: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "Você precisa ter mais de 18 anos para enviar o formulário."),
  relacionamento: z.string().min(1, "Campo obrigatório"),
  social_emocional: z.string().min(1, "Campo obrigatório"),
  marcos_desenvolvimento: z.string().min(1, "Campo obrigatório"),
  comportamento_temperamento: z.string().min(1, "Campo obrigatório"),
  dificuldades: z.string().min(1, "Campo obrigatório"),
  habilidades_interesses: z.string().min(1, "Campo obrigatório"),
});

export default function QuestionnaireForm() {
  const [formStep, setFormStep] = useState<"intro" | "questions" | "success">(
    "intro"
  );
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentesco: "",
      nascimento: "",
      relacionamento: "",
      social_emocional: "",
      marcos_desenvolvimento: "",
      comportamento_temperamento: "",
      dificuldades: "",
      habilidades_interesses: "",
    },
  });

  useEffect(() => {
    const testeCompletado = localStorage.getItem("testeCompletado");
    if (testeCompletado === "true") {
      setFormStep("success");
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        localStorage.setItem("testeCompletado", "true");
        setFormStep("success");
        form.reset();
      } else {
        throw new Error("Erro ao enviar respostas.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao enviar as respostas. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (formStep === "intro") {
    return (
      <Card className="max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Bem-vindo à Avaliação Neuropsicológica</CardTitle>

          <CardDescription>
            <div className="text-muted-foreground mt-2">
              Este questionário tem como objetivo entender aspectos do
              desenvolvimento e comportamento de indivíduos com base nas
              observações de seus familiares durante a sua infância.
            </div>
            <div className="text-muted-foreground">
              Suas respostas são essenciais para ajudar na avaliação
              neuropsicológica.
            </div>
            <div className="text-muted-foreground">
              Por favor, responda com sinceridade. E caso não lembre de algum
              dos fatos perguntados, preencha com <b>"Não me recordo"</b>.
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setFormStep("questions")}>
            Iniciar Questionário
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (formStep === "success") {
    return (
      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Cadastro Enviado com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Obrigado por preencher o questionário. Recebemos suas respostas.
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "https://www.google.com")}
          >
            Sair do cadastro
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Questionário para Familiares</CardTitle>
        <CardDescription>
          Por favor, preencha todos os campos abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="parentesco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grau de Parentesco</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pai, Mãe, Tio, Avô..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {[
              "relacionamento",
              "social_emocional",
              "marcos_desenvolvimento",
              "comportamento_temperamento",
              "dificuldades",
              "habilidades_interesses",
            ].map((fieldName, index) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${index + 1}. ${getQuestionLabel(
                      fieldName
                    )}`}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">
              Enviar Respostas
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function getQuestionLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    relacionamento:
      "Como era o relacionamento da criança com os pais e irmãos durante os primeiros anos de vida? Pode descrever alguma situação marcante que exemplifique esse relacionamento?",
    social_emocional:
      "Como você descreveria a forma como a criança se relacionava com outras crianças e adultos na sua infância? Ela era mais tímida, extrovertida, independente ou dependente? Houve mudanças significativas nesse comportamento ao longo do tempo?",
    marcos_desenvolvimento:
      "Quais foram os marcos de desenvolvimento mais importantes que você observou, como o momento em que ela começou a andar ou falar? Houve algum atraso ou preocupação com o desenvolvimento físico ou cognitivo?",
    comportamento_temperamento:
      "Como você descreveria o temperamento da criança durante os primeiros anos? Ela era mais calma, agitada, teimosa ou facilmente frustrada? Pode citar exemplos de situações em que essas características eram mais evidentes?",
    dificuldades:
      "Houve algum comportamento ou desafio específico que você percebeu durante a infância, como dificuldade de atenção, hiperatividade, ou problemas com a alimentação ou sono? Como a família lidava com esses desafios?",
    habilidades_interesses:
      "Havia algo em que a criança demonstrava interesse especial ou talento desde cedo, como música, esportes ou desenhos? Como esse interesse evoluiu ao longo do tempo?",
  };
  return labels[fieldName] || "";
}
