
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { UserPlus, Users, ChevronRight, UserCircle } from "lucide-react";
import { getTeams } from "@/lib/supabase";
import { Team } from "@/types";

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      setIsLoading(true);
      try {
        const teamData = await getTeams();
        setTeams(teamData as Team[]);
      } catch (error) {
        console.error("Failed to load teams:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTeams();
  }, []);

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
              Cricket Syndicate
            </Link>
            <h1 className="text-2xl font-bold mt-1">Teams</h1>
          </div>
          <Button className="cricket-button" asChild>
            <Link to="/teams/new">
              <UserPlus className="w-4 h-4 mr-2" />
              New Team
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {teams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Teams Yet</h2>
                <p className="text-gray-400 mb-6">Create your first team to get started</p>
                <Button className="cricket-button" asChild>
                  <Link to="/teams/new">Create Team</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Card className="cricket-card overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-cricket-primary to-cricket-accent flex items-center justify-center">
        {team.logoUrl ? (
          <img 
            src={team.logoUrl} 
            alt={`${team.name} logo`} 
            className="h-16 w-16 object-contain"
          />
        ) : (
          <Users className="h-16 w-16 text-white" />
        )}
      </div>
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold">{team.name}</h2>
        <div className="text-sm text-gray-400">
          {team.players?.length || 0} players
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {team.captain && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cricket-darker rounded-full flex items-center justify-center mr-3">
                {team.captain.photoUrl ? (
                  <img 
                    src={team.captain.photoUrl}
                    alt={team.captain.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-cricket-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{team.captain.name}</p>
                <p className="text-xs text-gray-400">Captain</p>
              </div>
            </div>
          )}
          
          {team.viceCaptain && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cricket-darker rounded-full flex items-center justify-center mr-3">
                {team.viceCaptain.photoUrl ? (
                  <img 
                    src={team.viceCaptain.photoUrl}
                    alt={team.viceCaptain.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-cricket-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{team.viceCaptain.name}</p>
                <p className="text-xs text-gray-400">Vice Captain</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-cricket-primary hover:text-white hover:bg-cricket-primary/20"
          asChild
        >
          <Link to={`/teams/${team.id}`}>
            View Team Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Teams;
