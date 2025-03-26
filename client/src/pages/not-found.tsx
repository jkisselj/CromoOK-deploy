import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <div>
        <Button asChild>
          <Link to="/" className="text-white">
            <ArrowLeft className="size-4 mr-2 text-white" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
