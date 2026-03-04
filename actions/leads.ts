"use server";

import { supabaseServer } from "@/lib/supabase/server";

export type LeadState =
  | { success: true; message: string }
  | { success: false; message: string }
  | null;

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const source = (formData.get("source") as string)?.trim() || "contato";

  if (!name || name.length < 2) {
    return { success: false, message: "Por favor, informe seu nome." };
  }
  if (!email) {
    return { success: false, message: "Por favor, informe seu e-mail." };
  }
  if (!validEmail(email)) {
    return { success: false, message: "Informe um e-mail válido." };
  }
  if (!message || message.length < 10) {
    return {
      success: false,
      message: "Por favor, escreva sua mensagem (mínimo 10 caracteres).",
    };
  }

  try {
    const { error } = await supabaseServer.from("leads").insert({
      name,
      email,
      message,
      source: source || null,
    });

    if (error) {
      console.error("Lead insert error:", error);
      return {
        success: false,
        message: "Não foi possível enviar. Tente novamente em instantes.",
      };
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "250k Contato <leopoldinodev@gmail.com>",
          to: [email],
          replyTo: email,
          subject: `Contato 250k: ${name}`,
          text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`,
        });
      } catch (e) {
        console.error("Resend error (lead still saved):", e);
      }
    }

    return {
      success: true,
      message: "Mensagem enviada com sucesso. Retornaremos em breve.",
    };
  } catch (e) {
    console.error("Submit lead error:", e);
    return {
      success: false,
      message: "Ocorreu um erro. Tente novamente mais tarde.",
    };
  }
}
