
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const PlayerHeader = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/players">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
              Cricket Syndicate
            </Link>
            <h1 className="text-2xl font-bold mt-1">New Player</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
