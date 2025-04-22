
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User, Edit, ChevronRight } from "lucide-react";
import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
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
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-cricket-primary hover:text-white hover:bg-cricket-primary/20"
          asChild
        >
          <Link to={`/players/edit/${player.id}`}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-cricket-primary hover:text-white hover:bg-cricket-primary/20"
          asChild
        >
          <Link to={`/players/${player.id}`}>
            View
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
