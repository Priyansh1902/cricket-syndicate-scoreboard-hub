
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { StepProps } from "../types";

export function MatchDetailsStep({ matchDetails, handleInputChange, handleSelectChange, nextStep, prevStep, tournaments }: StepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Match Details</CardTitle>
        <CardDescription className="text-gray-400">Enter the details for this match</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Match Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="date"
              name="date"
              type="date"
              value={matchDetails.date}
              onChange={handleInputChange}
              className="cricket-input pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="venue">Venue (Optional)</Label>
          <Input
            id="venue"
            name="venue"
            placeholder="Enter venue name"
            value={matchDetails.venue}
            onChange={handleInputChange}
            className="cricket-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="overs">Number of Overs</Label>
          <Input
            id="overs"
            name="overs"
            type="number"
            min="1"
            max="50"
            value={matchDetails.overs}
            onChange={handleInputChange}
            className="cricket-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tournament">Tournament (Optional)</Label>
          <Select 
            value={matchDetails.tournamentId} 
            onValueChange={(value) => handleSelectChange('tournamentId', value)}
          >
            <SelectTrigger className="cricket-input">
              <SelectValue placeholder="Select Tournament" />
            </SelectTrigger>
            <SelectContent className="bg-cricket-dark border-cricket-border">
              <SelectItem value="">None</SelectItem>
              {tournaments?.map(tournament => (
                <SelectItem key={tournament.id} value={tournament.id}>
                  {tournament.name}
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
