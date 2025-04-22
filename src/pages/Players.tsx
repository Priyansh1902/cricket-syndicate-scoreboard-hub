
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, User, Search, ChevronRight } from "lucide-react";
import { getPlayers } from "@/lib/supabase";
import { Player } from "@/types";

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    async function loadPlayers() {
      setIsLoading(true);
      try {
        const playerData = await getPlayers();
        setPlayers(playerData as Player[]);
        setFilteredPlayers(playerData as Player[]);
      } catch (error) {
        console.error("Failed to load players:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      filterPlayersByType(currentTab);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = players.filter(player => 
        player.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players, currentTab]);

  const filterPlayersByType = (type: string) => {
    setCurrentTab(type);
    if (type === "all") {
      setFilteredPlayers(players);
    } else if (type === "batsman") {
      setFilteredPlayers(players.filter(player => player.bowlingType === "None"));
    } else if (type === "bowler") {
      setFilteredPlayers(players.filter(player => 
        player.bowlingType === "Spinner" || player.bowlingType === "Pacer"
      ));
    } else if (type === "all-rounder") {
      setFilteredPlayers(players.filter(player => player.bowlingType === "All-rounder"));
    }
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
              Cricket Syndicate
            </Link>
            <h1 className="text-2xl font-bold mt-1">Players</h1>
          </div>
          <Button className="cricket-button" asChild>
            <Link to="/players/new">
              <UserPlus className="w-4 h-4 mr-2" />
              New Player
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search players..."
              className="cricket-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={filterPlayersByType}>
            <TabsList className="bg-cricket-darker grid grid-cols-4 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="batsman">Batsmen</TabsTrigger>
              <TabsTrigger value="bowler">Bowlers</TabsTrigger>
              <TabsTrigger value="all-rounder">All Rounders</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <User className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {searchQuery ? "No Results Found" : "No Players Yet"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? "Try a different search term" 
                    : "Add your first player to get started"}
                </p>
                {!searchQuery && (
                  <Button className="cricket-button" asChild>
                    <Link to="/players/new">Add Player</Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <Card className="cricket-card overflow-hidden">
      <div className="h-40 bg-cricket-darker flex items-center justify-center">
        {player.photoUrl ? (
          <img 
            src={player.photoUrl} 
            alt={player.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-16 w-16 text-gray-500" />
        )}
      </div>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-bold">{player.name}</h2>
      </CardHeader>
      <CardContent className="pb-2 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-400">Batting</p>
            <p className="font-medium">{player.battingHand}</p>
          </div>
          <div>
            <p className="text-gray-400">Bowling</p>
            <p className="font-medium">
              {player.bowlingType === "None" ? "-" : `${player.bowlingHand} ${player.bowlingType}`}
            </p>
          </div>
        </div>
        
        {player.teams && player.teams.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm">Teams</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {player.teams.slice(0, 2).map(team => (
                <span 
                  key={team.id} 
                  className="text-xs bg-cricket-darker text-white px-2 py-1 rounded-full"
                >
                  {team.name}
                </span>
              ))}
              {player.teams.length > 2 && (
                <span className="text-xs bg-cricket-darker text-white px-2 py-1 rounded-full">
                  +{player.teams.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-cricket-primary hover:text-white hover:bg-cricket-primary/20"
          asChild
        >
          <Link to={`/players/${player.id}`}>
            View Profile
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Players;
