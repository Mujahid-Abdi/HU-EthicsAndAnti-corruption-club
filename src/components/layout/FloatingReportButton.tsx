import { Link, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingReportButton() {
  const location = useLocation();
  
  // Don't show on the report page itself
  if (location.pathname === "/report") return null;

  return (
    <Link
      to="/report"
      className="fixed bottom-6 right-6 z-50 animate-float"
    >
      <Button
        variant="alert"
        size="lg"
        className="rounded-full shadow-alert hover:shadow-lg gap-2 pr-6"
      >
        <AlertTriangle className="w-5 h-5" />
        <span className="hidden sm:inline">Report Anonymously</span>
        <span className="sm:hidden">Report</span>
      </Button>
    </Link>
  );
}
