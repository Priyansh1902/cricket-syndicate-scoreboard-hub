
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTeams, getTournaments } from "@/lib/supabase";
import { Team, Tournament } from "@/types";
import { useMatchForm } from "./match/hooks/useMatchForm";
import { TeamSelectionStep } from "./match/components/TeamSelectionStep";
import { MatchDetailsStep } from "./match/components/MatchDetailsStep";
import { TossDetailsStep } from "./match/components/TossDetailsStep";
import { ConfirmationStep } from "./match/components/ConfirmationStep";

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
    const fetchData = async () => {
      try {
        const fetchedTeams = await getTeams();
        const fetchedTournaments = await getTournaments();
        
        setTeams(fetchedTeams);
        setTournaments(fetchedTournaments);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const commonProps = {
    matchDetails,
    handleInputChange,
    handleSelectChange,
    teams,
    tournaments,
    isLoading
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <header className="py-4 px-6 border-b border-cricket-border flex items-center">
          <Link to="/" className="mr-4">
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-bold">Create New Match</h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {currentStep === 1 && <TeamSelectionStep {...commonProps} nextStep={nextStep} />}
            {currentStep === 2 && <MatchDetailsStep {...commonProps} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 3 && <TossDetailsStep {...commonProps} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 4 && (
              <ConfirmationStep
                {...commonProps}
                prevStep={prevStep}
                onSubmit={() => handleSubmit(teams, tournaments)}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default NewMatch;
