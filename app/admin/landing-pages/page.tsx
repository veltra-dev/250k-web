import { AdminListContent } from "../admin-list-content";

export default function AdminLandingPagesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-primary">Landing pages</h1>
          <AdminListContent />
        </div>
      </div>
    </div>
  );
}
