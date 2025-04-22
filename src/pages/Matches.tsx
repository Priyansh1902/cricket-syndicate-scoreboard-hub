
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, ChevronRight, Play } from "lucide-react";
import { getMatches } from "@/lib/supabase";
import { Match } from "@/types";
import { format } from "date-fns";

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const matchData = await getMatches();
        setMatches(matchData as Match[]);
      } catch (error) {
        console.error("Failed to load matches:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMatches();
  }, []);

  const groupedMatches = {
    live: matches.filter(match => match.status === 'Live'),
    upcoming: matches.filter(match => match.status === 'Upcoming'),
    completed: matches.filter(match => match.status === 'Completed' || match.status === 'Super Over')
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
              Cricket Syndicate
            </Link>
            <h1 className="text-2xl font-bold mt-1">Matches</h1>
          </div>
          <Button className="cricket-button" asChild>
            <Link to="/matches/new">
              <Play className="w-4 h-4 mr-2" />
              New Match
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
            {/* Live Matches */}
            {groupedMatches.live.length > 0 && (
              <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <span className="inline-block w-3 h-3 bg-cricket-danger rounded-full mr-2 animate-pulse"></span>
                    Live Matches
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMatches.live.map(match => (
                    <MatchCard key={match.id} match={match} isLive={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Matches */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
              {groupedMatches.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMatches.upcoming.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <Card className="bg-cricket-dark border-cricket-border">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">No upcoming matches scheduled</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Completed Matches */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Completed Matches</h2>
              {groupedMatches.completed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMatches.completed.map(match => (
                    <MatchCard key={match.id} match={match} isCompleted={true} />
                  ))}
                </div>
              ) : (
                <Card className="bg-cricket-dark border-cricket-border">
                  <CardContent className="pt-6">
                    <p className="text-gray-400 text-center">No completed matches yet</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  isLive?: boolean;
  isCompleted?: boolean;
}

const MatchCard = ({ match, isLive, isCompleted }: MatchCardProps) => {
  return (
    <Card className="cricket-card overflow-hidden">
      {match.tournament && (
        <div className="bg-cricket-primary/20 text-cricket-primary text-xs font-medium px-3 py-1">
          {match.tournament.name}
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg font-bold">{match.teams.team1.name} vs {match.teams.team2.name}</span>
          {isLive && <span className="text-xs bg-cricket-danger text-white px-2 py-1 rounded-full">LIVE</span>}
        </CardTitle>
        <div className="text-sm text-gray-400 flex items-center mt-1">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {match.date instanceof Date
            ? format(match.date, 'dd MMM yyyy')
            : format(new Date(match.date), 'dd MMM yyyy')}
        </div>
        {match.venue && (
          <div className="text-sm text-gray-400 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {match.venue}
          </div>
        )}
        <div className="text-sm text-gray-400 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {match.overs} overs
        </div>
      </CardHeader>
      <CardContent>
        {isCompleted && match.result ? (
          <div className="mb-3">
            <div className="text-sm font-medium">
              {match.result.winner.name} won by {match.result.margin}
            </div>
            {match.result.manOfTheMatch && (
              <div className="text-xs text-gray-400 mt-1">
                Man of the Match: {match.result.manOfTheMatch.name}
              </div>
            )}
          </div>
        ) : isLive ? (
          <div className="bg-gradient-to-r from-cricket-dark to-cricket-darker p-3 rounded-md mb-3">
            {match.innings && match.innings.length > 0 && (
              <div className="text-sm">
                <div className="font-medium">{match.innings[match.innings.length - 1].teamBatting.name}</div>
                <div className="text-xl font-bold mt-1">
                  {match.innings[match.innings.length - 1].totalRuns}/{match.innings[match.innings.length - 1].totalWickets}
                </div>
              </div>
            )}
          </div>
        ) : null}
        <div className="flex justify-between items-center mt-2">
          <Button variant="ghost" className="text-xs text-cricket-primary hover:text-white hover:bg-cricket-primary/20 px-2" asChild>
            <Link to={`/matches/${match.id}`}>
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          {isLive && (
            <Button className="cricket-button text-xs" asChild>
              <Link to={`/matches/${match.id}/live`}>
                <Play className="w-3 h-3 mr-1" />
                Scoreboard
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Matches;
