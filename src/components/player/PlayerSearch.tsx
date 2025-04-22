
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlayerSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: string) => void;
}

export const PlayerSearch = ({ searchQuery, onSearchChange, onTabChange }: PlayerSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search players..."
          className="cricket-input pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={onTabChange}>
        <TabsList className="bg-cricket-darker grid grid-cols-4 sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="batsman">Batsmen</TabsTrigger>
          <TabsTrigger value="bowler">Bowlers</TabsTrigger>
          <TabsTrigger value="all-rounder">All Rounders</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
