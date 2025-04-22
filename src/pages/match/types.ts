
import { Team, Tournament } from "@/types";

export interface MatchFormData {
  date: string;
  venue: string;
  overs: string;
  team1Id: string;
  team2Id: string;
  tournamentId: string;
  tossWinnerId: string;
  battingFirstId: string;
}

export interface StepProps {
  matchDetails: MatchFormData;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  nextStep?: () => void;
  prevStep?: () => void;
  teams: Team[];
  tournaments?: Tournament[];
  isLoading?: boolean;
  onSubmit?: () => void;
}
