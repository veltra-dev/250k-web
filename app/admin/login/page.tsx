import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Carregando…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
