
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
