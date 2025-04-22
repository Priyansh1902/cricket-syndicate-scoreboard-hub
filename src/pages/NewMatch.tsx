
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Calendar, Info, Users, Trophy, Clock } from "lucide-react";
import { getTeams, getTournaments, createMatch } from "@/lib/supabase";
import { Team, Tournament } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const NewMatch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [matchDetails, setMatchDetails] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    venue: '',
    overs: '20',
    team1Id: '',
    team2Id: '',
    tournamentId: '',
    tossWinnerId: '',
    battingFirstId: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMatchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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
      
      const matchData = {
        date: new Date(matchDetails.date),
        venue: matchDetails.venue,
        overs: parseInt(matchDetails.overs),
        teams: {
          team1,
          team2
        },
        tossWinner,
        battingFirst,
        status: 'Upcoming' as const,
        tournament: tournament || undefined
      };
      
      const result = await createMatch(matchData);
      
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

  if (isLoading && teams.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cricket-darkest">
        <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            {currentStep === 1 && (
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
            )}

            {currentStep === 2 && (
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
                        {tournaments.map(tournament => (
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
            )}

            {currentStep === 3 && (
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
                        {[
                          teams.find(t => t.id === matchDetails.team1Id),
                          teams.find(t => t.id === matchDetails.team2Id)
                        ].filter(Boolean).map(team => (
                          <SelectItem key={team!.id} value={team!.id}>
                            {team!.name}
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
                        {[
                          teams.find(t => t.id === matchDetails.team1Id),
                          teams.find(t => t.id === matchDetails.team2Id)
                        ].filter(Boolean).map(team => (
                          <SelectItem key={team!.id} value={team!.id}>
                            {team!.name}
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
            )}

            {currentStep === 4 && (
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
                              {teams.find(t => t.id === matchDetails.team1Id)?.name || 'Not selected'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-400">Team 2</h3>
                            <p className="font-semibold mt-1">
                              {teams.find(t => t.id === matchDetails.team2Id)?.name || 'Not selected'}
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
                              {tournaments.find(t => t.id === matchDetails.tournamentId)?.name || 'None'}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="toss" className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-400">Toss Winner</h3>
                            <p className="font-semibold mt-1">
                              {teams.find(t => t.id === matchDetails.tossWinnerId)?.name || 'Not selected'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-400">Batting First</h3>
                            <p className="font-semibold mt-1">
                              {teams.find(t => t.id === matchDetails.battingFirstId)?.name || 'Not selected'}
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
                        onClick={handleSubmit}
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
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewMatch;
