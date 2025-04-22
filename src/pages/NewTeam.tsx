
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, 
  ChevronsUpDown, 
  ArrowLeft, 
  Upload, 
  Users 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTeam, getPlayers } from "@/lib/supabase";
import { toast } from "sonner";
import { Player } from "@/types";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  captain_id: z.string().optional(),
  vice_captain_id: z.string().optional(),
  wicket_keeper_id: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

const NewTeam = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      captain_id: undefined,
      vice_captain_id: undefined,
      wicket_keeper_id: undefined,
    },
  });

  useEffect(() => {
    async function loadPlayers() {
      setIsLoading(true);
      try {
        const playerData = await getPlayers();
        setPlayers(playerData as Player[]);
      } catch (error) {
        console.error("Failed to load players:", error);
        toast.error("Failed to load players");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const togglePlayer = (player: Player) => {
    setSelectedPlayers((prev) => {
      if (prev.find(p => p.id === player.id)) {
        return prev.filter(p => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  const onSubmit = async (values: TeamFormValues) => {
    if (selectedPlayers.length === 0) {
      toast.error("Please select at least one player for the team");
      return;
    }

    setIsSubmitting(true);
    try {
      const captain = players.find(p => p.id === values.captain_id);
      const viceCaptain = players.find(p => p.id === values.vice_captain_id);
      const wicketKeeper = players.find(p => p.id === values.wicket_keeper_id);

      const teamData = {
        name: values.name,
        logoUrl: logoPreview || undefined,
        players: selectedPlayers,
        captain: captain,
        viceCaptain: viceCaptain,
        wicketKeeper: wicketKeeper,
      };

      const team = await createTeam(teamData);
      if (team) {
        toast.success("Team created successfully!");
        navigate("/teams");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cricket-darkest text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-cricket-border">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/teams">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <Link to="/" className="text-cricket-primary hover:text-cricket-accent font-bold text-xl">
                Cricket Syndicate
              </Link>
              <h1 className="text-2xl font-bold mt-1">New Team</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="cricket-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Team Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-cricket-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-cricket-darker flex items-center justify-center mb-4 overflow-hidden">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Team logo preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-16 w-16 text-gray-500" />
                      )}
                    </div>
                    <label htmlFor="logo-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      <input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter team name" {...field} className="cricket-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Select Players</FormLabel>
                    <div className="border border-cricket-border rounded-md p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPlayers.length === 0 ? (
                          <div className="text-gray-400 text-sm">No players selected</div>
                        ) : (
                          selectedPlayers.map(player => (
                            <Badge 
                              key={player.id} 
                              className="bg-cricket-primary/20 hover:bg-cricket-primary/30 cursor-pointer"
                              onClick={() => togglePlayer(player)}
                            >
                              {player.name} ×
                            </Badge>
                          ))
                        )}
                      </div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Add Players
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search players..." />
                            <CommandEmpty>No players found.</CommandEmpty>
                            <CommandGroup>
                              {players.map((player) => (
                                <CommandItem
                                  key={player.id}
                                  value={player.id}
                                  onSelect={() => togglePlayer(player)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPlayers.some(p => p.id === player.id) 
                                        ? "opacity-100" 
                                        : "opacity-0"
                                    )}
                                  />
                                  {player.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="captain_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Captain</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="cricket-input">
                                <SelectValue placeholder="Select captain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedPlayers.map(player => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vice_captain_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vice Captain</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="cricket-input">
                                <SelectValue placeholder="Select vice captain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedPlayers.map(player => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wicket_keeper_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wicket Keeper</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="cricket-input">
                                <SelectValue placeholder="Select wicket keeper" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedPlayers.map(player => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/teams")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="cricket-button" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Team"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewTeam;
