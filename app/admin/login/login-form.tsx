"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSignInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(
          err.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : err.message,
        );
        return;
      }
      router.push(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setMagicLinkSent(true);
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
            <form onSubmit={handleSignInWithPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
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
                disabled={loading || !email}
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
