"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail válido."),
  password: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleSignInWithPassword(data: LoginFormValues) {
    if (!data.password?.trim()) {
      form.setError("password", { message: "Informe a senha." });
      return;
    }
    setServerError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (err) {
        const message =
          err.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : err.message;
        setServerError(message);
        toast.error(message);
        return;
      }
      toast.success("Login realizado.");
      router.push(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const email = form.getValues("email");
    const emailValid = await form.trigger("email");
    if (!emailValid || !email?.trim()) return;
    setServerError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (err) {
        setServerError(err.message);
        toast.error(err.message);
        return;
      }
      setMagicLinkSent(true);
      toast.success("Link enviado. Verifique seu e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Administração</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre para gerenciar as landing pages.
          </p>
        </div>

        {magicLinkSent ? (
          <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            Verifique seu e-mail. Enviamos um link para acessar.
          </div>
        ) : (
          <div className="space-y-6">
            <form
              onSubmit={form.handleSubmit(handleSignInWithPassword)}
              className="space-y-4"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="admin-login-email">E-mail</FieldLabel>
                      <Input
                        {...field}
                        id="admin-login-email"
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        disabled={loading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="admin-login-password">
                        Senha
                      </FieldLabel>
                      <Input
                        {...field}
                        id="admin-login-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        disabled={loading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              {serverError && (
                <p className="text-sm text-destructive" role="alert">
                  {serverError}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                <span className="bg-muted/30 px-2">ou</span>
              </div>
            </div>

            <form onSubmit={handleMagicLink} className="space-y-2">
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={loading || !form.watch("email")?.trim()}
              >
                Enviar link por e-mail
              </Button>
            </form>
          </div>
        )}

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary underline"
          >
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
