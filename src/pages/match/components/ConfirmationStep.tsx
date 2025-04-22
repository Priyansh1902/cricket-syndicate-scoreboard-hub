
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { StepProps } from "../types";
import { Team, Tournament } from "@/types";

export function ConfirmationStep({ 
  matchDetails, 
  prevStep, 
  teams, 
  tournaments, 
  isLoading, 
  onSubmit 
}: StepProps) {
  const findTeam = (id: string): Team | undefined => 
    teams.find(t => t.id === id);
  
  const findTournament = (id: string): Tournament | undefined => 
    tournaments?.find(t => t.id === id);

  return (
    <>
      <CardHeader>
        <CardTitle>Confirm Match Details</CardTitle>
        <CardDescription className="text-gray-400">Review and create the match</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="bg-cricket-darker w-full grid grid-cols-3">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="details">Match Details</TabsTrigger>
              <TabsTrigger value="toss">Toss Details</TabsTrigger>
            </TabsList>
            <TabsContent value="teams" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Team 1</h3>
                  <p className="font-semibold mt-1">
                    {findTeam(matchDetails.team1Id)?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Team 2</h3>
                  <p className="font-semibold mt-1">
                    {findTeam(matchDetails.team2Id)?.name || 'Not selected'}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Date</h3>
                  <p className="font-semibold mt-1">{matchDetails.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Venue</h3>
                  <p className="font-semibold mt-1">{matchDetails.venue || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Overs</h3>
                  <p className="font-semibold mt-1">{matchDetails.overs}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Tournament</h3>
                  <p className="font-semibold mt-1">
                    {findTournament(matchDetails.tournamentId)?.name || 'None'}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="toss" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Toss Winner</h3>
                  <p className="font-semibold mt-1">
                    {findTeam(matchDetails.tossWinnerId)?.name || 'Not selected'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Batting First</h3>
                  <p className="font-semibold mt-1">
                    {findTeam(matchDetails.battingFirstId)?.name || 'Not selected'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" className="border-cricket-border text-white" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button 
              className="cricket-button" 
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Match'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
