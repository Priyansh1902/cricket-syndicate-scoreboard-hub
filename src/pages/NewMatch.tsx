import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTeams, getTournaments } from "@/lib/supabase";
import { Team, Tournament } from "@/types";
import { toast } from "sonner";
import { TeamSelectionStep } from "./match/components/TeamSelectionStep";
import { MatchDetailsStep } from "./match/components/MatchDetailsStep";
import { TossDetailsStep } from "./match/components/TossDetailsStep";
import { ConfirmationStep } from "./match/components/ConfirmationStep";
import { useMatchForm } from "./match/hooks/useMatchForm";

const NewMatch = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    currentStep, 
    matchDetails, 
    handleInputChange, 
    handleSelectChange, 
    nextStep, 
    prevStep,
    handleSubmit 
  } = useMatchForm();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [teamsData, tournamentsData] = await Promise.all([
          getTeams(),
          getTournaments()
        ]);
        setTeams(teamsData as Team[]);
        setTournaments(tournamentsData as Tournament[]);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load teams and tournaments");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading && teams.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cricket-darkest">
        <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderStep = () => {
    const commonProps = {
      matchDetails,
      handleInputChange,
      handleSelectChange,
      teams,
      tournaments,
      isLoading
    };

    switch (currentStep) {
      case 1:
        return (
          <TeamSelectionStep
            {...commonProps}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <MatchDetailsStep
            {...commonProps}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <TossDetailsStep
            {...commonProps}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            {...commonProps}
            prevStep={prevStep}
            onSubmit={() => handleSubmit(teams, tournaments)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto">
          <Link to="/matches" className="text-cricket-primary hover:text-cricket-accent flex items-center mb-4">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Matches
          </Link>
          <h1 className="text-2xl font-bold">Create New Match</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-cricket-primary' : 'bg-cricket-dark text-gray-400'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-cricket-primary' : 'bg-cricket-dark'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-cricket-primary' : 'bg-cricket-dark text-gray-400'}`}>
                  <Info className="w-5 h-5" />
                </div>
                <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-cricket-primary' : 'bg-cricket-dark'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-cricket-primary' : 'bg-cricket-dark text-gray-400'}`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className={`h-1 w-16 ${currentStep >= 4 ? 'bg-cricket-primary' : 'bg-cricket-dark'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-cricket-primary' : 'bg-cricket-dark text-gray-400'}`}>
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Teams</span>
              <span>Match Details</span>
              <span>Toss</span>
              <span>Confirm</span>
            </div>
          </div>

          <Card className="cricket-card border-cricket-border">
            {renderStep()}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewMatch;
