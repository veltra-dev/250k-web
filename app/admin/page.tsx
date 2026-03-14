import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminListContent } from "./admin-list-content";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-primary">Landing pages</h1>
          <Button asChild>
            <Link href="/admin/builder">Nova página</Link>
          </Button>
        </div>
        <AdminListContent />
      </div>
    </div>
  );
}
