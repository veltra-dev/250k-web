"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead, type LeadState } from "@/actions/leads";

const initialState: LeadState = null;

export function ContactForm() {
  const [state, action, isPending] = useActionState(submitLead, initialState);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="source" value="contato" />
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Seu nome"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Como podemos ajudar?"
          rows={5}
          disabled={isPending}
        />
      </div>
      {state && (
        <p
          className={
            state.success
              ? "text-sm text-green-600 dark:text-green-400"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
