"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { IconLogout } from "@tabler/icons-react";

export function AdminNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // On login page we don't show sign out
  if (!user) return null;

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <IconLogout />
      Sair
    </Button>
  );
}
