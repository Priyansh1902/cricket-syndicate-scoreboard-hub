
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepProps } from "../types";

export function TossDetailsStep({ matchDetails, handleSelectChange, nextStep, prevStep, teams }: StepProps) {
  const selectedTeams = teams.filter(t => 
    t.id === matchDetails.team1Id || t.id === matchDetails.team2Id
  );

  return (
    <>
      <CardHeader>
        <CardTitle>Toss Details</CardTitle>
        <CardDescription className="text-gray-400">Enter the toss details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tossWinner">Toss Winner</Label>
          <Select 
            value={matchDetails.tossWinnerId} 
            onValueChange={(value) => handleSelectChange('tossWinnerId', value)}
          >
            <SelectTrigger className="cricket-input">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent className="bg-cricket-dark border-cricket-border">
              {selectedTeams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="battingFirst">Batting First</Label>
          <Select 
            value={matchDetails.battingFirstId} 
            onValueChange={(value) => handleSelectChange('battingFirstId', value)}
          >
            <SelectTrigger className="cricket-input">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent className="bg-cricket-dark border-cricket-border">
              {selectedTeams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" className="border-cricket-border text-white" onClick={prevStep}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button className="cricket-button" onClick={nextStep}>
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </>
  );
}
