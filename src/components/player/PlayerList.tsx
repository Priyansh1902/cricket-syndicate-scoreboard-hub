
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "./PlayerCard";
import { Player } from "@/types";

interface PlayerListProps {
  players: Player[];
  searchQuery: string;
}

export const PlayerList = ({ players, searchQuery }: PlayerListProps) => {
  if (players.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {players.map(player => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};
