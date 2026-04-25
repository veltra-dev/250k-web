import { StudioClient } from "./studio-client";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function AdminStudioPage() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <StudioClient />
    </div>
  );
}
