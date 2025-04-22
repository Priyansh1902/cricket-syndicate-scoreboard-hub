
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Team, Tournament } from "@/types";
import { createMatch } from "@/lib/supabase";
import { MatchFormData } from "../types";
import { format } from "date-fns";

export function useMatchForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [matchDetails, setMatchDetails] = useState<MatchFormData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    venue: '',
    overs: '20',
    team1Id: '',
    team2Id: '',
    tournamentId: '',
    tossWinnerId: '',
    battingFirstId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1 && (!matchDetails.team1Id || !matchDetails.team2Id)) {
      toast.error("Please select both teams");
      return;
    }
    
    if (currentStep === 3 && (!matchDetails.tossWinnerId || !matchDetails.battingFirstId)) {
      toast.error("Please select toss winner and batting first team");
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (teams: Team[], tournaments: Tournament[]) => {
    try {
      setIsLoading(true);
      
      const team1 = teams.find(t => t.id === matchDetails.team1Id);
      const team2 = teams.find(t => t.id === matchDetails.team2Id);
      const tossWinner = teams.find(t => t.id === matchDetails.tossWinnerId);
      const battingFirst = teams.find(t => t.id === matchDetails.battingFirstId);
      const tournament = tournaments.find(t => t.id === matchDetails.tournamentId);
      
      if (!team1 || !team2) {
        toast.error("Please select both teams");
        return;
      }
      
      const result = await createMatch({
        date: new Date(matchDetails.date),
        venue: matchDetails.venue,
        overs: parseInt(matchDetails.overs),
        team1Id: team1.id,
        team2Id: team2.id,
        tossWinner,
        battingFirst,
        status: 'Upcoming',
        tournament: tournament
      });
      
      if (result) {
        toast.success("Match created successfully");
        navigate(`/matches/${result.id}`);
      }
    } catch (error) {
      console.error("Failed to create match:", error);
      toast.error("Failed to create match");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    matchDetails,
    isLoading,
    handleInputChange,
    handleSelectChange,
    nextStep,
    prevStep,
    handleSubmit
  };
}
