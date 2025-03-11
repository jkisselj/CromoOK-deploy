import { Card, CardContent } from "@/components/ui/card";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
