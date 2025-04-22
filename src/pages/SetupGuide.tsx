
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Plus, Users, Trophy, Calendar } from "lucide-react";

const SetupGuide = () => {
  return (
    <div className="container max-w-4xl py-10 px-4 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">Quick Setup Guide</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Follow these steps to get started with Cricket Syndicate and set up your first match.
        </p>
      </div>

      <div className="space-y-6">
        <SetupStep 
          number={1} 
          title="Create Players" 
          description="Add players with their details like batting hand, bowling style, and photo."
          icon={<Users className="h-8 w-8 text-blue-500" />}
          linkTo="/players/new"
          linkText="Add Player"
        />
        
        <SetupStep 
          number={2} 
          title="Create Teams" 
          description="Create teams and assign players, captain, vice-captain, and wicket keeper."
          icon={<Users className="h-8 w-8 text-green-500" />}
          linkTo="/teams/new"
          linkText="Create Team"
        />
        
        <SetupStep 
          number={3} 
          title="Set Up a Tournament (Optional)" 
          description="Organize your matches into tournaments for league or series play."
          icon={<Trophy className="h-8 w-8 text-yellow-500" />}
          linkTo="/tournaments/new"
          linkText="Create Tournament"
          optional
        />
        
        <SetupStep 
          number={4} 
          title="Start a Match" 
          description="Create a new match, select teams, and start scoring."
          icon={<Calendar className="h-8 w-8 text-purple-500" />}
          linkTo="/matches/new"
          linkText="Start New Match"
          isLast
        />
      </div>

      <div className="mt-12 text-center">
        <Button asChild className="mr-4">
          <Link to="/matches/new">Start First Match</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

// Helper component for setup steps
interface SetupStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  linkText: string;
  optional?: boolean;
  isLast?: boolean;
}

const SetupStep: React.FC<SetupStepProps> = ({ 
  number, 
  title, 
  description, 
  icon, 
  linkTo, 
  linkText, 
  optional = false,
  isLast = false
}) => {
  return (
    <Card className="relative">
      {!isLast && (
        <div className="absolute left-10 top-[calc(100%-8px)] h-6 w-px border-l-2 border-dashed border-gray-300 dark:border-gray-700" />
      )}
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
          {icon}
        </div>
        <div>
          <CardTitle className="flex items-center">
            Step {number}: {title}
            {optional && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal rounded-full px-2 py-0.5 bg-gray-100 dark:bg-gray-800">
                Optional
              </span>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center pt-0">
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          <span>Improves your cricket management</span>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={linkTo} className="flex items-center">
            {linkText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SetupGuide;
