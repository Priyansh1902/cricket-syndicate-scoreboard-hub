
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { StepProps } from "../types";

export function TeamSelectionStep({ matchDetails, handleSelectChange, nextStep, teams }: StepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Select Teams</CardTitle>
        <CardDescription className="text-gray-400">Choose the two teams that will play in this match</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="team1">Team 1</Label>
          <Select 
            value={matchDetails.team1Id} 
            onValueChange={(value) => handleSelectChange('team1Id', value)}
          >
            <SelectTrigger className="cricket-input">
              <SelectValue placeholder="Select Team 1" />
            </SelectTrigger>
            <SelectContent className="bg-cricket-dark border-cricket-border">
              {teams.map(team => (
                <SelectItem 
                  key={team.id} 
                  value={team.id}
                  disabled={team.id === matchDetails.team2Id}
                >
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team2">Team 2</Label>
          <Select 
            value={matchDetails.team2Id} 
            onValueChange={(value) => handleSelectChange('team2Id', value)}
          >
            <SelectTrigger className="cricket-input">
              <SelectValue placeholder="Select Team 2" />
            </SelectTrigger>
            <SelectContent className="bg-cricket-dark border-cricket-border">
              {teams.map(team => (
                <SelectItem 
                  key={team.id} 
                  value={team.id}
                  disabled={team.id === matchDetails.team1Id}
                >
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 text-center">
          <Button className="cricket-button" onClick={nextStep}>
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </>
  );
}
