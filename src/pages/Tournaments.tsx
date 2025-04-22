
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, Users, ChevronRight, Plus } from "lucide-react";
import { getTournaments } from "@/lib/supabase";
import { Tournament } from "@/types";
import { format } from "date-fns";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTournaments() {
      setIsLoading(true);
      try {
        const tournamentData = await getTournaments();
        setTournaments(tournamentData as Tournament[]);
      } catch (error) {
        console.error("Failed to load tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTournaments();
  }, []);

  // Group tournaments by status
  const groupedTournaments = {
    ongoing: tournaments.filter(t => t.status === 'Ongoing'),
    upcoming: tournaments.filter(t => t.status === 'Upcoming'),
    completed: tournaments.filter(t => t.status === 'Completed')
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
              Cricket Syndicate
            </Link>
            <h1 className="text-2xl font-bold mt-1">Tournaments</h1>
          </div>
          <Button className="cricket-button" asChild>
            <Link to="/tournaments/new">
              <Plus className="w-4 h-4 mr-2" />
              New Tournament
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
            {tournaments.length > 0 ? (
              <>
                {/* Ongoing Tournaments */}
                {groupedTournaments.ongoing.length > 0 && (
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <div className="w-3 h-3 bg-cricket-primary rounded-full mr-2 animate-pulse"></div>
                      Ongoing Tournaments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTournaments.ongoing.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Upcoming Tournaments */}
                {groupedTournaments.upcoming.length > 0 && (
                  <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Tournaments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTournaments.upcoming.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Completed Tournaments */}
                {groupedTournaments.completed.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Completed Tournaments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTournaments.completed.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Tournaments Yet</h2>
                <p className="text-gray-400 mb-6">Create your first tournament to get started</p>
                <Button className="cricket-button" asChild>
                  <Link to="/tournaments/new">Create Tournament</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return <span className="px-2 py-1 bg-cricket-primary/20 text-cricket-primary text-xs rounded-full">Ongoing</span>;
      case 'Upcoming':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Upcoming</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="cricket-card overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-cricket-primary to-cricket-accent flex items-center justify-center">
        <Trophy className="h-10 w-10 text-white" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tournament.name}</CardTitle>
          {getStatusBadge(tournament.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <span className="text-gray-400">Starts: </span>
              {tournament.startDate instanceof Date 
                ? format(tournament.startDate, 'dd MMM yyyy')
                : format(new Date(tournament.startDate), 'dd MMM yyyy')}
            </div>
          </div>
          
          {tournament.endDate && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <div>
                <span className="text-gray-400">Ends: </span>
                {tournament.endDate instanceof Date 
                  ? format(tournament.endDate, 'dd MMM yyyy')
                  : format(new Date(tournament.endDate), 'dd MMM yyyy')}
              </div>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <span className="text-gray-400">Teams: </span>
              {tournament.teams?.length || 0}
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-cricket-primary hover:text-white hover:bg-cricket-primary/20"
              asChild
            >
              <Link to={`/tournaments/${tournament.id}`}>
                View Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tournaments;
