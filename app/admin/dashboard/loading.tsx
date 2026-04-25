import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto max-w-6xl px-4 py-5">
        <Skeleton className="mb-2 h-8 w-44 max-w-full sm:w-52" />
        <div className="mb-4 max-w-3xl space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[78%]" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56 max-w-full sm:w-72" />
            </CardHeader>
            <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
              <Skeleton className="size-full rounded-lg" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-64 max-w-full sm:w-80" />
            </CardHeader>
            <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
              <Skeleton className="size-full rounded-lg" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-56 max-w-full sm:w-72" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </CardHeader>
            <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
              <Skeleton className="size-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
