
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { getPlayers } from "@/lib/supabase";
import { Player } from "@/types";
import { PlayerSearch } from "@/components/player/PlayerSearch";
import { PlayerList } from "@/components/player/PlayerList";

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
        player.bowlingType !== "None"
      ));
    } else if (type === "all-rounder") {
      setFilteredPlayers(players.filter(player => 
        player.bowlingType !== "None" && player.battingHand !== "None" 
      ));
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <PlayerSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onTabChange={filterPlayersByType}
            />
            <PlayerList 
              players={filteredPlayers}
              searchQuery={searchQuery}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Players;
