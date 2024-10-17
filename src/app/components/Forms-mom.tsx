import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function FormMae() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    alert("Respostas enviadas com sucesso!");
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Questionário para Mães</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Pergunta sobre duração da gravidez */}
        <div>
          <label className="block font-bold mb-2">
            Duração da Gravidez
          </label>
          <input
            type="text"
            placeholder="Ex: 40 semanas"
            {...register("duracao_gravidez")}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Perguntas de múltipla escolha com radio buttons */}
        <div>
          <label className="block font-bold mb-2">
            Sangramento durante a gravidez?
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Sim"
              {...register("sangramento")}
              className="mr-2"
            />
            Sim
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              value="Não"
              {...register("sangramento")}
              className="mr-2"
            />
            Não
          </label>
        </div>

        <div>
          <label className="block font-bold mb-2">
            Teve ganho de peso excessivo durante a gravidez?
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Sim"
              {...register("ganho_peso")}
              className="mr-2"
            />
            Sim
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              value="Não"
              {...register("ganho_peso")}
              className="mr-2"
            />
            Não
          </label>
        </div>

        <div>
          <label className="block font-bold mb-2">
            Tomou medicações controladas durante a gravidez?
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Sim"
              {...register("medicacoes_controladas")}
              className="mr-2"
            />
            Sim
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              value="Não"
              {...register("medicacoes_controladas")}
              className="mr-2"
            />
            Não
          </label>
        </div>

        {/* Adicionar mais perguntas conforme necessário */}
        {/* Botão de envio */}
        <Button type="submit" className="w-full">
          Enviar Respostas
        </Button>
      </form>
    </div>
  );
}